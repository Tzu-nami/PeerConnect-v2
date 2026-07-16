import { GetServerSideProps } from "next"
import { useState } from "react"

// Configs
import { dashboardDataConfig } from "@/config/dashboardDataConfig"

// Components
import StatCard from "@/components/ui/StatCard";
import GlobalSearch from "@/components/ui/dashboard/GlobalSearch"
import TodaysSchedule from "@/components/ui/dashboard/TodaysSchedule"
import ScheduleCalendar from "@/components/ui/dashboard/ScheduleCalendar"
import QuickActions from "@/components/ui/dashboard/QuickActions"
import MonthlyTrends from "@/components/ui/charts/MonthlyTrends"
import TopMentors from "@/components/ui/charts/TopMentors"
import TopSubjects from "@/components/ui/charts/TopSubjects"
import CollegeBookings from "@/components/ui/charts/CollegeActivity"
import SatisfactionRate from "@/components/ui/charts/SatisfactionRate"


// Types
import { SessionList } from "@/types/sessionList"
import { MentorList } from "@/types/mentorList"
import { StaffList } from "@/types/staffList"
import { TopMentor } from "@/types/topMentor"
import { TopSubject } from "@/types/topSubject"
import { CollegeActivity } from "@/types/collegeActivity"
import { MonthlyTrend } from "@/types/monthlyTrend"
import { SatisfactionData } from "@/types/satisfactionData"

// Utilities
import { createClient } from "@/utils/supabase/server"
import { TODAY } from "@/utils/formatTime"
import { getRatingLabel } from "@/utils/getRatingLabel"
import {SubjectList} from "@/types/subjectList";


// Database connection
export const getServerSideProps: GetServerSideProps = async (context) => {
    const supabase = createClient(context)

    const { data: currentSemester } = await supabase
        .from('semesters')
        .select('id')
        .eq('is_current', true)
        .single()

    const semesterId = currentSemester?.id ?? null
    const hasActiveSemester = semesterId !== null

    // Fetch data from server
    const [result1, result2, result3, result4, result5, result6, result7, result8, result9, result10, result11, result12, result13] = await Promise.all([
        // Total mentors
        supabase
            .from('mentor_profiles')
            .select('*', { count: 'exact', head: true })
            .eq('is_active', true),

        // Total sessions today
        supabase
            .from('bookings')
            .select('*', { count: 'exact', head: true })
            .eq('booking_status', 'accepted')
            .eq('date', TODAY)
            .eq('semester_id', semesterId),

        // Total pending sessions
        supabase
            .from('bookings')
            .select('*', { count: 'exact', head: true })
            .eq('booking_status', 'pending')
            .eq('semester_id', semesterId),

        // Average ratings
        supabase
            .from('feedback_details')
            .select('average_rating')
            .eq('semester_id', semesterId)
            .not('average_rating', 'is', null),

        // Total students
        supabase
            .from('student_profiles')
            .select('*', { count: 'exact', head: true }),

        // Booking details
        supabase
            .from('booking_details')
            .select('*')
            .eq('semester_id', semesterId)
            .order('schedule_start', { ascending: true }),

        // Staff details
        supabase
            .from('staff_details')
            .select('*'),

        // Mentor details
        supabase
            .from('mentor_details')
            .select('*')
            .eq('is_active', true),

        // Subject list
        supabase
            .from('subjects')
            .select('id, code, name')
            .eq('is_active', true),

        // Top mentors
        supabase.rpc('get_top_mentors', { p_semester_id: semesterId }),

        // Top subjects
        supabase.rpc('get_top_subjects', { p_semester_id: semesterId }),

        // College activity
        supabase.rpc('get_college_activity', { p_semester_id: semesterId }),

        // Monthly trends
        supabase.rpc('get_monthly_trends', { p_semester_id: semesterId })
    ])

    const totalMentors = result1.count
    const totalStudents = result5.count
    const staffList = result7.data ?? []
    const topMentors = result10.data ?? []
    const topSubjects = result11.data ?? []
    const collegeActivity = result12.data ?? []
    const monthlyTrends = result13.data ?? []

    // Subject data
    const subjectList = (result9.data ?? []).map((subject) => ({
        id: subject.id,
        code: subject.code,
        name: subject.name
    }))

    // Average feedback calculation
    const feedbackData = result4.data ?? []
    const rowAverage = feedbackData.map((feedback) => feedback.average_rating).filter((value) => !isNaN(value) && value > 0)
    const totalFeedbackAverage = rowAverage.length > 0
        ? rowAverage.reduce((total, sum) => total + sum, 0) / rowAverage.length
        : 0

    const satisfactionCounts = rowAverage.reduce((acc, avg) => {
        const label = getRatingLabel(avg)
        acc[label] = (acc[label] ?? 0) + 1
        return acc
    }, {} as Record<string, number>)

    const satisfactionData = Object.entries(satisfactionCounts).map(([name, value]) => ({ name, value }))

    // Booking data
    const assignedSessions = (result6.data ?? []).map((booking: any) => ({
        id: booking.id,
        group_id: booking.group_id ?? null,
        topic: booking.topic,
        date: booking.date,
        scheduleStart: booking.schedule_start,
        scheduleEnd: booking.schedule_end,
        bookingStatus: booking.booking_status,
        subject: booking.subject_code,
        mode: booking.tutorial_mode,
        mentorName: booking.mentor_name,
        studentName: booking.student_name,
        isOpen: false
    }))

    const rawSessionList = (result6.data ?? []).map((booking: any) => ({
        id: booking.id,
        group_id: booking.group_id ?? null,
        topic: booking.topic,
        date: booking.date,
        scheduleStart: booking.schedule_start,
        scheduleEnd: booking.schedule_end,
        bookingStatus: booking.booking_status,
        subject: booking.subject_code,
        mode: booking.tutorial_mode,
        mentorName: booking.mentor_name || 'Any', 
        studentName: booking.student_name,
        isOpen: !booking.mentor_name
    }))

    const sessionMap = new Map();
    rawSessionList.forEach((session) => {
        const isGroup = session.mode?.toLowerCase().includes('group');
        const key = session.group_id || 
            (isGroup 
                ? `${session.date}_${session.scheduleStart}_${session.scheduleEnd}_${session.subject}_${session.topic}_${session.bookingStatus}_${session.mentorName}`
                : session.id);
        if (!sessionMap.has(key)) {
            sessionMap.set(key, {
                ...session,
                group_ids: [session.id]
            });
        } else {
            const existing = sessionMap.get(key);
            existing.group_ids.push(session.id);
            existing.studentName = `${existing.group_ids.length} Students (Group)`;
        }
    });

    const sessionList = Array.from(sessionMap.values());
    const totalSessionsToday = sessionList.filter((s) => s.date === TODAY && s.bookingStatus === 'accepted').length;
    const totalPendingSessions = sessionList.filter((s) => s.bookingStatus === 'pending').length;

    // Mentor data
    const mentorList = (result8.data ?? []).map((mentor) => ({
        id: mentor.id,
        mentorName: mentor.mentor_name,
        email: mentor.email,
        yearLevel: mentor.year_level,
        degreeProgram: mentor.program
    }))

    // Groups sessions by date
    const sessionsByDate = sessionList.reduce((groupedByDate, session) => {
        if(!groupedByDate[session.date]) groupedByDate[session.date] = []
        groupedByDate[session.date].push(session)
        return groupedByDate
    }, {} as Record<string, SessionList[]>)

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
            subjectList,
            topMentors,
            topSubjects,
            collegeActivity,
            monthlyTrends,
            sessionsByDate,
            satisfactionData,
            hasActiveSemester
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
    subjectList: SubjectList[]
    topMentors: TopMentor[]
    topSubjects: TopSubject[]
    collegeActivity: CollegeActivity[]
    monthlyTrends: MonthlyTrend[]
    sessionsByDate: Record<string, SessionList[]>
    satisfactionData: SatisfactionData[]
    hasActiveSemester: boolean
}

export default function AdminDashboard({ totalMentors, totalSessionsToday, totalPendingSessions, totalFeedbackAverage, totalStudents, staffList, sessionList, mentorList, subjectList, topMentors, topSubjects, collegeActivity, monthlyTrends, sessionsByDate, satisfactionData, hasActiveSemester }: AdminDashboardProps) {
    // Stat cards
    const cards = dashboardDataConfig['admin'].cards
    const gridCols = dashboardDataConfig['admin'].gridCols
    const data: Record<string, number | string> = {
        totalMentors,
        totalStudents,
        totalSessionsToday,
        totalPendingSessions,
        totalFeedbackAverage: totalFeedbackAverage.toFixed(2)
    }

    // Today's schedule table and calendar info
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
    const todaySessions = sessionList.filter((session) => session.date === selectedDate?.toLocaleDateString('en-CA'))
    const dateFormat = selectedDate?.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'Asia/Manila'})

    return (
        <>
            {/* Global search */}
            <GlobalSearch mentorList={mentorList} sessionList={sessionList} staffList={staffList} subjectList={subjectList}
                          role="admin" placeholder="Search mentors, staff, subjects, or sessions..." />

            {/* Stat cards */}
            <div className={`grid ${gridCols} gap-4 w-full`}>
                {cards.map((card) => {
                    return (
                        <StatCard key={card.dataKey} label={card.label} value={data[card.dataKey]} href={card.href} borderColor={card.borderColor} icon={card.icon} iconColor={card.iconColor} />

                    )
                })}
            </div>

            {/* Grid content */}
            <div className="grid grid-cols-3 gap-6 mt-4 items-stretch">
                {/* ROW 1 - Today's schedule table */}
                <div className="col-span-2">
                    <TodaysSchedule  currentSessions={todaySessions} date={dateFormat} role="admin" />
                </div>

                {/* Calendar  */}
                <div className="col-span-1 flex flex-col gap-4">
                    <QuickActions />
                    <ScheduleCalendar sessionsByDate={sessionsByDate} today={TODAY} selectedDate={selectedDate} onDateSelect={(date) => {if (date) setSelectedDate(date)}} />
                </div>

                {/* ROW 2 - Monthly trends */}
                <div className=" col-span-2 h-full">
                    <MonthlyTrends monthlyTrends={monthlyTrends} hasActiveSemester={hasActiveSemester} />
                </div>

                {/* Top mentors */}
                <div className="col-span-1 h-full">
                    <TopMentors topMentors={topMentors} hasActiveSemester={hasActiveSemester} />
                </div>

                {/* ROW 3 - Top subjects */}
                <div className="col-span-1">
                    <TopSubjects topSubjects={topSubjects} hasActiveSemester={hasActiveSemester} />
                </div>

                {/* College activity */}
                <div className=" col-span-1">
                    <CollegeBookings collegeActivity={collegeActivity} hasActiveSemester={hasActiveSemester} />
                </div>

                {/* Satisfaction rate */}
                <div className=" col-span-1">
                    <SatisfactionRate satisfactionData={satisfactionData} hasActiveSemester={hasActiveSemester} />
                </div>
            </div>
        </>
    )
}