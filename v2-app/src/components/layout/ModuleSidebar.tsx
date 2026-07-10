import Link from "next/link"
import { useRouter } from "next/router"

// Utilities
import { logoutUser } from "@/utils/supabase/auth"

// Configs
import { moduleNavLinks } from "@/config/moduleNavLinks"

// Icons
import { FaGraduationCap } from "react-icons/fa6"
import {FiLogOut} from "react-icons/fi";
import { MdChevronLeft } from "react-icons/md";

interface ModuleSidebarProps {
    userRole: string | null
    collapsed: boolean
    setCollapsed: React.Dispatch<React.SetStateAction<boolean>>
    currentSemesterLabel: string | null
}

export default function ModuleSidebar({ userRole, collapsed, setCollapsed, currentSemesterLabel }: ModuleSidebarProps ) {
    // Nav links
    const links = userRole ? moduleNavLinks[userRole] ?? [] : []

    // Logout
    const router = useRouter()
    const handleLogout = async () => {
        await logoutUser()
        await router.push('/')
    }

    return (
        <aside className={`hidden lg:flex lg:flex-col shrink-0 bg-sidebar-green text-white h-screen sticky top-0 transition-all duration-300
                    ${collapsed ? 'w-[80px]' : 'w-[270px]'}`}>
            {/* Logo */}
            <div>
                <Link href='/' className="flex items-center gap-3 h-[60px] md:h-[83px] px-7">
                    <FaGraduationCap className="text-3xl shrink-0"/>
                    <div className="flex flex-col overflow-hidden">
                        <div className={`text-xl font-bold whitespace-nowrap transition-all duration-300
                ${collapsed ? 'opacity-0 w-0' : 'opacity-100'}`}>
                            LRC <span className="text-up-yellow">PeerConnect</span>
                        </div>

                        {/* Current semester */}
                        {currentSemesterLabel && (
                            <div className={`text-xs text-white/50 whitespace-nowrap transition-all duration-300
                    ${collapsed ? 'opacity-0 h-0' : 'opacity-100'}`}>
                                {currentSemesterLabel}
                            </div>
                        )}
                    </div>
                </Link>
            </div>

            <button onClick={() => setCollapsed(!collapsed)}
                    className="absolute -right-4 top-1/2 -translate-y-1/2 p-1 bg-up-maroon border-2 border-white rounded-full cursor-pointer shadow-md hover:brightness-125">
                <MdChevronLeft className={`text-xl transition-transform duration-300 ${collapsed ? 'rotate-180' : ''}`} />
            </button>

            <nav className="flex-grow">
                <ul className="flex flex-col">
                    {links.map((link, index) => {
                        const isActive = router.pathname === link.href
                        const prevSection = index > 0 ? links[index - 1].section : undefined
                        const showSectionHeader = link.section && link.section !== prevSection

                        return (
                            <li key={link.href}>
                                {showSectionHeader && (
                                    <div className="h-10 px-7 flex items-center">
                                        {collapsed ? (
                                            <div className="w-full border-t border-white/10" />
                                        ) : (
                                            <span className="text-xs font-semibold text-white/40 uppercase tracking-wide whitespace-nowrap overflow-hidden">
                                                {link.section}
                                            </span>
                                        )}
                                    </div>
                                )}
                                <Link href={link.href}
                                      className={`flex items-center gap-4 py-5 px-7 w-full transition-colors
                                            ${isActive ? 'text-up-maroon font-bold bg-white-surface' : 'text-white/70 hover:bg-white/10 hover:text-white'}`}>
                                    <div className="text-2xl w-6 shrink-0 flex items-center justify-center">{link.icon}</div>
                                    <span className={`whitespace-nowrap transition-all duration-300 overflow-hidden
                                            ${collapsed ? 'opacity-0 w-0' : 'opacity-100'}`}>
                                        {link.label}
                                    </span>
                                </Link>
                            </li>
                        )
                    })}
                </ul>
            </nav>

            {/* Logout */}
            <button onClick={handleLogout} className="flex items-center gap-4 mt-auto py-5 px-7 w-full transition-colors text-white/70 hover:bg-white/10 hover:text-white cursor-pointer border-t border-white/10">
                <div className="text-2xl w-6 shrink-0 flex items-center justify-center">
                    <FiLogOut />
                </div>
                <span className={`whitespace-nowrap transition-all duration-300 overflow-hidden
                        ${collapsed ? 'opacity-0 w-0' : 'opacity-100'}`}>
                    Logout
                </span>
            </button>
        </aside>
    )
}