import { useEffect, useState } from "react"
import { createClient } from "@/utils/supabase/client"
import { useClickOutside } from "@/hooks/useClickOutside"
import { logoutUser } from "@/utils/supabase/auth"
import { useRouter } from "next/router"
import Link from "next/link"
import Image from "next/image"

// Components
import HamburgerButton from "@/components/ui/HamburgerButton"

// Icons
import { IoNotificationsSharp } from "react-icons/io5"
import { IoChevronDownOutline } from "react-icons/io5"
import { FiLogOut } from "react-icons/fi"
import { MdDashboard } from "react-icons/md"
import { FaChalkboardTeacher } from "react-icons/fa"
import { FaCalendarCheck } from "react-icons/fa6"
import { FaUserTie } from "react-icons/fa";
import { FaClockRotateLeft } from "react-icons/fa6";
import { FaClock } from "react-icons/fa6";
import { FaComments } from "react-icons/fa";
import { FaBookOpen } from "react-icons/fa";

export default function ModuleNavbar() {
    // User info
    const [userName, setUserName] = useState<string | null>(null)
    const [userFullName, setUserFullName] = useState<string | null>(null)
    const [userEmail, setUserEmail] = useState<string | null>(null)
    const [userAvatar, setUserAvatar] = useState<string | null>(null)
    const [userRole, setUserRole] = useState<string | null>(null)

    // Button states
    const [menuOpen, setMenuOpen] = useState(false)
    const menuRef = useClickOutside(menuOpen, () => setMenuOpen(false))
    const [dropdownOpen, setDropdownOpen] = useState(false)
    const dropdownRef = useClickOutside(dropdownOpen, () => setDropdownOpen(false))

    // Logout
    const router = useRouter()
    const handleLogout = async () => {
        await logoutUser()
        await router.push('/')
    }

    // Nav links
    const navLinks: Record<string, { href: string; icon: React.ReactNode; label: string }[]> = {
        admin: [
            { href: '/admin/dashboard',   icon: <MdDashboard />,            label: 'Dashboard' },
            { href: '/admin/mentors',     icon: <FaChalkboardTeacher />,    label: 'Mentor Management' },
            { href: '/admin/staff',       icon: <FaUserTie />,              label: 'Staff Management' },
            { href: '/admin/courses',     icon: <FaBookOpen />,             label: 'Course Management' },
            { href: '/admin/sessions',    icon: <FaCalendarCheck />,        label: 'Session Management' },
            { href: '/admin/feedbacks',   icon: <FaComments />,             label: 'Student Feedback' },
        ],
        mentor: [
            { href: '/mentor/dashboard',  icon: <MdDashboard />,            label: 'Dashboard' },
            { href: '/mentor/bookings',   icon: <FaCalendarCheck />,        label: 'Booking Form' },
            { href: '/mentor/history',    icon: <FaClockRotateLeft />,      label: 'Booking History' },
            { href: '/mentor/mentors',    icon: <FaChalkboardTeacher />,    label: 'Mentors' },
            { href: '/mentor/sessions',   icon: <FaClock />,                label: 'Tutorial Sessions' },
            { href: '/mentor/feedbacks',  icon: <FaComments />,             label: 'Student Feedbacks' },
        ],
        student: [
            { href: '/student/dashboard', icon: <MdDashboard />,            label: 'Dashboard' },
            { href: '/student/bookings',  icon: <FaCalendarCheck />,        label: 'Booking Form' },
            { href: '/student/history',   icon: <FaClockRotateLeft />,      label: 'Booking History' },
            { href: '/student/mentors',   icon: <FaChalkboardTeacher />,    label: 'Mentors' },
        ],
    }
    const links = userRole ? navLinks[userRole] ?? [] : []

    useEffect(() => {
        const supabase = createClient()
        supabase.auth.getUser().then(async (result) => {
            const user = result.data.user
            if(!user) return

            // Fetch profile data
            const result2 = await supabase.from('user_profiles').select('firstName, middleInitial, lastName, email, avatar, role').eq('id', user.id).single()
            const profile = result2.data
            const mi = profile?.middleInitial

            // Set state
            setUserName(profile?.firstName ?? null)
            setUserFullName(`${profile?.firstName} ${mi ? mi + '. ' : ''}${profile?.lastName}`)
            setUserEmail(profile?.email ?? null)
            setUserAvatar(profile?.avatar ?? null)
            setUserRole(profile?.role ?? null)
        })
    }, []);

    return(
        <nav className="flex fixed top-0 left-0 right-0 z-50 items-center justify-between h-[60px] md:h-[83px] px-7 bg-up-maroon-dark">
            {/* Left Side */}
            <div className="flex items-center">
                {/* Hamburger button: mobile only */}
                <div ref={menuRef} className="flex gap-2 lg:hidden items-center">
                    <HamburgerButton open={menuOpen} onClick={() => setMenuOpen(!menuOpen)} />
                    <Link href="/" className="text-white font-semibold">LRC <span className="text-up-yellow">PeerConnect</span></Link>

                    {menuOpen && (
                        <div className="fixed top-[60px] md:top-[83px] left-0 right-0 z-40 bg-up-maroon-dark border-t border-cream/10">
                            <ul className="flex flex-col px-6 py-2 list-none">
                                {links.map((link) => (
                                    <li key={link.href}>
                                        <Link href={link.href} onClick={() => setMenuOpen(false)}
                                              className="flex items-center gap-3 py-3 text-cream/75 hover:text-up-yellow-light border-b border-cream/10 text-xs tracking-widest uppercase">
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
                {/* Notifications */}
                <div className="text-white text-xl md:text-2xl font-bold">
                    <IoNotificationsSharp />
                </div>

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
                                <span>Logout</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    )
}