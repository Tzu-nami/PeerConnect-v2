import type { NextApiResponse, NextApiRequest } from "next";
import { createClient as createServerClient } from "@/utils/supabase/server";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { ids } = req.body as { ids: string[] };

    // Check if admin
    const supabase = createServerClient({ req, res } as any);
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return res.status(401).json({ error: 'Unauthorized' });

    if (!ids || !ids.length) {
        return res.status(400).json({ error: 'No booking IDs provided.' });
    }

    try {
        const { error } = await supabase
        .from('bookings')
        .update({ booking_status: 'cancelled' })
        .in('id', ids);

        if (error) throw error;
        
        return res.status(200).json({ ok: true });
        
    } catch (error: any) {
        console.error('Cancel Session Error:', error);
        return res.status(500).json({ error: error.message });
    }
}