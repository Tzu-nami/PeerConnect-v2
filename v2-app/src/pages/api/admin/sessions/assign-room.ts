import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient as createServerClient } from "@/utils/supabase/server";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    
    // Check if admin
    const supabase = createServerClient({ req, res } as any);
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return res.status(401).json({ error: 'Unauthorized' });

    // Edit
    if (req.method !== 'POST') return res.status(405).end();

    const { ids, room } = req.body as {
        ids: string[];
        room: string;
    };
    if (!ids?.length) return res.status(400).json({ error: 'No booking IDs provided.' });
    if (!room) return res.status(400).json({ error: 'Room selection is required.' });

    // Update
    const { error } = await supabase
        .from('bookings')
        .update({ room: room })
        .in('id', ids);

    if (error) return res.status(500).json({ error: error.message });
    
    return res.status(200).json({ ok: true });
}