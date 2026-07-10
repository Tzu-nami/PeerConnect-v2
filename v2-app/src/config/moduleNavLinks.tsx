import { MdDashboard } from "react-icons/md"
import { FaChalkboardTeacher, FaComments, FaImages  } from "react-icons/fa"
import { FaCalendarCheck, FaClockRotateLeft, FaClock, FaUserTie, FaBookOpen, FaGear  } from "react-icons/fa6"

interface NavLink {
    href: string
    icon: React.ReactNode
    label: string
    section?: string
}

export const moduleNavLinks: Record<string, NavLink[]> = {
    admin: [
        { href: '/admin/dashboard', icon: <MdDashboard />,         label: 'Dashboard' },
        { href: '/admin/mentors',   icon: <FaChalkboardTeacher />, label: 'Mentor Management',      section: 'Content Management' },
        { href: '/admin/staff',     icon: <FaUserTie />,           label: 'Staff Management',       section: 'Content Management' },
        { href: '/admin/courses',   icon: <FaBookOpen />,          label: 'Course Management',      section: 'Content Management' },
        { href: '/admin/sessions',  icon: <FaCalendarCheck />,     label: 'Session Management',     section: 'Content Management' },
        { href: '/admin/images',    icon: <FaImages />,            label: 'Image Management',       section: 'Content Management' },
        { href: '/admin/feedbacks', icon: <FaComments />,          label: 'Student Feedbacks',      section: 'Feedback' },
        { href: '/admin/settings',  icon: <FaGear />,              label: 'Settings',               section: 'System' },
    ],
    mentor: [
        { href: '/mentor/dashboard', icon: <MdDashboard />,         label: 'Dashboard' },
        { href: '/mentor/sessions',  icon: <FaClock />,             label: 'Tutorial Sessions',     section: 'As Mentor' },
        { href: '/mentor/feedbacks', icon: <FaComments />,          label: 'Student Feedbacks',     section: 'As Mentor' },
        { href: '/mentor/bookings',  icon: <FaCalendarCheck />,     label: 'Booking Form',          section: 'As Student' },
        { href: '/mentor/history',   icon: <FaClockRotateLeft />,   label: 'Booking History',       section: 'As Student' },
        { href: '/mentor/mentors',   icon: <FaChalkboardTeacher />, label: 'Mentors',               section: 'As Student' },
    ],
    student: [
        { href: '/student/dashboard', icon: <MdDashboard />,         label: 'Dashboard' },
        { href: '/student/bookings',  icon: <FaCalendarCheck />,     label: 'Booking Form',         section: 'Bookings' },
        { href: '/student/history',   icon: <FaClockRotateLeft />,   label: 'Booking History',      section: 'Bookings' },
        { href: '/student/mentors',   icon: <FaChalkboardTeacher />, label: 'Mentors',              section: 'Bookings' },
    ],
}