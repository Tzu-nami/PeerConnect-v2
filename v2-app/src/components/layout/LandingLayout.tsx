import LandingNavbar from "@/components/layout/LandingNavbar";
import Footer from "@/components/layout/Footer";

export default function LandingLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-col min-h-screen">
            <LandingNavbar/>
            <main className="flex-1">
                {children}
            </main>
            <Footer/>
        </div>
    );
};