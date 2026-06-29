import { FaChalkboardTeacher, FaUserGraduate, FaHourglassHalf, FaStar } from "react-icons/fa"
import { IoToday } from "react-icons/io5"

export const dashboardStatCardsConfig: Record<string, { gridCols: string; cards: { label: string; dataKey: string; href: string; borderColor: string; icon: React.ReactNode; iconColor: string }[] }> = {
    admin: {
        gridCols: 'grid-cols-5',
        cards: [
            { label: 'Total Mentors',       dataKey: 'totalMentors',            href: '/admin/mentors',         borderColor: 'border-green-600',     icon: <FaChalkboardTeacher />,     iconColor: 'text-green-600'     },
            { label: 'Total Students',      dataKey: 'totalStudents',           href: '/admin/students',        borderColor: 'border-blue-500',      icon: <FaUserGraduate />,          iconColor: 'text-blue-500'      },
            { label: 'Sessions Today',      dataKey: 'totalSessionsToday',      href: '/admin/sessions',        borderColor: 'border-yellow-500',    icon: <IoToday />,                 iconColor: 'text-yellow-500'    },
            { label: 'Pending Sessions',    dataKey: 'totalPendingSessions',    href: '/admin/sessions',        borderColor: 'border-red-600',       icon: <FaHourglassHalf />,         iconColor: 'text-red-600'       },
            { label: 'Average Ratings',     dataKey: 'totalFeedbackAverage',    href: '/admin/feedbacks',       borderColor: 'border-purple-500',    icon: <FaStar />,                  iconColor: 'text-purple-500'    }
        ]
    },
    mentor: {
        gridCols: 'grid-cols-4',
        cards: [
            { label: 'Sessions Today',      dataKey: 'totalMentors',            href: '/mentor/sessions',       borderColor: 'border-green-600',     icon: <FaChalkboardTeacher />,     iconColor: 'text-green-600'     },
            { label: 'Pending Requests',    dataKey: 'totalMentors',            href: '/mentor/sessions',       borderColor: 'border-blue-500',      icon: <FaChalkboardTeacher />,     iconColor: 'text-blue-500'      },
            { label: 'Average Ratings',     dataKey: 'totalMentors',            href: '/mentor/sessions',       borderColor: 'border-yellow-500',    icon: <FaChalkboardTeacher />,     iconColor: 'text-yellow-500'    },
            { label: 'Rendered Hours',      dataKey: 'totalMentors',            href: '/mentor/sessions',       borderColor: 'border-red-600',       icon: <FaChalkboardTeacher />,     iconColor: 'text-red-600'       }
        ]
    },
    student: {
        gridCols: 'grid-cols-3',
        cards: [
            { label: 'Sessions Today',      dataKey: 'totalMentors',            href: '/student/mentors',       borderColor: 'border-green-600',     icon: <FaChalkboardTeacher />,     iconColor: 'text-green-600'     },
            { label: 'Upcoming Sessions',   dataKey: 'totalMentors',            href: '/student/mentors',       borderColor: 'border-blue-500',      icon: <FaChalkboardTeacher />,     iconColor: 'text-blue-500'      },
            { label: 'Total Sessions',      dataKey: 'totalMentors',            href: '/student/mentors',       borderColor: 'border-yellow-500',    icon: <FaChalkboardTeacher />,     iconColor: 'text-yellow-500'    },
            { label: 'Favorite Subject',    dataKey: 'totalMentors',            href: '/student/mentors',       borderColor: 'border-red-600',       icon: <FaChalkboardTeacher />,     iconColor: 'text-red-600'       }
        ]
    }
}

