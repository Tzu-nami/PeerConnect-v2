import { FaChalkboardTeacher, FaUserGraduate, FaHourglassHalf, FaStar } from "react-icons/fa"
import { IoToday } from "react-icons/io5"

export const statCardsConfig: Record<string, { gridCols: string; cards: { label: string; dataKey: string; href: string; color: string; icon: React.ReactNode }[] }> = {
    admin: {
        gridCols: 'grid-cols-5',
        cards: [
            { label: 'Total Mentors',       dataKey: 'totalMentors',            href: '/admin/mentors',         color: 'green',     icon: <FaChalkboardTeacher />   },
            { label: 'Total Students',      dataKey: 'totalStudents',           href: '/admin/students',        color: 'blue',      icon: <FaUserGraduate />        },
            { label: 'Sessions Today',      dataKey: 'totalSessionsToday',      href: '/admin/sessions',        color: 'yellow',    icon: <IoToday />               },
            { label: 'Pending Sessions',    dataKey: 'totalPendingSessions',    href: '/admin/sessions',        color: 'red',       icon: <FaHourglassHalf />       },
            { label: 'Average Ratings',     dataKey: 'totalFeedbackAverage',    href: '/admin/feedbacks',       color: 'purple',    icon: <FaStar />                }
        ]
    },
    mentor: {
        gridCols: 'grid-cols-4',
        cards: [
            { label: 'Sessions Today',      dataKey: 'totalMentors',            href: '/mentor/sessions',       color: 'green',     icon: <FaChalkboardTeacher />   },
            { label: 'Pending Requests',    dataKey: 'totalMentors',            href: '/mentor/sessions',       color: 'blue',      icon: <FaChalkboardTeacher />   },
            { label: 'Average Ratings',     dataKey: 'totalMentors',            href: '/mentor/sessions',       color: 'yellow',    icon: <FaChalkboardTeacher />   },
            { label: 'Rendered Hours',      dataKey: 'totalMentors',            href: '/mentor/sessions',       color: 'red',       icon: <FaChalkboardTeacher />   }
        ]
    },
    student: {
        gridCols: 'grid-cols-3',
        cards: [
            { label: 'Sessions Today',      dataKey: 'totalMentors',            href: '/student/mentors',       color: 'green',     icon: <FaChalkboardTeacher />   },
            { label: 'Upcoming Sessions',   dataKey: 'totalMentors',            href: '/student/mentors',       color: 'blue',      icon: <FaChalkboardTeacher />   },
            { label: 'Total Sessions',      dataKey: 'totalMentors',            href: '/student/mentors',       color: 'yellow',    icon: <FaChalkboardTeacher />   },
            { label: 'Favorite Subject',    dataKey: 'totalMentors',            href: '/student/mentors',       color: 'red',       icon: <FaChalkboardTeacher />   }
        ]
    }
}

