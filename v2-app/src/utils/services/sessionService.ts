import { SupabaseClient } from '@supabase/supabase-js';
import type { AdminSession, SessionStatus } from '@/types/admin';
import { format12hrTime, formatHours } from '../formatHours';

interface RawBooking {
    id: string;
    topic: string;
    booking_status: SessionStatus;
    date: string;
    schedule_start: string;
    schedule_end: string;
    mentor_id: string | null;
    student_profiles: {
        student_num: string;
        year_levels: { name: string } | null;
        degree_programs: { name: string } | null;
        user_profiles: {
            firstName: string;
            lastName: string;
            email: string;
            avatar: string | null;
        } | null;
    } | null;
    mentor_profiles: {
        user_profiles: { firstName: string; lastName: string } | null;
    } | null;
    subjects: { code: string; name: string } | null;
    tutorial_modes: { mode: string } | null;
}

// Remove parenthesis words in session mode display 
function cleanMode(mode: string): string {
    return mode
        .replace(/\s*\([^)]*\)\s*/g, ' ')
        .trim();
}

// Fetch five recent semesters
export async function getRecentSemesters(supabase: SupabaseClient) {
    const { data, error } = await supabase
        .from('semesters')
        .select('id, term, ay_start, semester_start, semester_end, is_current')
        .order('semester_start', { ascending: false })
        .limit(5);

    return error ? [] : data;
}

// Fetch all semesters
export async function getAllSemesters(supabase: SupabaseClient) {
    const { data, error } = await supabase
        .from('semesters')
        .select('id, term, ay_start, semester_start, semester_end, is_current')
        .order('semester_start', { ascending: false });

    return error ? [] : data;
}

// Database fetch
export async function getAdminSessionsData(supabase: SupabaseClient, semesterId?: string | null) {
    if (!semesterId) {
        return { sessions: [], counts: { total: 0, accepted: 0, pending: 0, completed: 0, totalHours: '0.00', totalRawHours: 0 } };
    }

    const { data: bookings, error } = await supabase
        .from('bookings')
        .select(`
      id,
      topic,
      booking_status,
      date,
      schedule_start,
      schedule_end,
      mentor_id,
      student_profiles!student_id (
        student_num,
        year_levels ( name ),
        degree_programs ( name ),
        user_profiles ( firstName, lastName, email, avatar )
      ),
      mentor_profiles!mentor_id (
        user_profiles ( firstName, lastName )
      ),
      subjects ( code, name ),
      tutorial_modes ( mode )
    `)
        .eq('semester_id', semesterId)
        .returns<RawBooking[]>();

    // Error message
    if (error || !bookings) {
        console.error("Error fetching sessions:", error);
        return { sessions: [], counts: { total: 0, accepted: 0, pending: 0, completed: 0, totalHours: '0.00', totalRawHours: 0 } };
    }

  const groups = new Map<string, RawBooking[]>();
  const cancelledSessions: RawBooking[] = [];

  for (const b of bookings) {
    if (b.booking_status === 'cancelled') {
      cancelledSessions.push(b);
      continue;
    }
    const modeRaw = b.tutorial_modes?.mode ?? '';
    const isGroup = modeRaw.toLowerCase().includes('group');

        const key = isGroup
            ? `${b.date} | ${b.schedule_start} | ${b.schedule_end} | ${b.subjects?.code ?? ''} | ${(b.topic ?? '').trim()}`
            : b.id;

        if (!groups.has(key)) groups.set(key, []);
        groups.get(key)!.push(b);
    }

  // Sessions data formatting display
  const sessions: AdminSession[] = [];
  const createAdminSession = (group: RawBooking[], derivedStatus: SessionStatus): AdminSession => {
    const b = group[0];
    const start = new Date(b.schedule_start);
    const end = new Date(b.schedule_end);
    const diffMs = end.getTime() - start.getTime();
    const diffMinutes = diffMs / 60000;
    const durationHours = diffMinutes / 60;
    const studentUsers = group
      .map(bk => bk.student_profiles?.user_profiles)
      .filter((u): u is NonNullable<typeof u> => u !== null && u !== undefined);
    const mentorUser = b.mentor_profiles?.user_profiles;
    const sp = b.student_profiles;
    return {
      id: b.id,
      group_ids: group.map(bk => bk.id),
      avatar: group.length > 1 ? null : studentUsers[0]?.avatar ?? null,
      student: group.length > 1 ? `${group.length} Students (Group)` : `${studentUsers[0]?.firstName} ${studentUsers[0]?.lastName}`,
      studentNames: studentUsers.map(u => `${u.firstName} ${u.lastName}`).join(', '),
      email: group.length > 1 ? 'Multiple Emails' : (studentUsers[0]?.email ?? ''),
      emails: studentUsers.map(u => u.email ?? '').join(', '),
      mentor: mentorUser ? `${mentorUser.firstName} ${mentorUser.lastName}` : '—',
      subject: b.subjects?.code ?? 'N/A',
      subjectName: b.subjects?.name ?? '',
      topic: b.topic ?? '—',
      date: new Date(b.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      time: `${format12hrTime(`${String(start.getHours()).padStart(2,'0')}:${String(start.getMinutes()).padStart(2,'0')}`)} – ${format12hrTime(`${String(end.getHours()).padStart(2,'0')}:${String(end.getMinutes()).padStart(2,'0')}`)}`,
      start: `${String(start.getHours()).padStart(2,'0')}:${String(start.getMinutes()).padStart(2,'0')}`,
      end: `${String(end.getHours()).padStart(2,'0')}:${String(end.getMinutes()).padStart(2,'0')}`,
      durationText: `${format12hrTime(`${String(start.getHours()).padStart(2,'0')}:${String(start.getMinutes()).padStart(2,'0')}`)} - ${format12hrTime(`${String(end.getHours()).padStart(2,'0')}:${String(end.getMinutes()).padStart(2,'0')}`)} (${formatHours(diffMinutes)})`,
      durationHours,
      mode: b.tutorial_modes?.mode ? cleanMode(b.tutorial_modes.mode) : '—',
      yearLevel: group.map(bk => bk.student_profiles?.year_levels?.name ?? 'N/A').join(', '),
      degreeProgram: group.map(bk => bk.student_profiles?.degree_programs?.name ?? 'N/A').join(', '),
      status: derivedStatus,
      is_open: b.mentor_id === null,
    };
  };

  for (const group of groups.values()) {
    const hasCompleted = group.some(bk => bk.booking_status === 'completed');
    const hasAccepted = group.some(bk => bk.booking_status === 'accepted');
    const hasPending = group.some(bk => bk.booking_status === 'pending');

    let derivedStatus: SessionStatus = group[0].booking_status;
    if (hasCompleted) derivedStatus = 'completed';
    else if (hasAccepted) derivedStatus = 'accepted';
    else if (hasPending) derivedStatus = 'pending';

    sessions.push(createAdminSession(group, derivedStatus));
  }
  for (const b of cancelledSessions) {
    sessions.push(createAdminSession([b], 'cancelled'));
  }

    // Sort chronologically
    sessions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    // Stats
    const completedSessions = sessions.filter(s => s.status === 'completed');
    const totalRawHours = completedSessions.reduce((sum, s) => sum + (s.durationHours || 0), 0);
    const totalMins = Math.round(totalRawHours * 60);
    const hrs = Math.floor(totalMins / 60);
    const mins = totalMins % 60
    const counts = {
        total: sessions.length,
        accepted: sessions.filter(s => s.status === 'accepted').length,
        pending: sessions.filter(s => s.status === 'pending').length,
        completed: completedSessions.length,
        totalRawHours: totalRawHours,
        totalHours: `${hrs}h ${mins}m`
    };

    return { sessions, counts };
}