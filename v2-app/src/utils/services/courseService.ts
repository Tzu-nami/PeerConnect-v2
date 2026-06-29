import { SupabaseClient } from '@supabase/supabase-js';
import type { AdminCourse } from '@/types/admin';

export async function getAdminCourseData(supabase: SupabaseClient) {
    // Fetch the data
    const { data: rawSubjects, error } = await supabase
        .from('subjects')
        .select(`
        id,
        code,
        name,
        mentor_subjects (
            mentor_profiles (
                user_profiles (
                    firstName,
                    lastName,
                    email,
                    avatar,
                    student_profiles ( 
                        year_levels(name), 
                        degree_programs(code) 
                    )
                )
            )
        )
    `)
    .order('code', { ascending: true });

    if (error) {
        console.error("Error fetching subjects:", error);
        return { subjects: [] };
    }

    // Format courses for better display
    const subjects: AdminCourse[] = (rawSubjects || []).map((sub: any) => {
        // Get mentor info
        const mappedMentors = (sub.mentor_subjects || [])
            .map((ms: any) => {
                const userProfile = ms.mentor_profiles?.user_profiles;
                if (!userProfile) return null;

                const studentProfile = Array.isArray(userProfile.student_profiles) ? 
                    userProfile.student_profiles[0] 
                    : userProfile.student_profiles;

                return {
                    name: `${userProfile.lastName.toUpperCase()}, ${userProfile.firstName}`,
                    email: userProfile.email,
                    avatar: userProfile.avatar || null,
                    yearLevel: studentProfile?.year_levels?.name ?? '',
                    degreeProgram: studentProfile?.degree_programs?.code ?? '',
                };
            })
            .filter(Boolean);

        // Sort mentors alphabetically
        mappedMentors.sort((a: any, b: any) => a.name.localeCompare(b.name));

        return {
            id: sub.id,
            code: sub.code,
            name: sub.name,
            mentors: mappedMentors,
            mentorCount: mappedMentors.length,
        };
    });

    return { subjects };
}

export async function checkSubjectExists(supabase: SupabaseClient, code: string): Promise<boolean> {
  try {
        const { data } = await supabase
        .from('subjects')
        .select('id')
        .ilike('code', code.trim())
        .maybeSingle();
        
        return !!data;
    } catch (error) {
        console.error("Error checking subject existence:", error);
        return false;
    }
}