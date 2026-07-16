import { GetServerSideProps } from "next"
import { useState } from "react"
import { toast } from "sonner"

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
import PendingRequests from "@/components/ui/dashboard/PendingRequests";
import { useRouter } from "next/router"
import WeeklyScheduleGrid from "@/components/ui/dashboard/WeeklyScheduleGrid";

export const getServerSideProps: GetServerSideProps = async (context) => {
    const supabase = createClient(context)

    // Get user ID
    const { data: { user } } = await supabase.auth.getUser()
    const userId = user?.id

    // Get current semester
    const { data: currentSemester } = await supabase
        .from('semesters')
        .select('id')
        .eq('is_current', true)
        .single()

    const semesterId = currentSemester?.id ?? null

    // Get mentor ID
    const { data: mentorProfile } = await supabase
        .from('mentor_profiles')
        .select('id')
        .eq('user_id', userId)
        .single()
    const mentorId = mentorProfile?.id

    // Get mentor's subjects
    const { data: mentorSubjects } = await supabase
        .from('mentor_subjects')
        .select('subject_id')
        .eq('mentor_id', mentorId)
    const subjectIds = mentorSubjects?.map(ms => ms.subject_id) || []

    // Get mentor's availabilities
    const { data: mentorAvailabilities } = await supabase
        .from('mentor_availabilities')
        .select('day_of_week, start_time, end_time')
        .eq('mentor_id', mentorId)
    const availabilities = mentorAvailabilities || []

    // Fetch data from server
    const [result1, result2, result3, result4, result5, result6, result7, openSessionsResult] = await Promise.all([
        // Sessions today
        supabase
            .from('bookings')
            .select('*', { count: 'exact', head: true })
            .eq('booking_status', 'accepted')
            .eq('date', TODAY)
            .eq('semester_id', semesterId)
            .eq('mentor_id', mentorId),

        // Pending requests
        supabase
            .from('bookings')
            .select('*', { count: 'exact', head: true })
            .eq('booking_status', 'pending')
            .gte('date', TODAY)
            .eq('semester_id', semesterId)
            .eq('mentor_id', mentorId),

        // Average ratings
        supabase
            .from('feedback_details')
            .select('average_rating')
            .eq('semester_id', semesterId)
            .eq('mentor_id', mentorId)
            .not('average_rating', 'is', null),

        // Rendered hours
        supabase.rpc('get_rendered_hours', { p_mentor_id: mentorId, p_semester_id: semesterId }),

        // Session list
        supabase
            .from('booking_details')
            .select('*')
            .eq('semester_id', semesterId)
            .eq('mentor_id', mentorId),

        // Mentor list
        supabase
            .from('mentor_details')
            .select('*')
            .eq('is_active', true),

        // Subject list
        supabase
            .from('subjects')
            .select('id, code, name')
            .eq('is_active', true),

        // ANY sessions
        subjectIds.length > 0 
        ? supabase.from('bookings').select(`
            id, topic, date, schedule_start, schedule_end, booking_status, group_id,
            subjects ( code ), tutorial_modes ( mode ),
            student_profiles!student_id ( user_profiles ( firstName, lastName ) )
            `).is('mentor_id', null).eq('booking_status', 'pending').gte('date', TODAY).in('subject_id', subjectIds)
        : Promise.resolve({ data: [] })
    ])

    const sessionsToday        = result1.count
    const pendingRequestsCount = result2.count

    // Average feedback calculation
    const feedbackData = result3.data ?? []
    const validRatings = feedbackData
        .map((row) => row.average_rating)
        .filter((rating) => !isNaN(rating) && rating > 0)

    const averageRatings = validRatings.length > 0
        ? validRatings.reduce((sum, rating) => sum + rating, 0) / validRatings.length
        : 0

    // Booking data
    const assignedSessions = (result5.data ?? []).map((booking: any) => ({
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

    // First come first serve bookings
    const openSessions = (openSessionsResult.data ?? []).filter((booking: any) => {
            const sessionDay = new Date(booking.date + 'T00:00:00')
                .toLocaleDateString('en-US', { weekday: 'long' })
                .toLowerCase();
            const sessionStartTime = booking.schedule_start.split('T')[1] || booking.schedule_start;
            const sessionEndTime = booking.schedule_end.split('T')[1] || booking.schedule_end;

            return availabilities.some((avail) => 
                avail.day_of_week === sessionDay &&
                avail.start_time <= sessionStartTime &&
                avail.end_time >= sessionEndTime
            );
        }).map((booking: any) => ({
        id: booking.id,
        group_id: booking.group_id ?? null,
        topic: booking.topic,
        date: booking.date,
        scheduleStart: booking.schedule_start,
        scheduleEnd: booking.schedule_end,
        bookingStatus: booking.booking_status,
        subject: booking.subjects?.code ?? '-',
        mode: booking.tutorial_modes?.mode ?? '-',
        mentorName: 'Any',
        studentName: booking.student_profiles?.user_profiles 
            ? `${booking.student_profiles.user_profiles.firstName} ${booking.student_profiles.user_profiles.lastName}`.trim()
            : 'Unknown',
        isOpen: true
    }))
    const rawSessionList = [...assignedSessions, ...openSessions]

    const sessionMap = new Map();
    rawSessionList.forEach((session) => {
        const key = session.group_id || `${session.date}_${session.scheduleStart}_${session.scheduleEnd}_${session.subject}`;
        
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
    const completedSessions = sessionList.filter((s) => s.bookingStatus === 'completed' && !s.isOpen);
    let totalRenderedMins = 0;
    
    completedSessions.forEach((session) => {
        const start = new Date(session.scheduleStart).getTime();
        const end = new Date(session.scheduleEnd).getTime();
        totalRenderedMins += Math.max(0, (end - start) / 60000);
    });

    const hrs = Math.floor(totalRenderedMins / 60);
    const mins = Math.round(totalRenderedMins % 60);
    const renderedHours = `${hrs}h ${mins}m`;

    // Pending requests
    const pendingSessions = sessionList.filter((session) => session.bookingStatus === 'pending')
    const pendingRequests = pendingSessions.length

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
        if (!groupedByDate[session.date]) groupedByDate[session.date] = []
        groupedByDate[session.date].push(session)
        return groupedByDate
    }, {} as Record<string, SessionList[]>)

    return {
        props: {
            sessionsToday: sessionsToday ?? 0,
            pendingRequests: pendingRequests ?? 0,
            averageRatings: isNaN(averageRatings) ? 0 : averageRatings,
            renderedHours: renderedHours ?? 0,
            sessionList,
            sessionsByDate,
            pendingSessions,
            mentorList,
            subjectList
        }
    }
}

interface MentorDashboardProps {
    sessionsToday: number
    pendingRequests: number
    averageRatings: number
    renderedHours: string
    sessionList: (SessionList & { isOpen: boolean })[]
    sessionsByDate: Record<string, (SessionList & { isOpen: boolean })[]>
    pendingSessions: (SessionList & { isOpen: boolean })[]
    mentorList: MentorList[]
    subjectList: SubjectList[]
}

export default function MentorDashboardProps({ sessionList, sessionsByDate, pendingSessions, mentorList, subjectList, sessionsToday, pendingRequests, averageRatings, renderedHours }: MentorDashboardProps) {
    // Stat cards
    const cards = dashboardDataConfig['mentor'].cards
    const gridCols = dashboardDataConfig['mentor'].gridCols
    const data: Record<string, number | string> = {
        sessionsToday,
        pendingRequests,
        averageRatings: averageRatings.toFixed(2),
        renderedHours
    }

    // Today's schedule table and calendar info
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
    const todaySessions = sessionList.filter((session) => session.date === selectedDate?.toLocaleDateString('en-CA'))
    const dateFormat = selectedDate?.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'Asia/Manila' })

    const router = useRouter()

    return (
        <>
            {/* Global search */}
            <GlobalSearch mentorList={mentorList} sessionList={sessionList} subjectList={subjectList}
                          placeholder="Search mentors, subjects, or sessions..." role="mentor" />

            {/* Stat cards */}
            <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 w-full`}>
                {cards.map((card) => {
                    return (
                        <StatCard key={card.dataKey} label={card.label} value={data[card.dataKey]} href={card.href} borderColor={card.borderColor} icon={card.icon} iconColor={card.iconColor} />
                    )
                })}
            </div>

            {/* Grid content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4 items-start">
                {/* LEFT COLUMN - Today's Schedule + Weekly Grid stacked */}
                <div className="lg:col-span-2 flex flex-col gap-6">
                    <div className="min-h-[400px] md:h-[560px]">
                        <TodaysSchedule currentSessions={todaySessions} date={dateFormat} role="mentor" />
                    </div>

                    <div className="bg-white">
                        <WeeklyScheduleGrid sessionList={sessionList} role="mentor" />
                    </div>
                </div>

                {/* RIGHT COLUMN - Calendar + Pending Requests stacked */}
                <div className="lg:col-span-1 flex flex-col gap-4">
                    <ScheduleCalendar
                        sessionsByDate={sessionsByDate}
                        today={TODAY}
                        selectedDate={selectedDate}
                        onDateSelect={(date) => { if (date) setSelectedDate(date) }}
                    />
                    <PendingRequests
                        pendingSessions={pendingSessions}
                        onSuccess={(status) => {
                            router.replace(router.asPath)
                            if (status === 'claim') {
                                toast.success('Session claimed.')
                            } else if (status === 'accepted') {
                                toast.success('Session accepted.')
                            } else {
                                toast.success('Session rejected.')
                            }
                        }}
                    />
                </div>
            </div>
        </>
    )
}