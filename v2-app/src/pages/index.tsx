import { GetServerSideProps } from "next"

// Components
import HeroSection from "@/components/landing/home/HeroSection"
import ServicesSection from "@/components/landing/home/ServicesSection"
import HowItWorks from "@/components/landing/home/HowItWorks"
import ActivitiesSection from "@/components/landing/home/ActivitiesSection"

// Utilities
import { getServerSideUserRole } from "@/utils/getServerSideUserRole"
import {createClient} from "@/utils/supabase/server";
import {LandingImages} from "@/types/landingImages";

// Types
type UserRole = "student" | "mentor" | "admin" | null

const ROLE_URLS: Record<Exclude<UserRole, null>, { book: string; dashboard: string; history: string }> = {
    student: { book: "/student/bookings", dashboard: "/student/dashboard", history: "/student/history" },
    mentor:  { book: "/mentor/bookings",  dashboard: "/mentor/dashboard",  history: "/mentor/history"  },
    admin:   { book: "/login",            dashboard: "/admin/dashboard",   history: "/login"           },
}

const DEFAULT_URLS = { book: "/login", dashboard: "/login", history: "/login" }

interface HomeProps {
    userRole: UserRole
    landingImages: LandingImages[]
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const userRole = await getServerSideUserRole(context)
    const supabase = createClient(context)

    // Fetch uploaded landing page images
    const { data: landingImages } = await supabase
        .from('landing_images')
        .select('*')
        .order('id')

    return {
        props: {
            userRole,
            landingImages: landingImages ?? []
        }
    }
}

export default function Home({ userRole, landingImages }: HomeProps) {
    const urls = userRole ? ROLE_URLS[userRole] : DEFAULT_URLS
    const imageUrlMap = Object.fromEntries(landingImages.map((image) => [image.slot_key, image.image_url]))

    const bookURL = !userRole
        ? `/login?redirectTo=/bookings`
        : userRole === "admin"
            ? urls.dashboard
            : urls.book

    return (
        <>
            <HeroSection shouldShowBookNow={userRole !== "admin"} bookURL={bookURL} imageURL={imageUrlMap['hero_bg']} />
            <ServicesSection imageURL={imageUrlMap} />
            <HowItWorks bookURL={bookURL} dashboardURL={urls.dashboard} historyURL={urls.history} />
            <ActivitiesSection imageURL={imageUrlMap} />
        </>
    )
}