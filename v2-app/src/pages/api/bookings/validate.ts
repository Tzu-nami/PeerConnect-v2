import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient as createServerClient } from '@/utils/supabase/server';

interface GroupMemberProfile {
  id: string;
  student_profiles: { id: string } | { id: string }[] | null;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // Create
    if (req.method !== 'POST') return res.status(405).end();

    // Check if authenticated
    const supabase = createServerClient({ req, res } as any);

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return res.status(401).json({ error: 'Unauthorized' });

    const { data: settings } = await supabase.from('system_settings').select('bookings_enabled, disabled_message').single();
    if (!settings?.bookings_enabled) return res.status(403).json({ errors: { general: settings?.disabled_message || 'Bookings are currently closed.' } });

    // Request info and validate inputs
    const userId = user.id;
    const { mentor_id, subject_id, topic, tutorialMode_id, date, schedule_start, schedule_end, group_emails = [] } = req.body;

    // Student profile
    const { data: profile } = await supabase
        .from('student_profiles')
        .select('id')
        .eq('user_id', userId)
        .maybeSingle();
    
    if (!profile) return res.status(422).json({ errors: { general: 'Complete your student profile first.' } });

    // Check if has active booking
    const { count: activeCount } = await supabase
        .from('bookings').select('*', { count: 'exact', head: true })
        .eq('student_id', profile.id)
        .in('booking_status', ['pending', 'accepted']);
    
    if ((activeCount ?? 0) > 0) {
        return res.status(422).json({ errors: { mentor_id: 'You already have an active booking. Please wait for it to be completed or cancelled before making a new one.' } });
    }

    // Prevent deleted mentors and own name bookings
    if (mentor_id && mentor_id !== 'any') {
        const { data: mp } = await supabase
            .from('mentor_profiles').select('user_id, is_active').eq('id', mentor_id).maybeSingle();
        if (!mp || mp.is_active === false) {
            return res.status(422).json({ errors: { mentor_id: 'This mentor is no longer available.' } });
        }
        if (mp?.user_id === userId) {
            return res.status(422).json({ errors: { mentor_id: 'You cannot book yourself as a mentor.' } });
        }
    }

    // Student profile fields validation
    const errors: Record<string, string> = {};
    if (!subject_id) errors.subject_id = 'Subject is required.';
    if (!topic?.trim()) errors.topic = 'Topic is required.';
    if (!tutorialMode_id) errors.tutorialMode_id = 'Mode of tutorial is required.';
  
    if (!date) {
        errors.date = 'Session date is required.';
    } else {
        const d = new Date(date + 'T00:00:00');
        const today = new Date(); today.setHours(0,0,0,0);
        if (d <= today) errors.date = 'Session date already passed.';
        if (d.getDay() === 0) errors.date = 'The session date cannot be on a Sunday.';
    }
  
    if (!schedule_start) {
        errors.schedule_start = 'Start time is required.';
    } else if (schedule_start < '08:00' || schedule_start >= '18:00') {
        errors.schedule_start = 'Sessions can only be booked between 8:00 AM and 6:00 PM.';
    }
    if (!schedule_end) {
        errors.schedule_end = 'End time is required.';
    } else if (schedule_end <= '08:00' || schedule_end > '18:00') {
        errors.schedule_end = 'Sessions can only be booked between 8:00 AM and 6:00 PM.';
    }
    if (schedule_start && schedule_end && schedule_end <= schedule_start) {
        errors.schedule_end = 'End time must be after start time.';
    }
    
    if (Object.keys(errors).length > 0) return res.status(422).json({ errors });

    // ANY feature mentor choice filter by inputs
    if (mentor_id === 'any') {
        const dayOfWeek = new Date(date + 'T00:00:00')
            .toLocaleDateString('en-US', { weekday: 'long' })
            .toLowerCase();
        const { data: qualifiedMentors } = await supabase
            .from('mentor_profiles')
            .select(`id, mentor_subjects!inner(subject_id), mentor_availabilities!inner(day_of_week, start_time, end_time)`)
            .eq('is_active', true)
            .eq('mentor_subjects.subject_id', subject_id)
            .eq('mentor_availabilities.day_of_week', dayOfWeek)
            .lte('mentor_availabilities.start_time', schedule_start)
            .gte('mentor_availabilities.end_time', schedule_end);

        if (!qualifiedMentors?.length) {
            return res.status(422).json({ errors: { mentor_id: 'No mentors are available for this specific date and timeframe.' } });
        }
    }

    // Schedule conflict check
    if (mentor_id && mentor_id !== 'any') {
        const startTimestamp = `${date}T${schedule_start}:00`;
        const endTimestamp = `${date}T${schedule_end}:00`;
        const { count: conflictCount } = await supabase
            .from('bookings').select('*', { count: 'exact', head: true })
            .eq('mentor_id', mentor_id)
            .in('booking_status', ['accepted', 'completed'])
            .lt('schedule_start', endTimestamp)
            .gt('schedule_end', startTimestamp);
        
        if ((conflictCount ?? 0) > 0) {
            return res.status(422).json({ errors: { schedule_start: 'This mentor already has a session during the selected time. Please choose a different time slot.' } });
        }
    }

    // Group tutorial emails
    const { data: modeData } = await supabase.from('tutorial_modes').select('mode').eq('id', tutorialMode_id).maybeSingle();
    const modeName = modeData?.mode?.toLowerCase() ?? '';
    const isGroup = modeName.includes('small group') || modeName.includes('large group');
    if (isGroup && group_emails.length > 0) {
        const cleanEmails = group_emails.filter((e: string) => e.trim() !== '');
        const uniqueEmails = new Set(cleanEmails);
        if (uniqueEmails.size !== cleanEmails.length) {
            return res.status(422).json({ errors: { group_emails: 'Duplicate emails are not allowed.' } });
        }
        
        const { data: currentUser } = await supabase.from('user_profiles').select('email').eq('id', userId).single();
        if (cleanEmails.includes(currentUser?.email)) {
            return res.status(422).json({ errors: { group_emails: 'You do not need to add your own email.' } });
        }

        const min = modeName.includes('small group') ? 1 : 5;
        const max = modeName.includes('small group') ? 4 : 13;
        if (cleanEmails.length < min) return res.status(422).json({ errors: { group_emails: `This mode requires at least ${min} additional member(s).` } });
        if (cleanEmails.length > max) return res.status(422).json({ errors: { group_emails: `This mode allows at most ${max} additional members.` } });

        // Group tutorials email validation
        for (const email of cleanEmails) {
            const { data: memberUser } = await supabase
                .from('user_profiles')
                .select('id, student_profiles(id)')
                .eq('email', email)
                .returns<GroupMemberProfile[]>()
                .maybeSingle();

            if (!memberUser || !memberUser.student_profiles) {
                return res.status(422).json({ errors: { group_emails: `The email ${email} does not belong to a registered student with a completed profile.` } });
            }
            const studentProfilesArray = Array.isArray(memberUser.student_profiles) 
                ? memberUser.student_profiles 
                : [memberUser.student_profiles];
            if (studentProfilesArray.length === 0) {
                return res.status(422).json({ errors: { group_emails: `The email ${email} must complete their student profile first` } });
            }
            const memberProfileId = studentProfilesArray[0].id;
      
            // Active session check
            const { count: memberActive } = await supabase
                .from('bookings').select('*', { count: 'exact', head: true })
                .eq('student_id', memberProfileId).in('booking_status', ['pending', 'accepted']);
            if ((memberActive ?? 0) > 0) {
                return res.status(422).json({ errors: { group_emails: `The student ${email} already has an active booking and cannot join this session.` } });
            }
        }
    }
  return res.status(200).json({ ok: true });
}