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