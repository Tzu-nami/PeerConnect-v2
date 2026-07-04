import type { NextApiRequest, NextApiResponse } from "next";
import { createClient as createServerClient } from "@/utils/supabase/server";

const STUDENT_NUM_REGEX = /^\d{4}-\d{5}$/;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // Create
    if (req.method !== 'POST') return res.status(405).end();

    // Check if authenticated
    const supabase = createServerClient({ req, res } as any);
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return res.status(401).json({ error: 'Unauthorized' });

    // Validate inputs
    const userId = session.user.id;
    const { student_num, college_id, degreeProgram_id, yearLevel_id } = req.body;

    if (!STUDENT_NUM_REGEX.test(student_num ?? ''))
        return res.status(422).json({ errors: { student_num: 'Student number must follow the format XXXX-XXXXX' } });
    if (!college_id)
        return res.status(422).json({ errors: { college_id: 'College is required.' } });
    if (!degreeProgram_id) 
        return res.status(422).json({ errors: { degreeProgram_id: 'Degree program is required.' } });
    if (!yearLevel_id)     
        return res.status(422).json({ errors: { yearLevel_id: 'Year level is required.' } });

    // Update then insert
    const { error } = await supabase
        .from('student_profiles')
        .upsert({
            user_id: userId,
            student_num,
            college_id,
            degreeProgram_id,
            yearLevel_id
        },
        // Update if user already exists
        { onConflict: 'user_id' }
    );

    if (error) {
        console.error("Profile save error:", error);
        return res.status(500).json({ error: 'Failed to save profile.'});
    }

    return res.status(200).json({ ok: true });
}