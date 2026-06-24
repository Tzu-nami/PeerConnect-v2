import "@/styles/globals.css";
import { AppProps } from "next/app";
import ModuleLayout from "@/components/layout/ModuleLayout";
import LandingLayout from "@/components/layout/LandingLayout";

const LANDING_ROUTES = ['/', '/mentors', '/staff', '/services', '/about-us', '/contact-us']
const MODULE_ROUTES = ['/student/', '/mentor/', '/admin/']

export default function App({ Component, pageProps, router }: AppProps) {
    const isModuleRoute = MODULE_ROUTES.some(route => router.pathname.startsWith(route))
    const isLandingRoute = LANDING_ROUTES.includes(router.pathname)

    if(isModuleRoute) return(
        <ModuleLayout>
            <Component {...pageProps} />
        </ModuleLayout>
    )
    
    if(isLandingRoute) return(
        <LandingLayout userRole={pageProps.userRole ?? null}>
            <Component {...pageProps} />
        </LandingLayout>
    )

    return <Component {...pageProps} />
}