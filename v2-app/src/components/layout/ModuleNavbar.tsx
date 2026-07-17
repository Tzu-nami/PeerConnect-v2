import { useState } from "react"
import { useRouter } from "next/router"
import Link from "next/link"
import Image from "next/image"

// Components
import HamburgerButton from "@/components/ui/HamburgerButton"

// Utilities
import { logoutUser } from "@/utils/supabase/auth"

// Hooks
import { useClickOutside } from "@/hooks/useClickOutside"

// Configs
import { moduleNavLinks } from "@/config/moduleNavLinks"

// Icons
import { IoChevronDownOutline } from "react-icons/io5"
import { FiLogOut } from "react-icons/fi"

interface ModuleNavbarProps {
    userName: string | null
    userFullName: string | null
    userEmail: string | null
    userAvatar: string | null
    userRole: string | null
}

export default function ModuleNavbar({ userName, userFullName, userEmail, userAvatar, userRole }: ModuleNavbarProps) {
    // Button states
    const [menuOpen, setMenuOpen] = useState(false)
    const menuRef = useClickOutside(menuOpen, () => setMenuOpen(false))
    const [dropdownOpen, setDropdownOpen] = useState(false)
    const dropdownRef = useClickOutside(dropdownOpen, () => setDropdownOpen(false))

    // Nav links
    const links = userRole ? moduleNavLinks[userRole] ?? [] : []

    // Logout
    const router = useRouter()
    const handleLogout = async () => {
        await logoutUser()
        await router.push('/')
    }

    return(
        <nav className="flex items-center justify-between h-[60px] md:h-[83px] px-7 bg-up-maroon sticky top-0 z-50">
            {/* Left Side */}
            <div className="flex items-center">
                {/* Hamburger button: mobile only */}
                <div ref={menuRef} className="flex gap-2 lg:hidden items-center">
                    <HamburgerButton open={menuOpen} onClick={() => setMenuOpen(!menuOpen)} />
                    <Link href="/" className="text-white font-semibold">LRC <span className="text-up-yellow">PeerConnect</span></Link>

                    {menuOpen && (
                        <div className="fixed top-[60px] md:top-[83px] left-0 right-0 z-40 bg-up-maroon border-t border-white/10">
                            <ul className="flex flex-col px-6 py-2 list-none">
                                {links.map((link) => (
                                    <li key={link.href}>
                                        <Link href={link.href} onClick={() => setMenuOpen(false)}
                                              className="flex items-center gap-3 py-3 text-white/75 hover:text-up-yellow-light border-b border-white/10 text-xs tracking-widest uppercase">
                                            {link.icon}
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                {/* Greeting: hidden on mobile */}
                <div className="hidden lg:block text-lg text-white">
                    Welcome, <span className="font-bold">{userName ?? '...'}</span>
                </div>
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-4">

                {/* Profile Dropdown */}
                <div className="relative" ref={dropdownRef}>
                    <button onClick={() => setDropdownOpen(!dropdownOpen)}
                            className="flex items-center gap-1 md:gap-2 px-1.5 md:px-2 py-1 bg-white/15 rounded-full hover:bg-red-800 transition border border-white/50 group cursor-pointer">
                        {userAvatar
                            ? <Image src={userAvatar} alt="Profile image" width={32} height={32}
                                     className="w-7 h-7 md:w-8 md:h-8 rounded-full object-cover shadow-sm border border-gray-100" />
                            : <div className="w-7 h-7 md:w-8 md:h-8 bg-red-900 text-white rounded-full flex items-center justify-center text-xs font-bold">
                                {userName?.slice(0, 2).toUpperCase()}
                            </div>
                        }
                        <IoChevronDownOutline className={`text-xs md:text-sm text-white/60 group-hover:text-white transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`}/>
                    </button>

                    {dropdownOpen && (
                        <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden">
                            {/* User Details*/}
                            <div className="px-4 py-5 border-b border-gray-200 bg-slate-50">
                                <p className="text-[11px] font-[650] text-gray-400 uppercase tracking-widest mb-3">Signed in as</p>
                                <p className="text-sm font-bold text-slate-800 truncate mb-1">{userFullName}</p>
                                <p className="text-xs text-slate-500 truncate">{userEmail}</p>
                            </div>

                            {/* Logout button */}
                            <button onClick={handleLogout} className="text-[13px] font-semibold flex items-center gap-[10px] px-4 py-3 w-full text-slate-600 hover:text-red-600 cursor-pointer">
                                <FiLogOut />
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    )
}