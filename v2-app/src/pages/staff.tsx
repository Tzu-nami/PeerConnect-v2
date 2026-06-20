import { useEffect, useState} from "react"
import { createClient} from "@/utils/supabase/client"
import type {StaffProfile} from "@/types/staff"
import LandingLayout from "@/components/layout/LandingLayout"
import StaffHeader from "@/components/staff/StaffHeader"
import StaffGrid from "@/components/staff/StaffGrid";

export default function Staff() {
    const [staffList, setStaffList] = useState<StaffProfile[]>([])
    const [loading, setLoading] = useState(true)
    const roleLabels: Record<string, string> = {
        lrc_head: 'LRC Head',
        lrc_assistant: 'LRC Assistant',
        student_assistant: 'Student Assistant',
    }

    useEffect(() => {
        const supabase = createClient()
        supabase.from('staff_profiles').select('*').then((result) => {
            setStaffList(result.data ?? [])
            setLoading(false)
        })
    }, [])

    return(
        <LandingLayout>
            <StaffHeader />
            <StaffGrid loading={loading} staffList={staffList} roleLabels={roleLabels} />
        </LandingLayout>
    )
}