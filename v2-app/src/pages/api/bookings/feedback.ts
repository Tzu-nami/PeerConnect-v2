import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient as createServerClient } from '@/utils/supabase/server';
import { v4 as uuid } from 'uuid';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // Create
    if (req.method !== 'POST') return res.status(405).end();

    // Check if authenticated
    const supabase = createServerClient({ req, res } as any);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return res.status(401).end();

    // Feedback table
    const { booking_id, skip, feedback, q1, q2, q3, q4, q5, q6, q7, q8, q9, q10 } = req.body;
    if (!booking_id) return res.status(400).json({ error: 'booking id is required.' });

    // Check if booking belongs to student
    const { data: sp } = await supabase
        .from('student_profiles').select('id').eq('user_id', user.id).single();
    if (!sp) return res.status(422).json({ error: 'Student profile not found.' });
    const { data: booking } = await supabase
        .from('bookings')
        .select('id, booking_status, subjects(code), topic')
        .eq('id', booking_id)
        .eq('student_id', sp.id)
        .eq('booking_status', 'completed')
        .single();
    if (!booking) return res.status(404).json({ error: 'Booking not found or not completed.' });

    // Check feedback does not exist
    const { data: existing } = await supabase
        .from('feedback').select('id').eq('booking_id', booking_id).single();
    if (existing) return res.status(409).json({ error: 'Feedback already submitted for this booking.' });

    // Validate
    if (!skip) {
        const ratings = [q1, q2, q3, q4, q5, q6, q7, q8, q9];
        for (let i = 0; i < ratings.length; i++) {
            const v = Number(ratings[i]);
            if (!Number.isInteger(v) || v < 1 || v > 5) {
                return res.status(422).json({ errors: { [`q${i+1}`]: `Q${i+1} must be a rating from 1 to 5.` } });
            }
        }
        if (q10 !== true && q10 !== false && q10 !== 'true' && q10 !== 'false' && q10 !== 1 && q10 !== 0) {
            return res.status(422).json({ errors: { q10: 'Q10 must be answered Yes or No.' } });
        }
    }
    if (!skip && feedback && feedback.trim().length > 2000) {
        return res.status(422).json({ errors: { feedbackText: 'Feedback must not exceed 2000 characters.' } });
    }

    const { error } = await supabase.from('feedback').insert({
        id:             uuid(),
        booking_id,
        feedback:       skip ? null : (feedback?.trim() || null),
        date_submitted: new Date().toISOString(),
        q1:  skip ? null : Number(q1),
        q2:  skip ? null : Number(q2),
        q3:  skip ? null : Number(q3),
        q4:  skip ? null : Number(q4),
        q5:  skip ? null : Number(q5),
        q6:  skip ? null : Number(q6),
        q7:  skip ? null : Number(q7),
        q8:  skip ? null : Number(q8),
        q9:  skip ? null : Number(q9),
        q10: skip ? null : (q10 === true || q10 === 'true' || q10 === 1 || q10 === '1'),
    });
    if (error) return res.status(500).json({ error: error.message });

    return res.status(201).json({ ok: true });
}