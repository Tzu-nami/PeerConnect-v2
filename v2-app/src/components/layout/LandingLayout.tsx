import LandingNavbar from "@/components/layout/LandingNavbar";
import Footer from "@/components/layout/Footer";

export default function LandingLayout({ children }: { children: React.ReactNode }) {
    return (
        <div>
            <LandingNavbar/>
            <main>
                {children}
            </main>
            <Footer/>
        </div>
    );
};