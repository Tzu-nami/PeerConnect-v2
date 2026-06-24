import { GetServerSideProps } from "next"

// Components
import HeroSection from "@/components/landing/home/HeroSection"
import ServicesSection from "@/components/landing/home/ServicesSection"
import HowItWorks from "@/components/landing/home/HowItWorks"
import ActivitiesSection from "@/components/landing/home/ActivitiesSection"

// Utilities
import { getServerSideUserRole } from "@/utils/getServerSideUserRole"

// Types
type UserRole = "student" | "mentor" | "admin" | null

const ROLE_URLS: Record<Exclude<UserRole, null>, { book: string; dashboard: string; history: string }> = {
    student: { book: "/student/bookings", dashboard: "/student/dashboard", history: "/student/history" },
    mentor:  { book: "/mentor/bookings",  dashboard: "/mentor/dashboard",  history: "/mentor/history"  },
    admin:   { book: "/login",            dashboard: "/admin/dashboard",   history: "/login"           },
}

const DEFAULT_URLS = { book: "/login", dashboard: "/login", history: "/login" }

export const getServerSideProps: GetServerSideProps = async (context) => {
    const userRole = await getServerSideUserRole(context)
    return { props: { userRole } }
}

export default function Home({ userRole }: { userRole: UserRole }) {
    const urls = userRole ? ROLE_URLS[userRole] : DEFAULT_URLS

    const bookURL = !userRole
        ? `/login?redirectTo=/bookings`
        : userRole === "admin"
            ? urls.dashboard
            : urls.book

    return (
        <>
            <HeroSection shouldShowBookNow={userRole !== "admin"} bookURL={bookURL} />
            <ServicesSection />
            <HowItWorks bookURL={bookURL} dashboardURL={urls.dashboard} historyURL={urls.history} />
            <ActivitiesSection />
        </>
    )
}