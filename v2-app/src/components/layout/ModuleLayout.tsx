import { useEffect, useState } from "react"

// Components
import ModuleNavbar from "@/components/layout/ModuleNavbar"
import ModuleSidebar from "@/components/layout/ModuleSidebar"
import { createClient } from "@/utils/supabase/client"

export default function ModuleLayout({ children }: { children: React.ReactNode }) {
    // User info
    const [userName, setUserName] = useState<string | null>(null)
    const [userFullName, setUserFullName] = useState<string | null>(null)
    const [userEmail, setUserEmail] = useState<string | null>(null)
    const [userAvatar, setUserAvatar] = useState<string | null>(null)
    const [userRole, setUserRole] = useState<string | null>(null)

    // Sidebar state
    const [collapsed, setCollapsed] = useState(false)


    useEffect(() => {
        const supabase = createClient()
        supabase.auth.getUser().then(async (result) => {
            const user = result.data.user
            if(!user) return

            // Fetch profile data
            const result2 = await supabase.from('user_profiles').select('firstName, middleInitial, lastName, email, avatar, role').eq('id', user.id).single()
            const profile = result2.data
            const mi = profile?.middleInitial

            // Set state
            setUserName(profile?.firstName ?? null)
            setUserFullName(`${profile?.firstName} ${mi ? mi + '. ' : ''}${profile?.lastName}`)
            setUserEmail(profile?.email ?? null)
            setUserAvatar(profile?.avatar ?? null)
            setUserRole(profile?.role ?? null)
        })
    }, [])

    return (
        <div className="flex min-h-screen font-module">
            <ModuleSidebar userRole={userRole} collapsed={collapsed} setCollapsed={setCollapsed} />
            <div className="flex flex-col flex-1">
                <ModuleNavbar userName={userName} userFullName={userFullName} userEmail={userEmail} userRole={userRole} userAvatar={userAvatar} />
                <main className="flex-1 px-7 py-5">
                    {children}
                </main>
            </div>
        </div>
    )
}