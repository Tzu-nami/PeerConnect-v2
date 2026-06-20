import LandingNavbar from "@/components/layout/LandingNavbar";
import LandingFooter from "@/components/layout/LandingFooter";

export default function LandingLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-col min-h-screen">
            <LandingNavbar />
            <main className="flex-1 pt-[60px] md:pt-[83px]">
                {children}
            </main>
            <LandingFooter />
        </div>
    );
};