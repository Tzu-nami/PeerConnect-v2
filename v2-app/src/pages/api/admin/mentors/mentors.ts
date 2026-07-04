import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient as createServerClient } from '@/utils/supabase/server';

interface AvailabilityInput {
    day_of_week: string;
    start_time: string;
    end_time: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    // Check if admin
    const supabase = createServerClient({ req, res } as any);
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return res.status(401).json({ error: 'Unauthorized' });

    const { data: callerProfile } = await supabase
        .from('user_profiles')
        .select('role')
        .eq('id', user.id)
        .single();

    if (callerProfile?.role !== 'admin') {
        return res.status(403).json({ error: 'Forbidden: Admin access required.' });
    }

    // Create request
    if (req.method === 'POST') {
        try {
            const { userId, selectedSubjects, availabilities, avatarUrl } = req.body;

            // Change to mentor role
            const { error: userError } = await supabase.from('user_profiles') 
                .update({ role: 'mentor', avatar: avatarUrl })
                .eq('id', userId);
            if (userError) throw userError;

            // Create mentor profile
            const { data: existingProfile, error: checkError } = await supabase
                .from('mentor_profiles')
                .select('id')
                .eq('user_id', userId)
                .maybeSingle();

            if (checkError) throw checkError;

            let mentorId;

            if (existingProfile) {
                const { error: updateError } = await supabase
                    .from('mentor_profiles')
                    .update({ is_active: true })
                    .eq('id', existingProfile.id);
                if (updateError) throw updateError;

                mentorId = existingProfile.id;
                await supabase.from('mentor_subjects').delete().eq('mentor_id', mentorId);
                await supabase.from('mentor_availabilities').delete().eq('mentor_id', mentorId);
            } else {
                const { data: newProfile, error: insertError } = await supabase
                    .from('mentor_profiles')
                    .insert({ user_id: userId, is_active: true })
                    .select()
                    .single();
                if (insertError) throw insertError;
                
                mentorId = newProfile.id;
            }

            // Create mentor subjects
            if (selectedSubjects?.length > 0) {
                const { error: subError } = await supabase.from('mentor_subjects').insert(
                selectedSubjects.map((sid: string) => ({ mentor_id: mentorId, subject_id: sid }))
                );
                if (subError) throw subError;
            }

            // Create mentor availabilities
            if (availabilities?.length > 0) {
                const { error: availError } = await supabase.from('mentor_availabilities').insert(
                    availabilities.map((a: AvailabilityInput) => ({ 
                        mentor_id: mentorId, 
                        day_of_week: a.day_of_week, 
                        start_time: a.start_time, 
                        end_time: a.end_time 
                    }))
                );
                if (availError) throw availError;
            }

            return res.status(201).json({ success: true });
        } catch (error: any) {
            console.error('Error creating mentor:', error);
            return res.status(500).json({ error: error.message });
        }
    }

  res.setHeader('Allow', ['POST', 'PUT', 'DELETE']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}