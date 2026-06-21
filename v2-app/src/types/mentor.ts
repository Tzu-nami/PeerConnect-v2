// Mentor subjects taught
export interface Subject {
    id: string;
    code: string;
    name: string;
}

// Mentor time availabilities
export interface Availability {
    start: string;
    end: string;
}

// Mentor availability per day
export interface DaySchedule {
    slots: Availability[];
}

// Mentor weekly schedule
export type WeekSchedule = Partial<Record<string, DaySchedule>>;

export interface Mentor {
    id: string;
    user_id: string;
    lastName: string;
    firstName: string;
    middleInitial?: string;
    email: string;
    avatar?: string;
    subjects: Subject[];
    days: string[];
    schedule: WeekSchedule;
    yearLevel: string;
    degreeProgram: string;
    college: string;
    bookingUrl?: string;
}