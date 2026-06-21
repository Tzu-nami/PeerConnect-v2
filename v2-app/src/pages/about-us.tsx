import type { GetServerSideProps } from "next";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";

import HeadDesc from "@/components/landing/about/HeadDesc";
import StatsDisplay from "@/components/landing/about/StatsDisplay";
import Mission from "@/components/landing/about/Mission";
import Quote from "@/components/landing/about/Quote";
import HowItWorks from "@/components/landing/about/HowItWorks";
import MentorQualities from "@/components/landing/about/MentorQualities";
import FaqAccordion, { FaqData } from "@/components/landing/FaqAccordion";
import DeveloperGrid from "@/components/landing/about/DeveloperGrid";

import LandingLayout from "@/components/layout/LandingLayout";

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

export default function AboutPage({ mentorCount, bookingCount, subjectCount, staff }: Props) {

    // Load the values from the database
    const stats = [
        { value: mentorCount, label: 'Mentors' },
        { value: bookingCount, label: 'Sessions Held' },
        { value: subjectCount, label: 'Subjects Covered' },
    ];

    const lrcHead = staff ? `${staff.firstName} ${staff.middleInitial ? staff.middleInitial + '. ' : ''}${staff.lastName}` :
    'LRC Head';

    return (
        <LandingLayout>
            <HeadDesc />
            <div className="w-full h-64 md:h-96 bg-cream-dark border-b border-cream-border overflow-hidden animate-fade-up [animation-delay:100ms]">
                <img 
                    src="null" 
                    alt="LRC PeerConnect"
                    className="w-full h-full object-cover brightness-125" 
                />
            </div>
            <StatsDisplay stats={stats} />
            <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <Mission />
                <Quote author={lrcHead}/>
                <HowItWorks />
                <MentorQualities />
                <section className="py-10 border-b border-cream-border animate-fade-up [animation-delay:300ms]">
                    <div className="text-up-yellow text-xs font-bold tracking-widest uppercase mb-4">
                        Common Questions
                    </div>
                    <FaqAccordion faqs={FAQS} />
                    <div className="mt-3 text-right">
                        <Link href="/services#faqs" className="text-xs text-up-maroon font-bold tracking-widest uppercase hover:underline">
                            See all FAQs →
                        </Link>
                    </div>
                </section>
                <DeveloperGrid />
            </div>
        </LandingLayout>
    );
}

// Database connection
export const getServerSideProps: GetServerSideProps = async (context) => {
    const supabase = createClient(context);

    const [
        { count: mentorCount },
        { count: bookingCount },
        { count: subjectCount },
        { data: staffData },
    ] = await Promise.all([
        supabase.from('mentor_profiles').select('*', { count: 'exact', head: true }),
        supabase.from('bookings').select('*', { count: 'exact', head: true }),
        supabase.from('subjects').select('*', { count: 'exact', head: true }),
        supabase.from('staff_profiles').select('firstName, lastName, middleInitial').eq('role', 'LRC Head').single(),
    ]);

    return {
        props: {
        mentorCount: mentorCount ?? 0,
        bookingCount: bookingCount ?? 0,
        subjectCount: subjectCount ?? 0,
        staff: staffData ?? null,
        },
    };
};