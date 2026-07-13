import { SupabaseClient } from '@supabase/supabase-js';
import type { BookingMentor, MentorAvailability, MentorBookedSlot, RecentBooking, ActiveBooking, CompletedBookingForFeedback } from '@/types/bookings';

export async function getStudentBookingPageData(supabase: SupabaseClient, userId: string) {
    const [
        { data: mentorRows },
        { data: availRows },
        { data: bookedRows },
        { data: msRows },
        { data: subjectRows },
        { data: modeRows },
        { data: collegeRows },
        { data: degreeRows },
        { data: yearRows },
        { data: studentProfile },
        { data: systemSettings },
    ] = await Promise.all([
        supabase
            .from('mentor_profiles')
            .select('id, user_profiles(id, firstName, lastName)')
            .neq('user_id', userId)
            .eq('is_active', true),
        supabase
            .from('mentor_availabilities')
            .select('mentor_id, day_of_week, start_time, end_time'),
        supabase
            .from('bookings')
            .select('mentor_id, date, schedule_start, schedule_end')
            .in('booking_status', ['accepted', 'completed'])
            .not('mentor_id', 'is', null),
        supabase
            .from('mentor_subjects')
            .select('mentor_id, subject_id'),
        supabase
            .from('subjects')
            .select('id, code, name').order('code')
            .eq('is_active', true),
        supabase
            .from('tutorial_modes')
            .select('id, mode').order('id'),
        supabase
            .from('colleges')
            .select('id, code, name').order('name'),
        supabase
            .from('degree_programs')
            .select('id, college_id, name')
            .order('name'),
        supabase
            .from('year_levels')
            .select('id, name')
            .order('name'),
        supabase
            .from('student_profiles')
            .select('id, student_num, college_id, degreeProgram_id, yearLevel_id')
            .eq('user_id', userId).maybeSingle(),
        supabase
            .from('system_settings')
            .select('bookings_enabled, disabled_message')
            .single(),
    ]);

    const mentors: BookingMentor[] = (mentorRows ?? [])
        .map((m: any) => ({
            id: m.user_profiles?.id ?? '',
            profile_id: m.id,
            name: `${(m.user_profiles?.lastName ?? '').toUpperCase()}, ${m.user_profiles?.firstName ?? ''}`,
        }))
        .sort((a, b) => a.name.localeCompare(b.name));

    const availabilities: MentorAvailability[] = (availRows ?? []).map((a: any) => ({
        mentorProfile_id: a.mentor_id,
        day_of_week: a.day_of_week,
        start_time: a.start_time,
        end_time: a.end_time,
    }));

    const bookedSlots: MentorBookedSlot[] = (bookedRows ?? []).map((b: any) => {
        const startDt = new Date(b.schedule_start);
        const endDt   = new Date(b.schedule_end);
        const date    = new Date(b.date).toISOString().split('T')[0];
        const dayOfWeek = new Date(b.date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
        return {
            mentor_id: b.mentor_id,
            date,
            day_of_week: dayOfWeek,
            start: `${String(startDt.getHours()).padStart(2,'0')}:${String(startDt.getMinutes()).padStart(2,'0')}`,
            end:   `${String(endDt.getHours()).padStart(2,'0')}:${String(endDt.getMinutes()).padStart(2,'0')}`,
        };
    });
    let recentBookings: RecentBooking[] = [];
    let activeBooking: ActiveBooking | null = null;
    let completedBookingForFeedback: CompletedBookingForFeedback | null = null;

    if (studentProfile) {
        const { data: recent } = await supabase
        .from('bookings')
        .select(`id, booking_status, date, schedule_start, schedule_end, topic,
            subjects(code, name), tutorial_modes(mode),
            mentor_profiles(user_profiles(firstName, lastName))`)
        .eq('student_id', studentProfile.id)
        .order('created_at', { ascending: false })
        .limit(5);
        recentBookings = (recent ?? []).map((b: any) => ({
        id: b.id,
        subject_code: b.subjects?.code ?? '—',
        subject_name: b.subjects?.name ?? '',
        mentor_name:  b.mentor_profiles?.user_profiles
            ? `${(b.mentor_profiles.user_profiles.lastName ?? '').toUpperCase()}, ${b.mentor_profiles.user_profiles.firstName ?? ''}`
            : 'Any',
        topic:       b.topic ?? '',
        mode:        b.tutorial_modes?.mode ?? '—',
        date:        new Date(b.date).toISOString().split('T')[0],
        start_time:  new Date(b.schedule_start).toTimeString().substring(0,5),
        end_time:    new Date(b.schedule_end).toTimeString().substring(0,5),
        status:      b.booking_status,
        }));

        const { data: active } = await supabase
            .from('bookings')
            .select(`id, booking_status, date, schedule_start, schedule_end, topic,
                subjects(code, name), tutorial_modes(mode),
                mentor_profiles(user_profiles(firstName, lastName))`)
            .eq('student_id', studentProfile.id)
            .in('booking_status', ['pending', 'accepted'])
            .order('created_at', { ascending: false })
            .limit(5)
            .maybeSingle();

        if (active) {
            activeBooking = {
                id: active.id,
                subject_code: (active.subjects as any)?.code ?? '—',
                subject_name: (active.subjects as any)?.name ?? '',
                topic: active.topic ?? '',
                mentor_name: (active.mentor_profiles as any)?.user_profiles
                ? `${((active.mentor_profiles as any).user_profiles.lastName ?? '').toUpperCase()}, ${(active.mentor_profiles as any).user_profiles.firstName ?? ''}`
                : '',
                mode: (active.tutorial_modes as any)?.mode ?? '—',
                date: new Date(active.date).toISOString().split('T')[0],
                start_time: new Date(active.schedule_start).toTimeString().substring(0,5),
                end_time:   new Date(active.schedule_end).toTimeString().substring(0,5),
                status: active.booking_status as 'pending' | 'accepted',
            };
        }

        const { data: completedRows } = await supabase
            .from('bookings')
            .select(`
                id, date, topic,
                subjects(code, name),
                mentor_profiles(user_profiles(firstName, lastName)),
                feedback(id)
            `)
            .eq('student_id', studentProfile.id)
            .eq('booking_status', 'completed')
            .order('created_at', { ascending: false });
        const missingFeedbackRow = (completedRows || []).find((b: any) => {
            return !b.feedback || (Array.isArray(b.feedback) && b.feedback.length === 0);
        });
        if (missingFeedbackRow) {
            const subj = missingFeedbackRow.subjects as any;
            const mentorProf = missingFeedbackRow.mentor_profiles as any;
            const userProf = mentorProf?.user_profiles;

            completedBookingForFeedback = {
                id: missingFeedbackRow.id,
                subject_code: subj?.code ?? '—',
                subject_name: subj?.name ?? '',
                mentor_name: userProf
                    ? `${(userProf.lastName ?? '').toUpperCase()}, ${userProf.firstName ?? ''}`
                    : 'Any',
                date: new Date(missingFeedbackRow.date).toISOString().split('T')[0],
                topic: missingFeedbackRow.topic ?? '',
            };
        }
    }

    return {
        mentors,
        availabilities,
        bookedSlots,
        mentorSubjects: (msRows ?? []).map((m: any) => ({ mentorProfile_id: m.mentor_id, subject_id: m.subject_id })),
        subjects: subjectRows ?? [],
        tutorialModes: modeRows ?? [],
        colleges: collegeRows ?? [],
        degreePrograms: degreeRows ?? [],
        yearLevels: yearRows ?? [],
        studentProfile: studentProfile ?? null,
        recentBookings,
        activeBooking,
        completedBookingForFeedback,
        bookingsEnabled: systemSettings?.bookings_enabled ?? true,
        disabledMessage: systemSettings?.disabled_message ?? null,
    };
}