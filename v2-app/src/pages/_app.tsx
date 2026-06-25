import "@/styles/globals.css"
import { AppProps } from "next/app"
import { Toaster } from "sonner"

// Components
import ModuleLayout from "@/components/layout/ModuleLayout"
import LandingLayout from "@/components/layout/LandingLayout"

// Routes
const LANDING_ROUTES = ['/', '/mentors', '/staff', '/services', '/about-us', '/contact-us']
const MODULE_ROUTES = ['/student/', '/mentor/', '/admin/']

export default function App({ Component, pageProps, router }: AppProps) {
    const isModuleRoute = MODULE_ROUTES.some(route => router.pathname.startsWith(route))
    const isLandingRoute = LANDING_ROUTES.includes(router.pathname)

    return (
        <>
            <Toaster position="top-right" richColors />
            {isModuleRoute && (
                <ModuleLayout>
                    <Component {...pageProps} />
                </ModuleLayout>
            )}
            {isLandingRoute && (
                <LandingLayout userRole={pageProps.userRole ?? null}>
                    <Component {...pageProps} />
                </LandingLayout>
            )}
            {!isModuleRoute && !isLandingRoute && (
                <Component {...pageProps} />
            )}
        </>
    )
}