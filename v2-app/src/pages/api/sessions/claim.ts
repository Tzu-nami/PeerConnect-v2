import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient as createServerClient } from '@/utils/supabase/server';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // Edit status
    if (req.method !== 'POST') return res.status(405).end();

    // Check if authenticated
    const supabase = createServerClient({ req, res } as any);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return res.status(401).end();

    const { data: mentorProfile } = await supabase
        .from('mentor_profiles').select('id').eq('user_id', user.id).single();
    if (!mentorProfile) return res.status(403).end();

    const { group_ids } = req.body as { group_ids: string[] };
    if (!group_ids?.length) return res.status(400).json({ error: 'group ids required.' });

    // Check open bookings
    const { data: bookings } = await supabase
        .from('bookings')
        .select('id, mentor_id, booking_status')
        .in('id', group_ids);
    if (!bookings?.length) return res.status(404).json({ error: 'Bookings not found.' });

    // Claim session and assign mentor
    const allOpen = bookings.every((b: any) => b.mentor_id === null && b.booking_status === 'pending');
    if (!allOpen) return res.status(409).json({ error: 'Session is no longer open. Another mentor just claimed it!' });
    const { error } = await supabase
        .from('bookings')
        .update({ 
            mentor_id: mentorProfile.id, 
            booking_status: 'accepted' 
        })
        .in('id', group_ids);
    if (error) return res.status(500).json({ error: error.message });

    return res.status(200).json({ ok: true });
}