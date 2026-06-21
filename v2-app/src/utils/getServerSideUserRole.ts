import { createClient } from "@/utils/supabase/server"
import { GetServerSidePropsContext } from "next"

export async function getServerSideUserRole(context: GetServerSidePropsContext) {
    const supabase = createClient(context)
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return null

    const { data: profile } = await supabase
        .from('user_profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    console.log('userRole:', profile?.role)
    return profile?.role ?? null
}