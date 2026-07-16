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
    let semester_id = req.query.semester_id
    if (!semester_id || typeof semester_id !== 'string') {
        return res.status(400).json({ error: 'semester_id is required'})
    }

    // Check if the user is an admin
    const userRole = await getServerSideUserRole({ req, res } as any);
    if (userRole !== 'admin') {
        return res.status(403).json({ error: 'Forbidden' });
    }

    function formatHours(decimalHours: number | string) {
        const totalMinutes = Math.round(Number(decimalHours) * 60);
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        return `${hours}h ${minutes}m`;
    }

    const supabase = createClient({ req, res } as any)

    // Resolve "current" to the actual active semester's id
    if (semester_id === 'current') {
        const { data: currentSemester } = await supabase
            .from('semesters')
            .select('id')
            .eq('is_current', true)
            .single()

        if (!currentSemester) {
            return res.status(404).json({ error: 'No active semester to generate a report for.' })
        }
        semester_id = currentSemester.id
    }

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

    const rawSessionRows = sessions ?? []
    const feedbackRows = feedback ?? []
    const mentorRows = mentors ?? []

    // Prevent group sessions increasing session hours
    const sessionMap = new Map();
    rawSessionRows.forEach((row) => {
        const isGroup = row.tutorial_mode?.toLowerCase().includes('group');
        const key = row.group_id || 
            (isGroup 
                ? `${row.date}_${row.schedule_start}_${row.schedule_end}_${row.subject_code}_${row.topic}_${row.booking_status}_${row.mentor_id}`
                : row.id);

        if (!sessionMap.has(key)) {
            sessionMap.set(key, { ...row, groupCount: 1 });
        } else {
            const existing = sessionMap.get(key);
            existing.groupCount += 1;
            existing.student_name = `${existing.groupCount} Students (Group)`;
        }
    });

    const deduplicatedSessions = Array.from(sessionMap.values());

    // Construct mentor performance details
    const mentorPerformance = mentorRows.map((mentor) => {
        const mentorCompletedSessions = deduplicatedSessions.filter(
            (session) => session.mentor_id === mentor.id && session.booking_status === 'completed'
        );

        const sessionsCompleted = mentorCompletedSessions.length;

        let rawHours = 0;
        mentorCompletedSessions.forEach((session) => {
            const start = new Date(session.schedule_start).getTime();
            const end = new Date(session.schedule_end).getTime();
            rawHours += Math.max(0, (end - start) / 3600000);
        });

        // Calculate feedback rating
        const mentorFeedback = feedbackRows
            .filter((feedback) => feedback.mentor_id === mentor.id)
            .map((row) => Number(row.average_rating))
            .filter((rating) => !isNaN(rating) && rating > 0);
        const averageRatings = mentorFeedback.length > 0
            ? (mentorFeedback.reduce((sum, rating) => sum + rating, 0) / mentorFeedback.length)
            : 'N/A'

        return {
            mentor_name: mentor.mentor_name,
            program:  mentor.program,
            year_level: mentor.year_level,
            sessions_completed: sessionsCompleted,
            hours_rendered: formatHours(rawHours),
            raw_hours: rawHours,
            average_rating: averageRatings,
        }
    });

    const validRatings = feedbackRows
        .map((row) => Number(row.average_rating))
        .filter((rating) => !isNaN(rating) && rating > 0);

    const overallAverageRating = validRatings.length > 0
        ? (validRatings.reduce((sum, rating) => sum + rating, 0) / validRatings.length)
        : 'N/A';

    const summary = {
        // Labels
        semesterLabel: `${TERM_LABELS[semester.term]} AY ${semester.ay_start} - ${semester.ay_start + 1}`,
        semesterStart: semester.semester_start,
        semesterEnd: semester.semester_end,

        // Student + Mentor data
        uniqueStudents: new Set(rawSessionRows.map((student) => student.student_id)).size,
        activeMentors: mentorPerformance.filter((mentor) => mentor.sessions_completed > 0).length,

        // Session data
        totalSessions: deduplicatedSessions.length,
        completed: deduplicatedSessions.filter((session) => session.booking_status === 'completed').length,
        cancelled: deduplicatedSessions.filter((session) => session.booking_status === 'cancelled').length,
        rejected: deduplicatedSessions.filter((session) => session.booking_status === 'rejected').length,
        noShow: deduplicatedSessions.filter((session) => session.booking_status === 'no_show').length,
        totalHours: formatHours(mentorPerformance.reduce((sum, mentor) => sum + mentor.raw_hours, 0)),
        feedbackCount: feedbackRows.length,
        averageRating: overallAverageRating
    }

    // Build Excel file
    const workbook = new ExcelJS.Workbook()
    buildSummarySheet(workbook, summary)
    buildSessionSheet(workbook, deduplicatedSessions) 
    buildFeedbackList(workbook, feedbackRows)
    buildMentorList(workbook, mentorPerformance)

    const buffer = await workbook.xlsx.writeBuffer()

    const formattedSemesterLabel = TERM_LABELS[semester.term].replace(/[^a-z0-9]/gi, '-');

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    res.setHeader('Content-Disposition', `attachment; filename="LRC-Report-${formattedSemesterLabel}-AY-${semester.ay_start}-${semester.ay_start + 1}.xlsx"`)
    res.send(buffer)
}