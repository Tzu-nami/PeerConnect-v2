import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@/utils/supabase/server";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') return res.status(405).end();

    const supabase = createClient({ req, res } as any);

    // Check if admin
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return res.status(401).json({ error: 'Unauthorized' });

    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'An email is required.' });

    const { data: user, error } = await supabase
        .from('user_profiles')
        .select('id, firstName, lastName, email, role, student_profiles(student_num)')
        .eq('email', email)
        .maybeSingle();

    if (error || !user) {
        return res.status(404).json({ error: 'The student with this email does not exist.' });
    }

    const profiles = user.student_profiles as any;

    const isProfileComplete = Array.isArray(profiles) ?
        profiles.length > 0 && profiles[0]?.student_num 
        : profiles?.student_num;

    if (!isProfileComplete) {
        return res.status(422).json({ error: 'The student must complete their profile first.' });
    }

    if (user.role === 'mentor') {
        return res.status(409).json({ error: 'This student is already a peer mentor.' });
    }

    return res.status(200).json({
        id: user.id,
        name: `${user.firstName} ${user.lastName}`.trim(),
        email: user.email
    });
}