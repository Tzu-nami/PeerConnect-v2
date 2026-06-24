import type { GetServerSideProps } from "next"

// Components
import ContactSection from "@/components/landing/contact/ContactSection"

// Utilities
import { getServerSideUserRole } from "@/utils/getServerSideUserRole"

export const getServerSideProps: GetServerSideProps = async (context) => {
    const userRole = await getServerSideUserRole(context)

    return {
        props: { userRole }
    }
}

export default function ContactUsPage() {
    return (
        <ContactSection />
    )
}