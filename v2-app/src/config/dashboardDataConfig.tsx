import { FaChalkboardTeacher, FaUserGraduate, FaHourglassHalf, FaStar, FaCalendarAlt, FaCheckCircle, FaBookOpen, FaClock  } from "react-icons/fa"
import { IoToday } from "react-icons/io5"

export const dashboardDataConfig: Record<string, {
    gridCols: string;
    cards: { label: string; dataKey: string; href: string; borderColor: string; icon: React.ReactNode; iconColor: string }[];
    scheduleColumns: {label: string; width: string}[]}> = {
        admin: {
            gridCols: 'grid-cols-5',
            cards: [
                { label: 'Total Mentors',       dataKey: 'totalMentors',            href: '/admin/mentors',         borderColor: 'border-l-green-600',     icon: <FaChalkboardTeacher />,     iconColor: 'text-green-600'     },
                { label: 'Total Students',      dataKey: 'totalStudents',           href: '/admin/students',        borderColor: 'border-l-blue-500',      icon: <FaUserGraduate />,          iconColor: 'text-blue-500'      },
                { label: 'Sessions Today',      dataKey: 'totalSessionsToday',      href: '/admin/sessions',        borderColor: 'border-l-yellow-500',    icon: <IoToday />,                 iconColor: 'text-yellow-500'    },
                { label: 'Pending Sessions',    dataKey: 'totalPendingSessions',    href: '/admin/sessions',        borderColor: 'border-l-red-600',       icon: <FaHourglassHalf />,         iconColor: 'text-red-600'       },
                { label: 'Average Ratings',     dataKey: 'totalFeedbackAverage',    href: '/admin/feedbacks',       borderColor: 'border-l-purple-500',    icon: <FaStar />,                  iconColor: 'text-purple-500'    }
            ],
            scheduleColumns: [
                {label: 'Student',      width: 'w-[24%]'    },
                {label: 'Mentor',       width: 'w-[24%]'    },
                {label: 'Subject',      width: 'w-[16%]'    },
                {label: 'Time',         width: 'w-[20%]'    },
                {label: 'Status',       width: 'w-[16%]'    }
            ]
        },
        mentor: {
            gridCols: 'grid-cols-4',
            cards: [
                { label: 'Accepted Sessions Today',     dataKey: 'sessionsToday',       href: '/mentor/sessions',       borderColor: 'border-l-blue-500',       icon: <IoToday  />,              iconColor: 'text-blue-500'     },
                { label: 'Pending Requests',            dataKey: 'pendingRequests',     href: '/mentor/sessions',       borderColor: 'border-l-yellow-500',     icon: <FaHourglassHalf  />,      iconColor: 'text-yellow-500'      },
                { label: 'Average Ratings',             dataKey: 'averageRatings',      href: '/mentor/feedbacks',      borderColor: 'border-l-green-600',      icon: <FaStar />,                iconColor: 'text-green-600'    },
                { label: 'Rendered Hours',              dataKey: 'renderedHours',       href: '/mentor/sessions',       borderColor: 'border-l-red-600',        icon: <FaClock  />,              iconColor: 'text-red-600'       }
            ],
            scheduleColumns: [
                {label: 'Student',      width: 'w-[25%]'    },
                {label: 'Subject',      width: 'w-[25%]'    },
                {label: 'Time',         width: 'w-[25%]'    },
                {label: 'Status',       width: 'w-[25%]'    }
            ]
        },
        student: {
            gridCols: 'grid-cols-4',
            cards: [
                { label: 'Sessions Today',      dataKey: 'sessionsToday',           href: '/student/history',       borderColor: 'border-l-blue-500',       icon: <IoToday />,           iconColor: 'text-blue-500'     },
                { label: 'Pending Requests',    dataKey: 'pendingRequests',         href: '/student/history',       borderColor: 'border-l-yellow-500',     icon: <FaCalendarAlt />,     iconColor: 'text-yellow-500'      },
                { label: 'Completed Sessions',  dataKey: 'completedSessions',       href: '/student/history',       borderColor: 'border-l-green-600',      icon: <FaCheckCircle  />,    iconColor: 'text-green-600'    },
                { label: 'Favorite Subject',    dataKey: 'favoriteSubject',         href: '/student/mentors',       borderColor: 'border-l-red-600',        icon: <FaBookOpen  />,       iconColor: 'text-red-600'       }
            ],
            scheduleColumns: [
                {label: 'Mentor',       width: 'w-[25%]'    },
                {label: 'Subject',      width: 'w-[25%]'    },
                {label: 'Time',         width: 'w-[25%]'    },
                {label: 'Status',       width: 'w-[25%]'    }
            ]
    }
}

