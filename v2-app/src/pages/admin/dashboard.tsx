import { GetServerSideProps } from "next"

// Configs
import { statCardsConfig } from "@/config/statCardsConfig"

// Components
import StatCard from "@/components/ui/StatCard";
import GlobalSearch from "@/components/ui/GlobalSearch";

// Types
import { SessionList } from "@/types/sessionList"
import { MentorList } from "@/types/mentorList"
import { StaffList } from "@/types/staffList"
import { TopMentor } from "@/types/topMentor"
import { TopSubject } from "@/types/topSubject"
import { CollegeActivity } from "@/types/collegeActivity"

// Utilities
import { createClient } from "@/utils/supabase/server"
import {MonthlyTrend} from "@/types/monthlyTrend";

// Database connection
export const getServerSideProps: GetServerSideProps = async (context) => {
    const supabase = createClient(context)

    // Fetch variable counts for stat cards
    const [result1, result2, result3, result4, result5, result6, result7, result8, result9, result10, result11, result12] = await Promise.all([
        // Total mentors
        supabase
            .from('mentor_profiles')
            .select('*', { count: 'exact', head: true }),

        // Total sessions today
        supabase
            .from('bookings')
            .select('*', { count: 'exact', head: true })
            .eq('booking_status', 'accepted')
            .eq('date', new Date().toISOString().split('T')[0]),

        // Total pending sessions
        supabase
            .from('bookings')
            .select('*', { count: 'exact', head: true })
            .eq('booking_status', 'pending'),

        // Average ratings
        supabase
            .from('feedback')
            .select('q1, q2, q3, q4, q5, q6, q7, q8, q9'),

        // Total students
        supabase
            .from('student_profiles')
            .select('*', { count: 'exact', head: true }),

        // Booking details
        supabase
            .from('booking_details')
            .select('*'),

        // Staff details
        supabase
            .from('staff_details')
            .select('*'),

        // Mentor details
        supabase
            .from('mentor_details')
            .select('*'),

        // Top mentors
        supabase.rpc('get_top_mentors'),

        // Top subjects
        supabase.rpc('get_top_subjects'),

        // College activity
        supabase.rpc('get_college_activity'),

        // Monthly trends
        supabase.rpc('get_monthly_trends')
    ])

    const totalMentors = result1.count
    const totalSessionsToday = result2.count
    const totalPendingSessions = result3.count
    const totalStudents = result5.count
    const staffList = result7.data ?? []
    const topMentors = result9.data ?? []
    const topSubjects = result10.data ?? []
    const collegeActivity = result11.data ?? []
    const monthlyTrends = result12.data ?? []

    // Average feedback calculation
    const feedbackData = result4.data ?? []
    const rowAverage = feedbackData.map((feedback) => {
        const ratings = Object.values(feedback).filter((value) => value !== null)
        return ratings.reduce((total, sum) => total + (sum as number), 0) / ratings.length
    })
    const totalFeedbackAverage = rowAverage.length > 0
        ? rowAverage.reduce((total, sum) => total + sum, 0) / rowAverage.length
        : 0

    // Booking data
    const sessionList = (result6.data ?? []).map((booking) => ({
        id: booking.id,
        topic: booking.topic,
        date: booking.date,
        scheduleStart: booking.schedule_start,
        scheduleEnd: booking.schedule_end,
        bookingStatus: booking.booking_status,
        subject: booking.subject_code,
        mode: booking.tutorial_mode,
        mentorName: booking.mentor_name,
        studentName: booking.student_name
    }))

    // Mentor data
    const mentorList = (result8.data ?? []).map((mentor) => ({
        id: mentor.id,
        mentorName: mentor.mentor_name,
        email: mentor.email,
        yearLevel: mentor.year_level,
        degreeProgram: mentor.program
    }))

    return {
        props: {
            totalMentors: totalMentors ?? 0,
            totalSessionsToday: totalSessionsToday ?? 0,
            totalPendingSessions: totalPendingSessions ?? 0,
            totalFeedbackAverage: isNaN(totalFeedbackAverage) ? 0 : totalFeedbackAverage,
            totalStudents: totalStudents ?? 0,
            staffList,
            sessionList,
            mentorList,
            topMentors,
            topSubjects,
            collegeActivity,
            monthlyTrends
        }
    }
}

interface AdminDashboardProps {
    totalMentors: number
    totalSessionsToday: number
    totalPendingSessions: number
    totalStudents: number
    totalFeedbackAverage: number
    staffList: StaffList[]
    sessionList: SessionList[]
    mentorList: MentorList[]
    topMentors: TopMentor[]
    topSubjects: TopSubject[]
    collegeActivity: CollegeActivity[]
    monthlyTrends: MonthlyTrend[]
}

export default function AdminDashboard({ totalMentors, totalSessionsToday, totalPendingSessions, totalFeedbackAverage, totalStudents, staffList, sessionList, mentorList, topMentors, topSubjects, collegeActivity, monthlyTrends }: AdminDashboardProps) {
    const cards = statCardsConfig['admin'].cards
    const gridCols = statCardsConfig['admin'].gridCols
    const data: Record<string, number | string> = {
        totalMentors,
        totalStudents,
        totalSessionsToday,
        totalPendingSessions,
        totalFeedbackAverage: totalFeedbackAverage.toFixed(2) }

    return (
        <>
            <GlobalSearch mentorList={mentorList} sessionList={sessionList} staffList={staffList}
                          role="admin" placeholder="Search mentors, staff, or sessions..." />
            <div className={`grid ${gridCols} gap-4 w-full`}>
                {cards.map((card) => {
                    return (
                        <StatCard key={card.dataKey} label={card.label} value={data[card.dataKey]} href={card.href} color={card.color} icon={card.icon} />

                    )
                })}
            </div>
            <div>
                <h1>Hello Admin</h1>
                <p>Total Mentors: {totalMentors}</p>
                <p>Total Sessions Today: {totalSessionsToday}</p>
                <p>Total Pending Sessions: {totalPendingSessions}</p>
                <p>Total Feedback Average: {totalFeedbackAverage.toFixed(2)}</p>
                <p>Total Students: {totalStudents}</p>





            </div>
        </>
    )
}