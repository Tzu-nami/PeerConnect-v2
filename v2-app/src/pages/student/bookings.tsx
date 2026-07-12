import { useState } from 'react';
import { useRouter } from 'next/router';
import type { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { getServerSideUserRole } from '@/utils/getServerSideUserRole';
import { createClient } from '@/utils/supabase/server';
import { getStudentBookingPageData } from '@/utils/services/bookingService'; 
import { FaBan } from 'react-icons/fa6';
import { toast } from 'sonner';

import ActiveBookingCard from '@/components/student/bookings/ActiveBookingCard';
import StudentProfilePanel from '@/components/student/bookings/StudentProfilePanel';
import RecentBookingsPanel from '@/components/student/bookings/RecentBookingsPanel';
import BookingForm from '@/components/student/bookings/BookingForm';
import ConfirmModal from '@/components/ui/ConfirmModal';
import FeedbackModal from '@/components/student/bookings/FeedbackModal';

import type { BookingMentor, MentorAvailability, MentorBookedSlot, MentorSubjectLink, TutorialMode, College, DegreeProgram, YearLevel, StudentProfile, RecentBooking, ActiveBooking, CompletedBookingForFeedback } from '@/types/bookings';
import type { Subject } from '@/types/mentor';

interface BookingPageProps {
    mentors: BookingMentor[];
    availabilities: MentorAvailability[];
    bookedSlots: MentorBookedSlot[];
    mentorSubjects: MentorSubjectLink[];
    subjects: Subject[];
    tutorialModes: TutorialMode[];
    colleges: College[];
    degreePrograms: DegreeProgram[];
    yearLevels: YearLevel[];
    studentProfile: StudentProfile | null;
    recentBookings: RecentBooking[];
    activeBooking: ActiveBooking | null;
    lockedMentorId?: string;
    userRole?: string;
    completedBookingForFeedback: CompletedBookingForFeedback | null;
}

export default function StudentBookingsPage({ mentors, availabilities, bookedSlots, mentorSubjects, subjects, tutorialModes, colleges, degreePrograms, yearLevels, studentProfile: initialProfile, recentBookings,  activeBooking, lockedMentorId, userRole, completedBookingForFeedback }: BookingPageProps) {
    const router = useRouter();
    const [profile, setProfile]           = useState(initialProfile);
    const [showCancelConfirm, setShowCancelConfirm] = useState(false);
    const [cancelLoading, setCancelLoading]         = useState(false);
    const [feedbackBooking, setFeedbackBooking] = useState(completedBookingForFeedback);

    const handleRefresh = () => {
        router.replace(router.asPath);
    }

    const handleBookingSuccess = () => {
        toast.success("Your session has been booked and is now pending approval.");
        handleRefresh();
    };

    const handleCancel = async () => {
        setCancelLoading(true);
        try {
            const r = await fetch('/api/bookings/cancel', { method: 'POST' });
            if (!r.ok) { 
                toast.error('Failed to cancel. Please try again.'); 
                return; 
            }
            setShowCancelConfirm(false);
            toast.success('Your booking has been cancelled. You may now request a new session.');
            setTimeout(() => {
                handleRefresh();
            }, 500);
        } finally {
            setCancelLoading(false);
        }
    };

    const handleFeedbackDone = () => {
        setFeedbackBooking(null);
        toast.success('Thank you for your feedback. You may now request a new session.');

    }
    return (
        <div>
            {!profile && (
                <div className="mb-6 bg-yellow-100 border border-yellow-400 text-black px-4 py-3 rounded">
                    Please complete your Student Profile before booking a session.
                </div>
            )}
            <form 
                autoComplete="off" 
                onSubmit={(e) => e.preventDefault()} 
                className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            >
                {/* Booking forms */}
                <div className="lg:col-span-2">
                    {activeBooking ? (
                        <ActiveBookingCard
                            booking={activeBooking}
                            onCancel={() => setShowCancelConfirm(true)}
                        />
                    ) : (
                        <>
                            <div className="flex-1 min-w-0 pb-6 pt-0">
                                <h1 className="text-3xl font-extrabold tracking-tight text-up-maroon">
                                Request An Enrichment Session
                                </h1>
                                <p className="text-sm font-medium text-slate-500 leading-snug mt-1">
                                Please fill out the details below. Your request will be reviewed by the peer mentor.
                                </p>
                            </div>
                            <BookingForm
                                mentors={mentors}
                                availabilities={availabilities}
                                bookedSlots={bookedSlots}
                                mentorSubjects={mentorSubjects}
                                subjects={subjects}
                                tutorialModes={tutorialModes}
                                lockedMentorId={lockedMentorId}
                                hasProfile={!!profile}
                                onSuccess={handleBookingSuccess}
                                userRole={userRole}
                            />
                        </>
                    )}
                </div>

                {/* Right panels */}
                <div className="lg:col-span-1 space-y-6">
                    <StudentProfilePanel
                        profile={profile}
                        colleges={colleges}
                        degreePrograms={degreePrograms}
                        yearLevels={yearLevels}
                        onSaved={(p) => { setProfile(p); toast.success('Profile saved successfully!'); }}
                    />
                    <RecentBookingsPanel bookings={recentBookings} />
                </div>
            </form>

            {/* Cancel booking confirm */}
            <ConfirmModal
                isOpen={showCancelConfirm}
                title="Cancel Booking?"
                message="Are you sure you want to cancel this session? You will need to submit a new request if you change your mind."
                confirmLabel="Confirm"
                confirmClassName="bg-red-600 hover:bg-red-700"
                icon={
                    <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center">
                        <FaBan className="text-3xl" />
                    </div>
                }
                loading={cancelLoading}
                onConfirm={handleCancel}
                onCancel={() => setShowCancelConfirm(false)}
            />
            {feedbackBooking && (
                <FeedbackModal
                    isOpen={!!feedbackBooking}
                    booking={feedbackBooking}
                    onDone={handleFeedbackDone}
                />
            )}
        </div>
    );
}
export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext) => {
    const supabase = createClient(context);
    const userRole = await getServerSideUserRole(context);

    // Authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return { redirect: { destination: '/login', permanent: false } };
    const { data: profile } = await supabase.from('user_profiles').select('role').eq('id', user.id).maybeSingle();
    if (profile?.role !== 'student') return { redirect: { destination: '/login', permanent: false } };

    const lockedMentorId = context.query.mentor as string | undefined;
    const pageData = await getStudentBookingPageData(supabase, user.id);

    return {
        props: {
            ...pageData,
            ...(lockedMentorId ? { lockedMentorId } : {}),
            userRole,
        },
    };
};