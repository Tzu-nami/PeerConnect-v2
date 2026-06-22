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
        const { error } = await supabase.auth.exchangeCodeForSession(String(code));

        if (!error) {
            res.redirect('/');
            return;
        }
    }

    res.redirect('/login?error=Google Authentication Failed');
}