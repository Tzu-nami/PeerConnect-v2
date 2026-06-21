import type { GetServerSideProps } from "next"

// Components
import LandingLayout from "@/components/layout/LandingLayout"
import ContactSection from "@/components/contact/ContactSection"

// Utilities
import { getServerSideUserRole } from "@/utils/getServerSideUserRole"

export const getServerSideProps: GetServerSideProps = async (context) => {
    const userRole = await getServerSideUserRole(context)

    return {
        props: { userRole }
    }
}

export default function ContactUsPage({ userRole }: { userRole: string | null }) {
    return (
        <LandingLayout userRole={userRole}>
            <ContactSection />
        </LandingLayout>
    )
}