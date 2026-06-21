import { MdDashboard } from "react-icons/md"
import { FaChalkboardTeacher, FaComments } from "react-icons/fa"
import { FaCalendarCheck, FaClockRotateLeft, FaClock, FaUserTie, FaBookOpen } from "react-icons/fa6"

export const moduleNavLinks: Record<string, { href: string; icon: React.ReactNode; label: string }[]> = {
    admin: [
        { href: '/admin/dashboard',  icon: <MdDashboard />,         label: 'Dashboard' },
        { href: '/admin/mentors',    icon: <FaChalkboardTeacher />, label: 'Mentor Management' },
        { href: '/admin/staff',      icon: <FaUserTie />,           label: 'Staff Management' },
        { href: '/admin/courses',    icon: <FaBookOpen />,          label: 'Course Management' },
        { href: '/admin/sessions',   icon: <FaCalendarCheck />,     label: 'Session Management' },
        { href: '/admin/feedbacks',  icon: <FaComments />,          label: 'Student Feedbacks' },
    ],
    mentor: [
        { href: '/mentor/dashboard', icon: <MdDashboard />,         label: 'Dashboard' },
        { href: '/mentor/bookings',  icon: <FaCalendarCheck />,     label: 'Booking Form' },
        { href: '/mentor/history',   icon: <FaClockRotateLeft />,   label: 'Booking History' },
        { href: '/mentor/mentors',   icon: <FaChalkboardTeacher />, label: 'Mentors' },
        { href: '/mentor/sessions',  icon: <FaClock />,             label: 'Tutorial Sessions' },
        { href: '/mentor/feedbacks', icon: <FaComments />,          label: 'Student Feedbacks' },
    ],
    student: [
        { href: '/student/dashboard', icon: <MdDashboard />,         label: 'Dashboard' },
        { href: '/student/bookings',  icon: <FaCalendarCheck />,     label: 'Booking Form' },
        { href: '/student/history',   icon: <FaClockRotateLeft />,   label: 'Booking History' },
        { href: '/student/mentors',   icon: <FaChalkboardTeacher />, label: 'Mentors' },
    ],
}