import { SupabaseClient } from '@supabase/supabase-js';
import type { AdminCourse, CoursesMentor } from '@/types/admin';

interface RawSubject {
    id: string;
    code: string;
    name: string;
    mentor_subjects: {
        mentor_profiles: {
            user_profiles: {
                firstName: string;
                lastName: string;
                email: string;
                avatar: string | null;
                student_profiles: {
                    year_levels: { name: string } | null;
                    degree_programs: { code: string } | null;
                } | {
                    year_levels: { name: string } | null;
                    degree_programs: { code: string } | null;
                }[] | null;
            } | null;
        } | null;
    }[] | null;
}

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
    .order('code', { ascending: true })
    .eq('is_active', true)
    .returns<RawSubject[]>();

    if (error) {
        console.error("Error fetching subjects:", error);
        return { subjects: [] };
    }

    // Format courses for better display
    const subjects: AdminCourse[] = (rawSubjects || []).map((sub) => {
        // Get mentor info
        const mappedMentors = (sub.mentor_subjects || [])
            .map((ms) => {
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
            .filter((m): m is CoursesMentor => m !== null);

        // Sort mentors alphabetically
        mappedMentors.sort((a, b) => a.name.localeCompare(b.name));

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