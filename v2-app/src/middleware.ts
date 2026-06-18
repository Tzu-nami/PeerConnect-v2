import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

const roleRoutes: Record<string, string> = {
    '/student': 'student',
    '/mentor': 'mentor',
    '/admin': 'admin',
}

export async function middleware(request: NextRequest) {
    // Initialize response so cookies can be modifies
    let supabaseResponse = NextResponse.next({ request })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll: () => request.cookies.getAll(),
                setAll: (cookiesToSet) => {
                    // Update the request cookies then set cookies
                    cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
                    supabaseResponse = NextResponse.next({ request })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    // Get validation token cookie
    const { data: { user } } = await supabase.auth.getUser()
    const path = request.nextUrl.pathname
    const matchedPrefix = Object.keys(roleRoutes).find((p) => path.startsWith(p))

    // Prevent logged in users access to login page
    if (user && path.startsWith('/login')) {
        const userRole = user.user_metadata?.role || 'student'
        return NextResponse.redirect(new URL(`/${userRole}/dashboard`, request.url))
    }

    // Redirect unauthenticated users
    if (matchedPrefix) {
        if (!user) {
            return NextResponse.redirect(new URL('/login', request.url))
        }

        const userRole = user.user_metadata?.role

        if (userRole !== roleRoutes[matchedPrefix]) {
            // Redirect based on role route
            const redirectPath = userRole ? `/${userRole}/dashboard` : '/login'
            return NextResponse.redirect(new URL(redirectPath, request.url))
        }
    }

    return supabaseResponse
}

// Allow access to all tabs based on user roles
export const config = {
    matcher: ['/login', '/student/:path*', '/mentor/:path*', '/admin/:path*'],
}