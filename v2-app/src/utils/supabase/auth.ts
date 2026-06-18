import { createClient } from "./client";

export async function logoutUser() {
    const supabase = createClient();

    // Remove session cookies
    const { error } = await supabase.auth.signOut();

    return true;
}
