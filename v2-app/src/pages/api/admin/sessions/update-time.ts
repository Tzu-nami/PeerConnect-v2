import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient as createServerClient } from "@/utils/supabase/server";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    
    // Check if admin
    const supabase = createServerClient({ req, res } as any);
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return res.status(401).json({ error: 'Unauthorized' });

    // Edit
    if (req.method !== 'POST') return res.status(405).end();

    const { ids, startTime, endTime } = req.body as {
        ids: string[];
        startTime: string;
        endTime: string;
    };
    if (!ids?.length) return res.status(400).json({ error: 'No booking IDs provided.' });

    if (endTime <= startTime) return res.status(422).json({ error: 'End time must be after start time.' });

    // Reconstruct timestaps for database to accept format
    const { data: booking } = await supabase
        .from('bookings')
        .select('schedule_start')
        .eq('id', ids[0])
        .single();
    if (!booking) return res.status(404).json({ error: 'Booking not found.' });
    const datePart = new Date(booking.schedule_start).toISOString().split('T')[0];
    const newStart = `${datePart}T${startTime}:00`;
    const newEnd   = `${datePart}T${endTime}:00`;

    const { error } = await supabase
        .from('bookings')
        .update({ schedule_start: newStart, schedule_end: newEnd })
        .in('id', ids);
    if (error) return res.status(500).json({ error: error.message });
    
    return res.status(200).json({ ok: true });
} 