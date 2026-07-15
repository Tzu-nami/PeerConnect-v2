export interface AvailabilityRow {
    id: string;
    day_of_week: string;
    start_time: string;
    end_time: string;
}

export interface MentorStat {
    total: number;
    acceptedThisWeek: number;
    pendingThisWeek: number;
    mostActive: string;
}

export interface AdminMentor {
    id: string;
    user_id: string;
    lastName: string;
    firstName: string;
    middleInitial: string;
    email: string;
    student_num: string;
    avatar: string;
    subjects: { id: string; code: string; name: string }[];
    subjectsTable: string;
    days: string[];
    schedule: Record<string, { slots: { start: string; end: string }[] }>;
    yearLevel: string;
    degreeProgram: string;
    college: string;
}

export interface CoursesMentor {
    name: string;
    email: string;
    avatar: string | null;
    yearLevel: string;
    degreeProgram: string;
}

export interface AdminCourse {
    id: string;
    code: string;
    name: string;
    mentors: CoursesMentor[];
    mentorCount: number;
}

export type SessionStatus = | 'pending' | 'accepted' | 'completed' | 'unavailable' | 'cancelled' | 'no_show' | 'rejected';

export interface AdminSession {
    id: string;
    group_ids: string[];
    avatar: string | null;
    student: string;
    studentNames: string;
    email: string;
    emails: string;
    mentor: string;
    subject: string;
    subjectName: string;
    topic: string;
    date: string;
    time: string;
    start: string;
    end: string;
    durationText: string;
    durationHours: number;
    mode: string;
    yearLevel: string;
    degreeProgram: string;
    status: SessionStatus;
    is_open: boolean;
    room?: string;
}

export interface SessionCounts {
    total: number;
    accepted: number;
    pending: number;
    completed: number;
    totalHours: string;
    totalRawHours: number;
}