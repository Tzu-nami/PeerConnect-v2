import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient as createServerClient } from '@/utils/supabase/server';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // Patch
    if (req.method !== 'POST') return res.status(405).end();

    const supabase = createServerClient({ req, res } as any);
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) return res.status(401).json({ error: 'Unauthorized' });

    // Retrieve data row
    const { data: profile } = await supabase
        .from('student_profiles')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();
        
    if (!profile) return res.status(422).end();

    const { data: booking } = await supabase
        .from('bookings')
        .select('id')
        .eq('student_id', profile.id)
        .in('booking_status', ['pending', 'accepted'])
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

    if (!booking) return res.status(404).json({ error: 'No active booking found.' });

    // Update
    const { error: updateError } = await supabase
        .from('bookings')
        .update({ booking_status: 'cancelled' })
        .eq('id', booking.id);
        
    if (updateError) return res.status(500).json({ error: updateError.message });

    return res.status(200).json({ ok: true });
}