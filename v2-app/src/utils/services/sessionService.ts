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

// Database fetch
export async function getAdminSessionsData(supabase: SupabaseClient) {

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
    .returns<RawBooking[]>();

  // Error message
  if (error || !bookings) {
    console.error("Error fetching sessions:", error);
    return { sessions: [], counts: { total: 0, accepted: 0, pending: 0, completed: 0, totalHours: '0.00', totalRawHours: 0 } };
  }

  const groups = new Map<string, RawBooking[]>();

  for (const b of bookings) {
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
  
  for (const group of groups.values()) {
    const b = group[0];
    const start = new Date(b.schedule_start);
    const end   = new Date(b.schedule_end);
    const diffMs = end.getTime() - start.getTime();
    const diffMinutes = diffMs / 60000;
    const durationHours = (diffMs / 60000) / 60;
    const startStr = `${String(start.getHours()).padStart(2,'0')}:${String(start.getMinutes()).padStart(2,'0')}`;
    const endStr   = `${String(end.getHours()).padStart(2,'0')}:${String(end.getMinutes()).padStart(2,'0')}`;
    
    const studentUsers = group
      .map(bk => bk.student_profiles?.user_profiles)
      .filter((u): u is NonNullable<typeof u> => u !== null && u !== undefined);
      
    const studentNames = studentUsers
      .map(u => `${u.firstName} ${u.lastName}`)
      .join(', ');
      
    const emails = studentUsers
      .map(u => u.email ?? '')
      .join(', ');
      
    const mentorUser = b.mentor_profiles?.user_profiles;
    const subject    = b.subjects;
    const modeRaw    = b.tutorial_modes?.mode ?? '';
    const sp         = b.student_profiles;
    const dateObj  = new Date(b.date);
    const dateStr  = dateObj.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const timeStr  = `${format12hrTime(startStr)} – ${format12hrTime(endStr)}`;
    const durText  = formatHours(diffMinutes);
    const durationText = `${format12hrTime(startStr)} - ${format12hrTime(endStr)} (${durText})`;

    sessions.push({
      id:            b.id,
      group_ids:     group.map(bk => bk.id),
      avatar:        group.length > 1 ? null : studentUsers[0]?.avatar ?? null,
      student:       group.length > 1 ? `${group.length} Students (Group)` : studentNames,
      studentNames,
      email:         group.length > 1 ? 'Multiple Emails' : emails,
      emails,
      mentor:        mentorUser ? `${mentorUser.firstName} ${mentorUser.lastName}` : '—',
      subject:       subject?.code ?? 'N/A',
      subjectName:   subject?.name ?? '',
      topic:         b.topic ?? '—',
      date:          dateStr,
      time:          timeStr,
      start:         startStr,
      end:           endStr,
      durationText, 
      durationHours,
      mode:          modeRaw ? cleanMode(modeRaw) : '—',
      yearLevel:     sp?.year_levels?.name ?? 'N/A',
      degreeProgram: sp?.degree_programs?.name ?? 'N/A',
      status:        b.booking_status,
      is_open:       b.mentor_id === null,
    });
  }

  // Sort chrnologically
  sessions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Stats
  const completedSessions = sessions.filter(s => s.status === 'completed');
  const totalRawHours = completedSessions.reduce((sum, s) => sum + (s.durationHours || 0), 0);
  const counts = {
    total: sessions.length,
    accepted: sessions.filter(s => s.status === 'accepted').length,
    pending: sessions.filter(s => s.status === 'pending').length,
    completed: completedSessions.length,
    totalRawHours: totalRawHours,
    totalHours: totalRawHours.toFixed(2)
  };

  return { sessions, counts };
}