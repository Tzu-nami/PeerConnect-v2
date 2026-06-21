import { GetServerSideProps } from "next"

// Components
import LandingLayout from "@/components/layout/LandingLayout"
import StaffHeader from "@/components/staff/StaffHeader"
import StaffGrid from "@/components/staff/StaffGrid"

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

export default function Staff({ staffList, userRole }: { staffList: StaffProfile[], userRole: string | null }) {
    const roleLabels: Record<string, string> = {
        lrc_head: 'LRC Head',
        lrc_assistant: 'LRC Assistant',
        student_assistant: 'Student Assistant',
    }

    return (
        <LandingLayout userRole={userRole}>
            <StaffHeader />
            <StaffGrid staffList={staffList} roleLabels={roleLabels} />
        </LandingLayout>
    )
}