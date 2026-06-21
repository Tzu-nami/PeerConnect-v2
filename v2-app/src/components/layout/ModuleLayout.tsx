import ModuleNavbar from "@/components/layout/ModuleNavbar"
import ModuleSidebar from "@/components/layout/ModuleSidebar"

export default function ModuleLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen font-module">
            <ModuleSidebar />
            <div className="flex flex-col flex-1">
                <ModuleNavbar />
                <main className="flex-1 pt-[60px] md:pt-[83px]">
                    {children}
                </main>
            </div>
        </div>
    )
}