import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient as createServerClient } from '@/utils/supabase/server';
import { v4 } from 'uuid';

// Group sessions type
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

    // Request info
    const { mentor_id, subject_id, topic, tutorialMode_id, date, schedule_start, schedule_end, group_emails = [] } = req.body;

    const { data: profile } = await supabase
        .from('student_profiles')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();
        
    if (!profile) return res.status(422).end();

    // For ANY choice, set null
    const isAny = mentor_id === 'any';
    const resolvedMentorId = isAny ? null : mentor_id;

    // For group sessions, get group id
    const cleanEmails = (group_emails as string[]).filter((e) => e.trim() !== '');
    const isGroupBooking = cleanEmails.length > 0;
    const groupId = isGroupBooking ? v4() : null;

    // Create booking
    const bookingData = {
        student_id:      profile.id,
        mentor_id:       resolvedMentorId,
        subject_id,
        topic,
        tutorialMode_id,
        date,
        schedule_start:  `${date}T${schedule_start}:00`,
        schedule_end:    `${date}T${schedule_end}:00`,
        booking_status:  'pending',
        group_id:        groupId,
    };
    const { data: error } = await supabase
        .from('bookings').insert(bookingData).select().single();
    if (error) return res.status(500).json({ error: error.message });

  // Group bookings handler
    if (cleanEmails.length > 0) {
        for (const email of cleanEmails) {
            const { data: memberUser } = await supabase
                .from('user_profiles')
                .select('id, student_profiles(id)')
                .eq('email', email)
                .returns<GroupMemberProfile[]>()
                .maybeSingle();
            if (!memberUser || !memberUser.student_profiles) continue;

            // Normal no ANY
            const studentProfilesArray = Array.isArray(memberUser.student_profiles)
                ? memberUser.student_profiles
                : [memberUser.student_profiles];

            if (studentProfilesArray.length > 0) {
                const memberProfileId = studentProfilesArray[0].id;
                
                await supabase.from('bookings').insert({
                ...bookingData,
                student_id: memberProfileId,
                });
            }
        }
    }
  return res.status(201).json({ ok: true });
}