import "@/styles/globals.css"
import { AppProps } from "next/app"
import { Toaster } from "sonner"
import { useState, useEffect } from "react"

// Components
import ModuleLayout from "@/components/layout/ModuleLayout"
import LandingLayout from "@/components/layout/LandingLayout"

// Routes
const LANDING_ROUTES = ['/', '/mentors', '/staff', '/services', '/about-us', '/contact-us']
const MODULE_ROUTES = ['/student/', '/mentor/', '/admin/']

export default function App({ Component, pageProps, router }: AppProps) {
    const [isPageLoading, setIsPageLoading] = useState(false)
    useEffect(() => {
        const handleStart = (url: string) => {
            if (url !== router.asPath) {
                setIsPageLoading(true)
            }
        }
        const handleComplete = () => setIsPageLoading(false)

        router.events.on('routeChangeStart', handleStart)
        router.events.on('routeChangeComplete', handleComplete)
        router.events.on('routeChangeError', handleComplete)

        return () => {
            router.events.off('routeChangeStart', handleStart)
            router.events.off('routeChangeComplete', handleComplete)
            router.events.off('routeChangeError', handleComplete)
        }
    }, [router])
    const isModuleRoute = MODULE_ROUTES.some(route => router.pathname.startsWith(route))
    const isLandingRoute = LANDING_ROUTES.includes(router.pathname)

    return (
        <>
            <Toaster position="top-right" richColors />
            {isPageLoading && (
                <div className="fixed inset-0 z-[9999] backdrop-blur-sm flex items-center justify-center">
                    <div className="loader"></div>
                </div>
            )}
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