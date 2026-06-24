import type { GetServerSideProps } from "next"

// Components
import ServicesDetail from "@/components/landing/services/ServicesDetail"

// Utilities
import { getServerSideUserRole } from "@/utils/getServerSideUserRole"

export const getServerSideProps: GetServerSideProps = async (context) => {
    const userRole = await getServerSideUserRole(context)

    return {
        props: { userRole }
    }
}

export default function ServicesPage() {
    return (
        <ServicesDetail />
    )
}