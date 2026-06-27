import { NextApiRequest, NextApiResponse } from "next";
import { createServerClient, serializeCookieHeader } from "@supabase/ssr";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { code } = req.query;

    if (code) {
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    getAll() {
                        return Object.keys(req.cookies).map((name) => ({ name, value: req.cookies[name] || ''}))
                    },
                    setAll(cookiesToSet) {
                        res.setHeader(
                            'Set-Cookie',
                            cookiesToSet.map(({ name, value, options }) => 
                            serializeCookieHeader(name, value, options)
                            )
                        )
                    },
                },
            }
        );

        // Get session cookie code
        const { data, error } = await supabase.auth.exchangeCodeForSession(String(code));

        if (!error && data?.user) {
            const user = data.user;
            const userRole = data.user.user_metadata?.role || 'student';

            // Get google avatar
            const googleAvatarUrl = user.user_metadata?.avatar_url || user.user_metadata?.picture;

            if (googleAvatarUrl) {
                // Check avatar column
                const { data: profile } = await supabase
                    .from('user_profiles')
                    .select('avatar')
                    .eq('id', user.id)
                    .single();

                const currentAvatar = profile?.avatar;

                // Check if custom avatar uploaded stored in supabase bucket
                const hasCustomPhoto = currentAvatar && currentAvatar.includes('supabase.co');
                
                // Overwrite avatar if not custom uploaded avatar
                if (!hasCustomPhoto && currentAvatar !== googleAvatarUrl) {
                    await supabase
                        .from('user_profiles')
                        .update({ avatar: googleAvatarUrl })
                        .eq('id', user.id);
                }
            }

            res.redirect(`/${userRole}/dashboard`);
            return;
        }
    }

    res.redirect('/login?error=Google Authentication Failed');
}