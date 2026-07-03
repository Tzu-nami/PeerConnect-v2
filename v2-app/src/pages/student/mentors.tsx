import type { GetServerSideProps } from 'next';
import { createClient } from '@/utils/supabase/server';
import MentorHeader from '@/components/landing/mentors/MentorHeader';
import MentorDirectory from '@/components/landing/mentors/MentorDirectory';
import type { Mentor, Subject } from '@/types/mentor';

// Utilities
import { getServerSideUserRole } from '@/utils/getServerSideUserRole';
import { format12hrTime } from '@/utils/formatHours';

const DAY_ORDER: Record<string, number> = {
    monday: 1, tuesday: 2, wednesday: 3,
    thursday: 4, friday: 5, saturday: 6,
};

function avatarPlaceholder(name: string): string {
    const initial = name.trim().charAt(0).toUpperCase();
    return `https://api.dicebear.com/8.x/initials/svg?seed=${initial}&backgroundColor=1a3c2f&textColor=ffffff`;
}

interface Props {
    mentors: Mentor[];
    subjects: Subject[];
    isAuthenticated: boolean;
    userRole?: string;
}

export default function MentorsPage({ mentors, subjects, isAuthenticated, userRole }: Props) {
    return (
        <>
            <div className="border-cream-border">
                <div>
                <h1 className="text-xl md:text-2xl xl:text-3xl font-extrabold tracking-tight text-up-maroon">Our Peer Mentors</h1>
                <p className="text-xs md:text-sm xl:text-base font-medium text-slate-500 mt-1 mb-3">Browse available mentors and their expertise</p>
                </div>
            </div>
            <div>
                <MentorDirectory mentors={mentors} subjects={subjects} isAuthenticated={isAuthenticated} userRole={userRole} />
            </div>
        </>
    );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const supabase = createClient(context);

    // Database fetching
    const [userRole, { data: { session } }, { data: mentorRows }, { data: subjectRows }] = await Promise.all([
        getServerSideUserRole(context),
        supabase.auth.getSession(),
        supabase.from('mentor_profiles').select(`
            id,
            user_id,
            user_profiles (
                firstName,
                lastName,
                middleInitial,
                email,
                avatar,
                student_profiles (
                    year_levels ( name ),
                    degree_programs ( name ),
                    colleges ( name )
                )
            ),
            mentor_subjects (
                subjects ( id, code, name )
            ),
            mentor_availabilities (
                day_of_week,
                start_time,
                end_time
            )
        `).eq('is_active', true),
        supabase.from('subjects').select('id, code, name').order('code'),
    ]);

    const isAuthenticated = !!session;

    // Mentors data
    const mentors: Mentor[] = (mentorRows ?? [])
        .map((mp: any) => {
            const user = mp.user_profiles;
            const rawStudentProfile = user?.student_profiles;
            const studentProfile = Array.isArray(rawStudentProfile) 
                ? rawStudentProfile[0] 
                : rawStudentProfile;

            // Get mentor available days
            const rawDays: string[] = (mp.mentor_availabilities ?? [])
                .map((a: any) => a.day_of_week as string);
            const scheduleDays = [...new Set(rawDays)]
                .sort((a, b) => (DAY_ORDER[a.toLowerCase()] ?? 99) - (DAY_ORDER[b.toLowerCase()] ?? 99))
                .map((d) => d.charAt(0).toUpperCase() + d.slice(1, 3));

            // Map mentor availability in an array
            const schedule: Record<string, { slots: { start: string; end: string }[] }> = {};
            for (const avail of (mp.mentor_availabilities ?? [])) {
                const key = avail.day_of_week.toLowerCase();
                if (!schedule[key]) schedule[key] = { slots: [] };
                schedule[key].slots.push({
                    start: format12hrTime(avail.start_time),
                    end: format12hrTime(avail.end_time),
                });
            }

            // Cleaner time formatting
            for (const key of Object.keys(schedule)) {
                schedule[key].slots.sort((a, b) => {
                    const toMinutes = (t: string) => {
                        const [time, period] = t.split(' ');
                        const [h, m] = time.split(':').map(Number);
                        return (period === 'PM' && h !== 12 ? h + 12 : h) * 60 + m;
                    };
                    return toMinutes(a.start) - toMinutes(b.start);
                });
            }

            const fullName = `${user?.firstName ?? ''} ${user?.lastName ?? ''}`.trim();

            // Mapped data
            return {
                id: mp.id,
                user_id: mp.user_id,
                lastName: (user?.lastName ?? '').toUpperCase(),
                firstName: user?.firstName ?? '',
                middleInitial: user?.middleInitial ? `${user.middleInitial}.` : '',
                email: user?.email ?? '',
                avatar: user?.avatar ?? avatarPlaceholder(fullName),
                subjects: (mp.mentor_subjects ?? [])
                    .map((ms: any) => ms.subjects)
                    .filter(Boolean)
                    .filter((s: any, i: number, arr: any[]) => arr.findIndex((x) => x.id === s.id) === i)
                    .sort((a: any, b: any) => a.code.localeCompare(b.code)),
                days: scheduleDays,
                schedule,
                yearLevel: studentProfile?.year_levels?.name ?? '',
                degreeProgram: studentProfile?.degree_programs?.name ?? '',
                college: studentProfile?.colleges?.name ?? '',
            } satisfies Mentor;
        })
        .sort((a: Mentor, b: Mentor) => a.lastName.localeCompare(b.lastName));

    return {
        props: {
            mentors,
            subjects: subjectRows ?? [],
            isAuthenticated,
            userRole,
        },
    };
};