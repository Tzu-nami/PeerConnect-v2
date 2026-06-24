import { GetServerSideProps } from "next"

// Components
import StaffHeader from "@/components/landing/staff/StaffHeader"
import StaffGrid from "@/components/landing/staff/StaffGrid"

// Utilities
import { getServerSideUserRole } from "@/utils/getServerSideUserRole"
import { createClient } from "@/utils/supabase/server"

// Types
import type { StaffProfile } from "@/types/staff"

export const getServerSideProps: GetServerSideProps = async (context) => {
    const supabase = createClient(context)

    const [userRole, { data: staffList }] = await Promise.all([
        getServerSideUserRole(context),
        supabase.from('staff_profiles').select('*')
    ])

    return {
        props: { userRole, staffList: staffList ?? [] }
    }
}

export default function Staff({ staffList }: { staffList: StaffProfile[] }) {
    return (
        <>
            <StaffHeader />
            <StaffGrid staffList={staffList} />
        </>
    )
}