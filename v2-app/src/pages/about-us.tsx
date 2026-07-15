import type { GetServerSideProps } from "next";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { LandingImages } from "@/types/landingImages";

// Components
import HeadDesc from "@/components/landing/about/HeadDesc";
import StatsDisplay from "@/components/landing/about/StatsDisplay";
import Mission from "@/components/landing/about/Mission";
import Quote from "@/components/landing/about/Quote";
import HowItWorks from "@/components/landing/about/HowItWorks";
import MentorQualities from "@/components/landing/about/MentorQualities";
import FaqAccordion, { FaqData } from "@/components/landing/about/FaqAccordion";
import DeveloperGrid from "@/components/landing/about/DeveloperGrid";

// Utilities
import { getServerSideUserRole } from "@/utils/getServerSideUserRole";

interface Staff {
    firstName: string;
    lastName: string;
    middleInitial: string | null;
}

interface Props {
    mentorCount: number;
    bookingCount: number;
    subjectCount: number;
    staff: Staff | null;
    images: Record<string, string | null>;
}

const FAQS: FaqData[] = [
    {
        question: 'Who can avail of LRC services?',
        answer: 'All currently enrolled UPB undergraduate students are eligible to book a session with the LRC.',
    },
    {
        question: 'How do I book a session?',
        answer: 'Log in to your account, go to the Bookings page, select a session type, choose an available mentor,and pick your preferred date and time slot.',
    },
    {
        question: 'Is there a fee for LRC sessions?',
        answer: 'No. All LRC peer mentoring sessions are completely free for UPB students.',
    },
];

export default function AboutPage({ mentorCount, bookingCount, subjectCount, staff, images }: Props) {

    const stats = [
        { value: mentorCount, label: 'Mentors' },
        { value: bookingCount, label: 'Sessions Held' },
        { value: subjectCount, label: 'Subject Covered' },
    ];

    const lrcHead = staff
        ? `${staff.firstName} ${staff.middleInitial ? staff.middleInitial + '. ' : ''}${staff.lastName}`
        : 'LRC Coordinator'

    return (
        <>
            {/* Header and Description */}
            <HeadDesc />

            {/* Image */}
            <div className="w-full h-64 md:h-96 bg-white-dark border-b border-white-border overflow-hidden animate-fade-up [animation-delay:100ms]">
                <img
                    src={images['about_banner'] ?? ''}
                    alt="LRC PeerConnect"
                    className="w-full h-full object-cover brightness-125"
                />
            </div>

            {/* Stats Display */}
            <StatsDisplay stats={stats} />

            {/* Mission and Quote */}
            <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <Mission imageURL={images['lrc_mission']} />
                <Quote author={lrcHead} />

                {/* How it works */}
                <HowItWorks />

                {/* Who are mentors */}
                <MentorQualities imageURL={images['mentors_staff']} />

                {/* FAQs */}
                <section className="py-10 border-b border-white-border animate-fade-up [animation-delay:300ms]">
                    <div className="text-up-green text-xs font-bold tracking-widest uppercase mb-4">
                        Common Questions
                    </div>

                    <FaqAccordion faqs={FAQS} />

                    <div className="mt-3 text-right">
                        <Link href="/services#faqs" className="text-xs text-up-maroon font-bold tracking-widest uppercase hover:underline">
                            See all FAQs →
                        </Link>
                    </div>
                </section>

                {/* Developers */}
                <DeveloperGrid />
            </div>
        </>
    );
}

// Database connection
export const getServerSideProps: GetServerSideProps = async (context) => {
    const supabase = createClient(context);

    const [
        userRole,
        { count: mentorCount },
        { count: bookingCount },
        { count: subjectCount },
        { data: staffData },
        { data: landingImages },
    ] = await Promise.all([
        getServerSideUserRole(context),
        supabase.from('mentor_profiles').select('*', { count: 'exact', head: true }).eq('is_active', true),
        supabase.from('bookings').select('*', { count: 'exact', head: true }),
        supabase.from('subjects').select('*', { count: 'exact', head: true }).eq('is_active', true),
        supabase.from('staff_profiles').select('firstName, lastName, middleInitial').eq('role', 'lrc_coordinator').single(),
        supabase.from('landing_images').select('*').order('id'),
    ]);

    const images = Object.fromEntries(
        (landingImages ?? []).map((image: LandingImages) => [image.slot_key, image.image_url])
    );

    return {
        props: {
            userRole,
            mentorCount: mentorCount ?? 0,
            bookingCount: bookingCount ?? 0,
            subjectCount: subjectCount ?? 0,
            staff: staffData ?? null,
            images,
        },
    };
};