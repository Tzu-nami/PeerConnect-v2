import { createClient } from "@/utils/supabase/client";
import type { User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

// Sections
import LandingLayout from "@/components/layout/LandingLayout";
import HeroSection from "@/components/landing/HeroSection";
import ServicesSection from "@/components/landing/ServicesSection";
import HowItWorks from "@/components/landing/HowItWorks";
import ActivitiesSection from "@/components/landing/ActivitiesSection";

export default function Home() {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const supabase = createClient();
        supabase.auth.getUser().then((result) => {
            setUser(result.data.user);
        });
    }, []);

    const isLoggedIn = !!user;
    const userRole = user?.user_metadata?.role;
    const shouldShowBookNow = userRole !== 'admin';
    const bookURL = '/book';
    const dashboardURL = `/${userRole}/dashboard`;
    const historyURL = `/${userRole}/history`;


    return (
        <LandingLayout>
            <HeroSection shouldShowBookNow={shouldShowBookNow} bookURL={bookURL} />
            <ServicesSection />
            <HowItWorks bookURL={bookURL} dashboardURL={dashboardURL} historyURL={historyURL}/>
            <ActivitiesSection />
        </LandingLayout>
    );
}