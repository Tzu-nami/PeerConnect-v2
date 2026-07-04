import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient as createServerClient } from '@/utils/supabase/server';

interface FetchedMentor {
    user_id: string;
    user_profiles: { avatar: string | null } | null;
}

interface AvailabilityInput {
    day_of_week: string;
    start_time: string;
    end_time: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { id } = req.query as { id: string };

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

    // Edit request
    if (req.method === 'PUT') {
        try {
            const { firstName, lastName, middleInitial, selectedSubjects, availabilities, avatarUrl } = req.body;

            // Get user id
            const { data: mp, error: fetchError } = await supabase.from('mentor_profiles')
                .select('user_id, user_profiles(avatar)')
                .eq('id', id)
                .returns<FetchedMentor[]>()
                .single();
            if (fetchError || !mp) throw new Error('Mentor not found');

            // Update profile
            const { error: userError } = await supabase.from('user_profiles')
                .update({ 
                    firstName, 
                    lastName, 
                    middleInitial: middleInitial || null,
                    ...(avatarUrl !== undefined && { avatar: avatarUrl })
                })
                .eq('id', mp.user_id);
            if (userError) throw userError;

            // Update avatar
            if (avatarUrl !== undefined && mp.user_profiles?.avatar) {
                const oldAvatar = mp.user_profiles.avatar;
                if (oldAvatar.includes('supabase.co')) {
                    const oldPath = oldAvatar.split('/').pop();
                    if (oldPath) {
                        await supabase.storage.from('avatars').remove([`mentors/${oldPath}`]);
                    }
                }
            }

            // Update subjects
            await supabase.from('mentor_subjects').delete().eq('mentor_id', id);
            if (selectedSubjects?.length > 0) {
                const { error: subError } = await supabase.from('mentor_subjects').insert(
                    selectedSubjects.map((sid: string) => ({ mentor_id: id, subject_id: sid }))
                );
                if (subError) throw subError;
            }

            // Update availabilities
            await supabase.from('mentor_availabilities').delete().eq('mentor_id', id);
            if (availabilities?.length > 0) {
                const { error: availError } = await supabase.from('mentor_availabilities').insert(
                    availabilities.map((a: AvailabilityInput) => ({ 
                        mentor_id: id, day_of_week: a.day_of_week, start_time: a.start_time, end_time: a.end_time 
                    }))
                );
                if (availError) throw availError;
            }

            return res.status(200).json({ ok: true });
        } catch (error: any) {
            console.error('Edit Error:', error);
            return res.status(500).json({ error: error.message });
        }
    }

    // Delete request
    if (req.method === 'DELETE') {
        try {
            // Fetch avatar url to be deleted
            const { data: mp, error: fetchError } = await supabase.from('mentor_profiles')
                .select('user_id, user_profiles(avatar)').eq('id', id).returns<FetchedMentor[]>().single(); 
            
            if (fetchError || !mp) throw new Error('Mentor not found');

            // Cancel pending/active bookings, completed remains
            const { error: bookError } = await supabase.from('bookings')
                .update({ booking_status: 'cancelled' }) 
                .eq('mentor_id', id)
                .in('booking_status', ['pending', 'accepted']);
            if (bookError) throw bookError;

            // Remove their subjects and availability
            await supabase.from('mentor_subjects').delete().eq('mentor_id', id);
            await supabase.from('mentor_availabilities').delete().eq('mentor_id', id);

            // Delete avatar in supabase
            const currentAvatar = mp.user_profiles?.avatar;
            if (currentAvatar && currentAvatar.includes('supabase.co')) {
                const filePath = currentAvatar.split('/').pop(); 
                if (filePath) {
                    await supabase.storage.from('avatars').remove([`mentors/${filePath}`]);
                }
            }
        
            // Soft delete profile by making mentor inactive
            const { error: deleteError } = await supabase.from('mentor_profiles')
                .update({ is_active: false })
                .eq('id', id);
            if (deleteError) throw deleteError;

            // Revert to student role
            const { error: downError } = await supabase.from('user_profiles') 
                .update({ role: 'student', avatar: null }) 
                .eq('id', mp.user_id);
            if (downError) throw downError;

            return res.status(200).json({ ok: true });
        } catch (error: any) {
            console.error('Delete Error:', error);
            return res.status(500).json({ error: error.message });
        }
    }

  res.setHeader('Allow', ['PUT', 'DELETE']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}