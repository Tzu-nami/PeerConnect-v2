import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient as createServerClient } from '@/utils/supabase/server';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { id } = req.query as { id: string };

    // Check if admin
    const supabase = createServerClient({ req, res } as any);
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return res.status(401).json({ error: 'Unauthorized' });

    // Edit
    if (req.method === 'PUT') {
        try {
            const { code, name } = req.body;

            // Check for duplicate subjects
            const { data: existing } = await supabase
                .from('subjects')
                .select('id')
                .eq('code', code.trim())
                .neq('id', id)
                .single();
            if (existing) {
                return res.status(409).json({ error: 'Course code already exists.' });
            }

            const { error } = await supabase
                .from('subjects')
                .update({ code: code.trim(), name: name.trim() })
                .eq('id', id);
            if (error) throw error;

            return res.status(200).json({ ok: true });
        } catch (error: any) {
            console.error('Edit Subject Error:', error);
            return res.status(500).json({ error: error.message });
        }
    }

    // Delete
    if (req.method === 'DELETE') {
        try {
            // Cancel any pending or accepted sessions
            const { error: bookingError } = await supabase
                .from('bookings')
                .update({ booking_status: 'cancelled' })
                .eq('subject_id', id)
                .in('booking_status', ['pending', 'accepted']);
            
            if (bookingError) throw bookingError;

            // Remove subject from mentors
            const { error: detachError } = await supabase
                .from('mentor_subjects')
                .delete()
                .eq('subject_id', id);
            if (detachError) throw detachError;

            // Delete subject
            const { error: deleteError } = await supabase
                .from('subjects')
                .update({ is_active: false })
                .eq('id', id);
            if (deleteError) throw deleteError;

            return res.status(200).json({ ok: true });
        } catch (error: any) {
            console.error('Delete Subject Error:', error);
            return res.status(500).json({ error: error.message });
        }
    }

    res.setHeader('Allow', ['PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
}