import { createServerClient, serializeCookieHeader } from "@supabase/ssr";
import { GetServerSidePropsContext } from "next";
import type { NextApiRequest, NextApiResponse } from "next";

type ServerClientContext =
    | GetServerSidePropsContext
    | { req: NextApiRequest; res: NextApiResponse };

export function createClient(context: ServerClientContext) {
    return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return Object.keys(context.req.cookies).map((name) => ({
                        name,
                        value: context.req.cookies[name] || '',
                    }));
                },
                setAll(cookiesToSet) {
                    context.res.setHeader(
                        'Set-Cookie',
                        cookiesToSet.map(({ name, value, options }) =>
                            serializeCookieHeader(name, value, options)
                        )
                    );
                }
            }
        }
    )
}