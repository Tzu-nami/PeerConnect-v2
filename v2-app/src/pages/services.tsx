import type { GetServerSideProps } from "next"

// Components
import LandingLayout from "@/components/layout/LandingLayout"
import ServicesDetail from "@/components/services/ServicesDetail"

// Utilities
import { getServerSideUserRole } from "@/utils/getServerSideUserRole"

export const getServerSideProps: GetServerSideProps = async (context) => {
    const userRole = await getServerSideUserRole(context)

    return {
        props: { userRole }
    }
}

export default function ServicesPage({ userRole }: { userRole: string | null }) {
    return (
        <LandingLayout userRole={userRole}>
            <ServicesDetail />
        </LandingLayout>
    )
}