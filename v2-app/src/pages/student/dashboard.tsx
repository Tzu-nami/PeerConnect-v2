import { GetServerSideProps } from "next"
import { useState } from "react"

// Components
import GlobalSearch from "@/components/ui/dashboard/GlobalSearch"
import StatCard from "@/components/ui/StatCard"
import TodaysSchedule from "@/components/ui/dashboard/TodaysSchedule"
import ScheduleCalendar from "@/components/ui/dashboard/ScheduleCalendar"

// Configs
import { dashboardDataConfig } from "@/config/dashboardDataConfig"

// Types
import { SessionList } from "@/types/sessionList"
import { MentorList } from "@/types/mentorList"
import { SubjectList } from "@/types/subjectList"

// Utilities
import { createClient } from "@/utils/supabase/server"
import { TODAY } from "@/utils/formatTime"
import UpcomingSessions from "@/components/ui/dashboard/UpcomingSessions";
import WeeklyScheduleGrid from "@/components/ui/dashboard/WeeklyScheduleGrid";

// Database connection
export const getServerSideProps: GetServerSideProps = async (context) => {
    const supabase = createClient(context)

    // Get user ID
    const { data: { user } } = await supabase.auth.getUser()
    const userId = user?.id

    // Get student ID
    const { data: studentProfile } = await supabase
        .from('student_profiles')
        .select('id')
        .eq('user_id', userId)
        .single()
    const studentId = studentProfile?.id

    // Fetch data from server
    const [result1, result2, result3, result4, result5, result6, result7] = await Promise.all([
        // Sessions today
        supabase
            .from('bookings')
            .select('*', { count: 'exact', head: true })
            .eq('booking_status', 'accepted')
            .eq('date', TODAY)
            .eq('student_id', studentId),

        // Pending requests
        supabase
            .from('bookings')
            .select('*', { count: 'exact', head: true })
            .eq('booking_status', 'pending')
            .gte('date', TODAY)
            .eq('student_id', studentId),

        // Completed sessions
        supabase
            .from('bookings')
            .select('*', { count: 'exact', head: true })
            .eq('booking_status', 'completed')
            .eq('student_id', studentId),

        // Favorite subject
        supabase.rpc('get_favorite_subject', { p_student_id: studentId }),

        // Session list
        supabase
            .from('booking_details')
            .select('*')
            .eq('student_id', studentId)
            .order('date', { ascending: true })
            .order('schedule_start', { ascending: true }),

        // Mentor list
        supabase
            .from('mentor_details')
            .select('*')
            .eq('student_id', studentId),

        // Subject list
        supabase
            .from('subjects')
            .select('id, code, name'),
    ])

    const sessionsToday = result1.count
    const pendingRequests = result2.count
    const completedSessions = result3.count
    const favoriteSubject = result4.data ?? 'N/A'

    // Booking data
    const sessionList = (result5.data ?? []).map((booking) => ({
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
    const mentorList = (result6.data ?? []).map((mentor) => ({
        id: mentor.id,
        mentorName: mentor.mentor_name,
        email: mentor.email,
        yearLevel: mentor.year_level,
        degreeProgram: mentor.program
    }))

    // Subject data
    const subjectList = (result7.data ?? []).map((subject) => ({
        id: subject.id,
        code: subject.code,
        name: subject.name
    }))

    // Groups sessions by date
    const sessionsByDate = sessionList.reduce((groupedByDate, session) => {
        if(!groupedByDate[session.date]) groupedByDate[session.date] = []
        groupedByDate[session.date].push(session)
        return groupedByDate
    }, {} as Record<string, SessionList[]>)

    const upcomingSessions = sessionList.filter((session) => session.bookingStatus === 'accepted')

    return {
        props: {
            sessionsToday: sessionsToday ?? 0,
            pendingRequests: pendingRequests ?? 0,
            completedSessions: completedSessions ?? 0,
            favoriteSubject,
            sessionList,
            upcomingSessions,
            sessionsByDate,
            mentorList,
            subjectList
        }
    }
}

interface StudentDashboardProps {
    sessionsToday: number
    pendingRequests: number
    completedSessions: number
    favoriteSubject: string
    sessionList: SessionList[]
    upcomingSessions: SessionList[]
    sessionsByDate: Record<string, SessionList[]>
    mentorList: MentorList[]
    subjectList: SubjectList[]
}

export default function StudentDashboard({ sessionList, upcomingSessions, sessionsByDate, mentorList, subjectList, sessionsToday, pendingRequests, completedSessions, favoriteSubject }: StudentDashboardProps) {
    // Stat cards
    const cards = dashboardDataConfig['student'].cards
    const gridCols = dashboardDataConfig['student'].gridCols
    const data: Record<string, number | string> = {
        sessionsToday,
        pendingRequests,
        completedSessions,
        favoriteSubject,
    }

    // Today's schedule table and calendar info
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
    const todaySessions = sessionList.filter((session) => session.date === selectedDate?.toLocaleDateString('en-CA'))
    const dateFormat = selectedDate?.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'Asia/Manila'})

    return (
        <>
            {/* Global search */}
            <GlobalSearch mentorList={mentorList} sessionList={sessionList} subjectList={subjectList}
                placeholder="Search mentors, subjects, or sessions..." role="student" />

            {/* Stat cards */}
            <div className={`grid ${gridCols} gap-4 w-full`}>
                {cards.map((card) => {
                    return (
                        <StatCard key={card.dataKey} label={card.label} value={data[card.dataKey]} href={card.href} borderColor={card.borderColor} icon={card.icon} iconColor={card.iconColor} />
                    )
                })}
            </div>

            {/* Grid content */}
            <div className="grid grid-cols-3 gap-6 mt-4 items-start">
                {/* LEFT COLUMN - Today's Schedule and  Weekly Grid stacked */}
                <div className="col-span-2 flex flex-col gap-6">
                    <div className="h-[560px]">
                        <TodaysSchedule  currentSessions={todaySessions} date={dateFormat} role="student" />
                    </div>

                    <WeeklyScheduleGrid sessionList={sessionList} role="student" />
                </div>

                {/* RIGHT COLUMN - Calendar and Pending Requests stacked */}

                <div className="col-span-1 flex flex-col gap-4">
                    <ScheduleCalendar sessionsByDate={sessionsByDate}
                                      today={TODAY}
                                      selectedDate={selectedDate}
                                      onDateSelect={(date) => {if (date) setSelectedDate(date)}} />

                    <UpcomingSessions upcomingSessions={upcomingSessions} />
                </div>
            </div>
        </>
    )
}