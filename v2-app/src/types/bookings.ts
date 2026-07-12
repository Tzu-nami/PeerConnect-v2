import type { Subject } from "./mentor";
import type { SessionStatus } from "./admin";

// Mentor dropdown list
export interface BookingMentor {
    id: string;
    profile_id: string;
    name: string;
}

export interface MentorAvailability {
    mentorProfile_id: string;
    day_of_week: string;
    start_time: string;
    end_time: string;
}

// Check if mentor is already booked
export interface MentorBookedSlot {
    mentor_id: string;
    date: string;
    day_of_week: string;
    start: string;
    end: string;
}

export interface MentorSubjectLink {
    mentorProfile_id: string;
    subject_id: string;
}

// Other dropdown options
export interface TutorialMode {
    id: string;
    mode: string;
}

export interface College {
    id: string;
    code: string;
    name: string;
}

export interface DegreeProgram {
    id: string;
    college_id: string;
    name: string;
}

export interface YearLevel {
    id: string;
    name: string;
}

// Student info
export interface StudentProfile {
    id: string;
    user_id: string;
    student_num: string;
    college_id: string;
    degreeProgram_id: string;
    yearLevel_id: string;
}

export interface StudentBooking {
    id: string;
    student_id: string;
    mentor_id: string | null;
    topic: string;
    date: string;
    schedule_start: string;
    schedule_end: string;
    booking_status: SessionStatus;

    subjects?: Partial<Subject>;
    tutorial_modes?: {
        mode: string;
    };
    mentor_profiles?: {
        user_profiles?: {
            firstName: string;
            lastName: string;
        }
    };
}

export interface RecentBooking {
    id: string;
    subject_code: string;
    subject_name: string;
    mentor_name: string;
    topic: string;
    mode: string;
    date: string;
    start_time: string;
    end_time: string;
    status: string;
}

export interface ActiveBooking {
    id: string;
    subject_code: string;
    subject_name: string;
    topic: string;
    mentor_name: string;
    mode: string;
    date: string;
    start_time: string;
    end_time: string;
    status: 'pending' | 'accepted';
}

export interface CompletedBookingForFeedback {
    id: string;
    subject_code: string;
    subject_name: string;
    mentor_name: string;
    date: string;
    topic: string;
}

export interface FeedbackFormState {
    q1: number | null;
    q2: number | null;
    q3: number | null;
    q4: number | null;
    q5: number | null;
    q6: number | null;
    q7: number | null;
    q8: number | null;
    q9: number | null;
    q10: boolean | null;
    feedback: string;
}