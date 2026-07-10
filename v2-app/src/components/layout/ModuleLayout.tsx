import { useEffect, useState } from "react"

// Components
import ModuleNavbar from "@/components/layout/ModuleNavbar"
import ModuleSidebar from "@/components/layout/ModuleSidebar"

// Constants
import {TERM_LABELS} from "@/constants/termLabels";

// Utilities
import { createClient } from "@/utils/supabase/client"

export default function ModuleLayout({ children }: { children: React.ReactNode }) {
    // User info
    const [userName, setUserName] = useState<string | null>(null)
    const [userFullName, setUserFullName] = useState<string | null>(null)
    const [userEmail, setUserEmail] = useState<string | null>(null)
    const [userAvatar, setUserAvatar] = useState<string | null>(null)
    const [userRole, setUserRole] = useState<string | null>(null)
    const [currentSemesterLabel, setCurrentSemesterLabel] = useState<string | null>(null)

    // Sidebar state
    const [collapsed, setCollapsed] = useState(false)

    useEffect(() => {
        const supabase = createClient()

        supabase.auth.getUser().then(async (result) => {
            const user = result.data.user
            if (!user) return

            const [profileResult, semesterResult] = await Promise.all([
                supabase.from('user_profiles').select('firstName, middleInitial, lastName, email, avatar, role').eq('id', user.id).single(),
                supabase.from('semesters').select('term, ay_start').eq('is_current', true).single()
            ])

            const profile = profileResult.data
            const mi = profile?.middleInitial

            setUserName(profile?.firstName ?? null)
            setUserFullName(`${profile?.firstName} ${mi ? mi + '. ' : ''}${profile?.lastName}`)
            setUserEmail(profile?.email ?? null)
            setUserAvatar(profile?.avatar ?? null)
            setUserRole(profile?.role ?? null)

            const semester = semesterResult.data
            if (semester) {
                setCurrentSemesterLabel(`${TERM_LABELS[semester.term]} AY ${semester.ay_start} - ${semester.ay_start + 1}`)
            }
        })
    }, [])

    return (
        <div className="flex min-h-screen font-module">
            <ModuleSidebar userRole={userRole} collapsed={collapsed} setCollapsed={setCollapsed} currentSemesterLabel={currentSemesterLabel}  />
            <div className="flex flex-col flex-1">
                <ModuleNavbar userName={userName} userFullName={userFullName} userEmail={userEmail} userRole={userRole} userAvatar={userAvatar} />
                <main className="flex-1 px-7 py-5">
                    {children}
                </main>
            </div>
        </div>
    )
}