import { useMemo, useState } from "react"

// Configs
import { dashboardDataConfig } from "@/config/dashboardDataConfig"

// Constants
import { STATUS_LABELS } from "@/constants/statusLabels"

// Components
import SearchBar from "@/components/ui/SearchBar"
import StatusBadge from "@/components/ui/StatusBadge"

// Icons
import { FaCalendarCheck } from "react-icons/fa"
import { MdChevronLeft, MdChevronRight } from "react-icons/md"

// Types
import { SessionList } from "@/types/sessionList"

// Utilities
import { formatTime } from "@/utils/formatTime"

interface TodaysScheduleProps {
    currentSessions: SessionList[]
    date: string | undefined
    role: 'admin' | 'mentor' | 'student'
}

export default function TodaysSchedule({ currentSessions, date, role }: TodaysScheduleProps) {
    // Search and filter functions
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedStatus, setSelectedStatus] = useState('')

    const filteredSessions = useMemo(() => {
        const query = searchQuery.toLowerCase()

        return currentSessions.filter((session) => {
            const matchesSearch = !query || (
                session.studentName?.toLowerCase().includes(query) ||
                session.mentorName?.toLowerCase().includes(query) ||
                session.subject?.toLowerCase().includes(query) ||
                session.mode?.toLowerCase().includes(query) ||
                session.bookingStatus?.toLowerCase().includes(query)
            )
            const matchesStatus = !selectedStatus || session.bookingStatus === selectedStatus

            return matchesSearch && matchesStatus
        })
    }, [searchQuery, selectedStatus, currentSessions])

    // Pagination
    const ITEMS_PER_PAGE = 7
    const [currentPage, setCurrentPage] = useState(1)
    const totalPages = Math.ceil(filteredSessions.length / ITEMS_PER_PAGE)
    const paginatedSessions = filteredSessions.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

    // Table data
    const colHeader = dashboardDataConfig[role].scheduleColumns

    return(
        <div className="bg-white rounded-xl shadow-sm border border-white-border h-full flex flex-col">
            {/* Header */}
            <div className="flex justify-between p-5">
                <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                        <FaCalendarCheck className="text-lg" />
                        <p className="font-bold text-xl">Today&apos;s Schedule</p>
                    </div>
                    <p className="text-sm text-text-muted">{date}</p>
                </div>

                <div className="flex items-center gap-2">
                    <SearchBar value={searchQuery} onChange={(e) => {setSearchQuery(e); setCurrentPage(1)}} placeholder="Search session..." />
                    <div className="relative rounded-lg flex items-center">
                        <select value={selectedStatus} onChange={(e) => {setSelectedStatus(e.target.value); setCurrentPage(1)}}
                                className="text-xs font-medium text-text-primary border border-white-border rounded-lg px-3 h-[36px] w-28 bg-white outline-none focus:ring-1 focus:border-text-muted cursor-pointer">
                            <option value="">All</option>
                            {Object.entries(STATUS_LABELS).map(([value, label]) => (
                                <option key={value} value={value}>{label}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="flex-1">
                <table className="w-full table-fixed text-left text-[13px]">
                    {/* Table header */}
                    <thead className="text-text-muted text-xs bg-white-dark">
                    <tr>
                        {colHeader.map((column) => (
                            <th key={column.label} className={`${column.width} px-5 py-3 border-y border-white-border`}>
                                <button>
                                    {column.label}
                                </button>
                            </th>
                        ))}
                    </tr>
                    </thead>

                    {/* Table contents */}
                    <tbody>
                    {paginatedSessions.length === 0 ? (
                        <tr>
                            <td colSpan={colHeader.length} className="text-center py-40 text-text-muted">
                                <div className="flex flex-col items-center gap-2">
                                    <FaCalendarCheck className="text-3xl opacity-30" />
                                    <p className="text-sm font-medium">No sessions found for today</p>
                                </div>
                            </td>
                        </tr>
                    ) : (
                        paginatedSessions.map((session) => {
                            const startTime = formatTime(session.scheduleStart)
                            const endTime = formatTime(session.scheduleEnd)

                            return(
                                <tr key={session.id} className="border-t border-white-border">
                                    {role !== 'student' && <td className="px-5 py-4 font-bold truncate" title={session.studentName}>{session.studentName}</td>}
                                    {role !== 'mentor' && <td className="px-5 py-4 truncate" title={session.mentorName}>{session.mentorName}</td>}
                                    <td className="px-5 py-4 truncate">{session.subject}</td>
                                    <td className="px-5 py-4 truncate">{startTime} - {endTime}</td>
                                    <td className="px-5 py-4 truncate"><StatusBadge status={session.bookingStatus}/></td>
                                </tr>
                            )
                        })
                    )}
                    </tbody>
                </table>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-5 pb-4">
                <p className="text-xs text-text-muted">Showing {paginatedSessions.length} of {filteredSessions.length} session{filteredSessions.length !== 1 ? 's' : ''} </p>
                <div className="flex items-center gap-2 text-2xl ">
                    <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1 || totalPages <= 1}
                            className="border border-white-border py-1 rounded-sm hover:bg-white-hover cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed">
                        <MdChevronLeft />
                    </button>
                    <button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages || totalPages === 0 || totalPages <= 1}
                            className="border border-white-border py-1 rounded-sm hover:bg-white-hover cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed">
                        <MdChevronRight />
                    </button>
                </div>
            </div>
        </div>
    )
}