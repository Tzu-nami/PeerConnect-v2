import { NextApiRequest, NextApiResponse } from "next"
import ExcelJS from "exceljs"

// Constants
import {TERM_LABELS} from "@/constants/termLabels";

// Utilities
import { createClient } from "@/utils/supabase/server"
import { getServerSideUserRole } from "@/utils/getServerSideUserRole"
import { buildFeedbackList, buildMentorList, buildSessionSheet, buildSummarySheet } from "@/utils/reportExcel"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // Check if semester exists
    const semester_id = req.query.semester_id
    if (!semester_id || typeof  semester_id !== 'string') {
        return res.status(400).json({ error: 'semester_id is required'})
    }

    // Check if the user is an admin
    const userRole = await getServerSideUserRole({ req, res } as any);
    if (userRole !== 'admin') {
        return res.status(403).json({ error: 'Forbidden' });
    }

    const supabase = createClient({ req, res })

    // Fetch semesters
    const { data: semester } = await supabase
        .from('semesters')
        .select('*')
        .eq('id', semester_id)
        .single()

    if (!semester) {
        return res.status(404).json({ error: 'Semester not found' })
    }

    // Fetch detail views
    const [{ data: sessions }, { data: feedback }, { data: mentors }] = await Promise.all([
        // Fetch booking details list
        supabase.from('booking_details')
            .select('*')
            .eq('semester_id', semester_id)
            .order('date'),

        // Fetch feedback details list
        supabase.from('feedback_details')
            .select('*')
            .eq('semester_id', semester_id)
            .order('date_submitted'),

        // Fetch mentor details list
        supabase
            .from('mentor_details')
            .select('*'),
    ])

    const sessionRows = sessions ?? []
    const feedbackRows = feedback ?? []
    const mentorRows = mentors ?? []

    // Construct mentor performance details
    const mentorPerformance = await Promise.all(
        mentorRows.map(async (mentor) => {
            const { data: hours } = await supabase
                .rpc('get_rendered_hours', { p_mentor_id: mentor.id , p_semester_id: semester_id })

            const sessionsCompleted = sessionRows
                .filter((session) => session.mentor_id === mentor.id && session.booking_status === 'completed')
                .length

            const mentorFeedback = feedbackRows
                .filter((feedback) => feedback.mentor_id === mentor.id)
                .map((row) => row.average_rating)
                .filter((rating) => rating !== null)
            const averageRatings = mentorFeedback.length > 0
                ? (mentorFeedback.reduce((sum, rating) => sum + rating, 0) / mentorFeedback.length)
                : 'N/A'

            return {
                mentor_name: mentor.mentor_name,
                program:  mentor.program,
                year_level: mentor.year_level,
                sessions_completed: sessionsCompleted,
                hours_rendered: hours ?? 0,
                average_rating: averageRatings
            }
        })
    )

    const validRatings = feedbackRows
        .map((row) => row.average_rating)
        .filter((rating) => rating !== null);

    const overallAverageRating = validRatings.length > 0
        ? (validRatings.reduce((sum, rating) => sum + rating, 0) / validRatings.length)
        : 'N/A';

    const summary = {
        // Labels
        semesterLabel: `${TERM_LABELS[semester.term]} AY ${semester.ay_start} - ${semester.ay_start + 1}`,
        semesterStart: semester.semester_start,
        semesterEnd: semester.semester_end,

        // Student + Mentor data
        uniqueStudents: new Set(sessionRows.map((student) => student.student_id)).size,
        activeMentors: mentorPerformance.filter((mentor) => mentor.sessions_completed > 0).length,

        // Session data
        totalSessions: sessionRows.length,
        completed: sessionRows.filter((session) => session.booking_status === 'completed').length,
        cancelled: sessionRows.filter((session) => session.booking_status === 'cancelled').length,
        rejected: sessionRows.filter((session) => session.booking_status === 'rejected').length,
        noShow: sessionRows.filter((session) => session.booking_status === 'no_show').length,
        totalHours: mentorPerformance.reduce((sum, hours) => sum + Number(hours.hours_rendered), 0),
        feedbackCount: feedbackRows.length,
        averageRating: overallAverageRating
    }

    // Build Excel file
    const workbook = new ExcelJS.Workbook()
    buildSummarySheet(workbook, summary)
    buildSessionSheet(workbook, sessionRows)
    buildFeedbackList(workbook, feedbackRows)
    buildMentorList(workbook, mentorPerformance)

    const buffer = await workbook.xlsx.writeBuffer()

    const formattedSemesterLabel = TERM_LABELS[semester.term].replace(/[^a-z0-9]/gi, '-');

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    res.setHeader('Content-Disposition', `attachment; filename="LRC-Report-${formattedSemesterLabel}-AY-${semester.ay_start}-${semester.ay_start + 1}.xlsx"`)
    res.send(buffer)
}