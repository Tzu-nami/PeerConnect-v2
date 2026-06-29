import { SupabaseClient } from '@supabase/supabase-js';
import type { AdminMentor, MentorStat } from '@/types/admin';

const DAY_ORDER: Record<string, number> = { monday: 1, tuesday: 2, wednesday: 3, thursday: 4, friday: 5, saturday: 6 };

function avatarPlaceholder(name: string) {
  const initial = name.trim().charAt(0).toUpperCase();
  return `https://api.dicebear.com/8.x/initials/svg?seed=${initial}&backgroundColor=1a3c2f&textColor=ffffff`;
}

function formatTime(timeStr: string) {
  const [h, m] = timeStr.split(':').map(Number);
  const p = h >= 12 ? 'PM' : 'AM';
  const hr = h % 12 || 12;
  return `${hr}:${String(m).padStart(2, '0')} ${p}`;
}

export async function getAdminMentorsData(supabase: SupabaseClient) {
  const now = new Date();
  const weekStart = new Date(now); weekStart.setDate(now.getDate() - now.getDay() + 1);
  const weekEnd = new Date(weekStart); weekEnd.setDate(weekStart.getDate() + 6);

  // Fetch the data
  const [{ count: total }, { data: bookings }, { data: subjects }, { data: mentorRows }] = await Promise.all([
    supabase.from('mentor_profiles').select('*', { count: 'exact', head: true }).eq('is_active', true),
    supabase.from('bookings').select('mentor_id, booking_status, date').not('mentor_id', 'is', null),
    supabase.from('subjects').select('id, code, name').order('code'),
    supabase.from('mentor_profiles').select(`
      id, user_id,
      user_profiles ( firstName, lastName, middleInitial, email, avatar,
        student_profiles ( student_num, year_levels(name), degree_programs(name), colleges(name) )
      ),
      mentor_subjects ( subjects(id, code, name) ),
      mentor_availabilities ( day_of_week, start_time, end_time )
    `).eq('is_active', true)
  ]);

  // Format mentors for better display
  const formattedMentors: AdminMentor[] = (mentorRows ?? []).map((mp: any) => {
    const u = mp.user_profiles;
    const sp = Array.isArray(u?.student_profiles) ? u.student_profiles[0] : u?.student_profiles;

    const rawDays = [...new Set<string>((mp.mentor_availabilities ?? []).map((a: any) => a.day_of_week as string))]
      .sort((a, b) => (DAY_ORDER[a.toLowerCase()] ?? 99) - (DAY_ORDER[b.toLowerCase()] ?? 99))
      .map(d => d.charAt(0).toUpperCase() + d.slice(1, 3));

    const schedule: any = {};
    for (const a of (mp.mentor_availabilities ?? [])) {
      const key = a.day_of_week.toLowerCase();
      if (!schedule[key]) schedule[key] = { slots: [] };
      schedule[key].slots.push({ start: formatTime(a.start_time), end: formatTime(a.end_time) });
    }

    const validSubjects = (mp.mentor_subjects ?? []).map((ms: any) => ms.subjects).filter(Boolean)
      .filter((s: any, i: number, arr: any[]) => arr.findIndex(x => x.id === s.id) === i)
      .sort((a: any, b: any) => a.code.localeCompare(b.code));

    const fullName = `${u?.firstName ?? ''} ${u?.lastName ?? ''}`.trim();

    return {
      id: mp.id, user_id: mp.user_id,
      lastName: u?.lastName ?? '',
      firstName: u?.firstName ?? '',
      middleInitial: u?.middleInitial ? `${u.middleInitial}.` : '',
      email: u?.email ?? '',
      student_num: sp?.student_num ?? '',
      avatar: u?.avatar ?? avatarPlaceholder(fullName),
      subjects: validSubjects,
      subjectsTable: validSubjects.map((s: any) => s.code).join(', '),
      days: rawDays, schedule,
      yearLevel: sp?.year_levels?.name ?? '',
      degreeProgram: sp?.degree_programs?.name ?? '',
      college: sp?.colleges?.name ?? '',
    };
  }).sort((a: any, b: any) => a.lastName.localeCompare(b.lastName));

  // Stats
  let mostActiveName = 'N/A';
  const weekBookings = (bookings ?? []).filter(b => {
    const d = new Date(b.date);
    return d >= weekStart && d <= weekEnd;
  });

  const completedBookings = (bookings ?? []).filter(b => b.booking_status === 'completed');

  // Mentor with most completed bookings
  if (completedBookings.length > 0) {
    const mentorCounts = completedBookings.reduce((acc: Record<string, number>, booking) => {
      acc[booking.mentor_id] = (acc[booking.mentor_id] || 0) + 1;
      return acc;
    }, {});

    const topMentorId = Object.keys(mentorCounts).reduce((a, b) => 
      mentorCounts[a] > mentorCounts[b] ? a : b
    );
    const topMentor = formattedMentors.find(m => m.id === topMentorId);
    if (topMentor) {
      mostActiveName = `${topMentor.lastName}`;
    }
  }

  // Stats
  const stats: MentorStat = {
    total: total ?? 0,
    acceptedThisWeek: new Set(weekBookings.filter(b => b.booking_status === 'accepted').map(b => b.mentor_id)).size,
    pendingThisWeek:  new Set(weekBookings.filter(b => b.booking_status === 'pending').map(b => b.mentor_id)).size,
    mostActive: mostActiveName,
  };

  return { mentors: formattedMentors, subjects: subjects ?? [], stats };
}