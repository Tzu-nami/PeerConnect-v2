import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient as createClientServer } from '@/utils/supabase/server';

type AllowedStatus = 'accepted' | 'rejected' | 'completed' | 'no_show' | 'cancelled';
const ALLOWED: AllowedStatus[] = ['accepted', 'rejected', 'completed', 'no_show', 'cancelled'];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // Edit session status
    if (req.method !== 'POST') return res.status(405).end();

    // Check if authenticated
    const supabase = createClientServer({ req, res } as any);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return res.status(401).end();

    const { data: mentorProfile } = await supabase
        .from('mentor_profiles').select('id').eq('user_id', user.id).single();
    if (!mentorProfile) return res.status(403).end();

    const { booking_ids, booking_status, revert_to_pool } = req.body as { 
        booking_ids: string[]; 
        booking_status: AllowedStatus;
        revert_to_pool?: boolean;
    };

    if (!ALLOWED.includes(booking_status))
        return res.status(400).json({ error: 'Invalid status.' });
    if (!booking_ids || booking_ids.length === 0)
        return res.status(400).json({ error: 'No bookings provided.' });

    // Fetch bookings data
    const { data: bookings, error: fetchError } = await supabase
        .from('bookings')
        .select('id, mentor_id, booking_status')
        .in('id', booking_ids);
    if (fetchError || !bookings || bookings.length === 0) {
        return res.status(404).json({ error: 'Bookings not found.' });
    }
    for (const b of bookings) {
        if (b.mentor_id !== mentorProfile.id) {
            return res.status(403).json({ error: 'Unauthorized: Booking belongs to another mentor.' });
        }
    }

    // Group sessions
    const activeBookings = bookings.filter(b => b.booking_status !== 'cancelled');
    if (activeBookings.length === 0) {
        return res.status(400).json({ error: 'All students in this group have already cancelled.' });
    }
    const activeBookingIds = activeBookings.map(b => b.id);

    const updateData: Record<string, any> = { booking_status };
    
    if (booking_status === 'cancelled' && revert_to_pool) {
        // Return to ANY pool
        updateData.booking_status = 'pending';
        updateData.mentor_id = null; 
    } else if (booking_status === 'completed') {
        updateData.completed_at = new Date().toISOString();
    }

    const { error } = await supabase
        .from('bookings')
        .update(updateData)
        .in('id', activeBookingIds); 
    if (error) return res.status(500).json({ error: error.message });

    return res.status(200).json({ ok: true });
}