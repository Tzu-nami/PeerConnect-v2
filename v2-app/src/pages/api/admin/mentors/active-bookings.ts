import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@/utils/supabase/server";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if(req.method !== 'GET') return res.status(405).end();

    const supabase = createClient({ req, res} as any);

    // Check if admin
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return res.status(401).json({ error: 'Unauthorized' });

    const { mentorId } = req.query;
    if (!mentorId || typeof mentorId !== 'string') {
        return res.status(400).json({ error: 'A valid mentor ID is needed.' });
    }

    try {
        const { count, error } = await supabase.from('bookings')
            .select('*', { count: 'exact', head: true})
            .eq('mentor_id', mentorId)
            .in('booking_status', ['pending', 'accepted']);

        if (error) throw error;
        return res.status(200).json({ count: count ?? 0});
    } catch (error: any) {
        console.error('Error fetching active bookings:', error);
        return res.status(500).json({ error: error.message });
    }
}