import { FaChalkboardTeacher, FaUserGraduate, FaHourglassHalf, FaStar } from "react-icons/fa"
import { IoToday } from "react-icons/io5"

export const dashboardDataConfig: Record<string, {
    gridCols: string;
    cards: { label: string; dataKey: string; href: string; borderColor: string; icon: React.ReactNode; iconColor: string }[];
    scheduleColumns: {label: string; width: string}[]}> = {
        admin: {
            gridCols: 'grid-cols-5',
            cards: [
                { label: 'Total Mentors',       dataKey: 'totalMentors',            href: '/admin/mentors',         borderColor: 'border-l-green-600',     icon: <FaChalkboardTeacher />,     iconColor: 'text-green-600'     },
                { label: 'Total Students',      dataKey: 'totalStudents',           href: '/admin/sessions',        borderColor: 'border-l-blue-500',      icon: <FaUserGraduate />,          iconColor: 'text-blue-500'      },
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
                { label: 'Sessions Today',      dataKey: 'totalMentors',            href: '/mentor/sessions',       borderColor: 'border-green-600',     icon: <FaChalkboardTeacher />,     iconColor: 'text-green-600'     },
                { label: 'Pending Requests',    dataKey: 'totalMentors',            href: '/mentor/sessions',       borderColor: 'border-blue-500',      icon: <FaChalkboardTeacher />,     iconColor: 'text-blue-500'      },
                { label: 'Average Ratings',     dataKey: 'totalMentors',            href: '/mentor/sessions',       borderColor: 'border-yellow-500',    icon: <FaChalkboardTeacher />,     iconColor: 'text-yellow-500'    },
                { label: 'Rendered Hours',      dataKey: 'totalMentors',            href: '/mentor/sessions',       borderColor: 'border-red-600',       icon: <FaChalkboardTeacher />,     iconColor: 'text-red-600'       }
            ],
            scheduleColumns: [
                {label: 'Student',      width: 'w-[35%]'    },
                {label: 'Subject',      width: 'w-[15%]'    },
                {label: 'Time',         width: 'w-[35%]'    },
                {label: 'Status',       width: 'w-[15%]'    }
            ]
        },
        student: {
            gridCols: 'grid-cols-3',
            cards: [
                { label: 'Sessions Today',      dataKey: 'totalMentors',            href: '/student/mentors',       borderColor: 'border-green-600',     icon: <FaChalkboardTeacher />,     iconColor: 'text-green-600'     },
                { label: 'Upcoming Sessions',   dataKey: 'totalMentors',            href: '/student/mentors',       borderColor: 'border-blue-500',      icon: <FaChalkboardTeacher />,     iconColor: 'text-blue-500'      },
                { label: 'Total Sessions',      dataKey: 'totalMentors',            href: '/student/mentors',       borderColor: 'border-yellow-500',    icon: <FaChalkboardTeacher />,     iconColor: 'text-yellow-500'    },
                { label: 'Favorite Subject',    dataKey: 'totalMentors',            href: '/student/mentors',       borderColor: 'border-red-600',       icon: <FaChalkboardTeacher />,     iconColor: 'text-red-600'       }
            ],
            scheduleColumns: [
                {label: 'Mentor',       width: 'w-[35%]'    },
                {label: 'Subject',      width: 'w-[15%]'    },
                {label: 'Time',         width: 'w-[35%]'    },
                {label: 'Status',       width: 'w-[15%]'    }
            ]
    }
}

