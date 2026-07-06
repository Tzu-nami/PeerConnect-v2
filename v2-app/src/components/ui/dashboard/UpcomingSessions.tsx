import Link from "next/link"

// Components
import StatusBadge from "@/components/ui/StatusBadge"

// Icons
import { IoToday } from "react-icons/io5"

// Types
import { SessionList } from "@/types/sessionList"

// Utilities
import { formatTime } from "@/utils/formatTime"

interface UpcomingSessionsProps {
    upcomingSessions: SessionList[]
}
export default function UpcomingSessions({ upcomingSessions }: UpcomingSessionsProps) {

    return(
        <div className="bg-white rounded-xl shadow-sm border border-white-border flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between bg-text-primary rounded-t-xl">
                <div className="flex items-center gap-2 text-white px-5 py-3 font-semibold">
                    <IoToday />
                    <span>My Upcoming Sessions</span>
                </div>
                <span>{upcomingSessions.length} Session{upcomingSessions.length !== 1 ? 's' : ''}</span>
            </div>

            {/* Content */}
            {upcomingSessions.length === 0 ? (
                <p className="text-sm text-text-muted italic text-center py-[6px]">No upcoming sessions.</p>
            ) : (
                <div className="flex flex-col divide-y divide-white-border max-h-[600px] overflow-y-auto">
                    {upcomingSessions.map((session) => {
                        const startTime = formatTime(session.scheduleStart)
                        const endTime = formatTime(session.scheduleEnd)
                        const formattedDate = new Date(session.date).toLocaleDateString('en-US', {
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric',
                            timeZone: 'Asia/Manila'
                        })

                        return(
                            <div key={session.id} className="flex items-center justify-between text-[15px] px-5 py-3">
                                {/* Session info snippet */}
                                <div className="flex flex-col min-w-0">
                                    <p className="font-semibold mb-0.5">{session.mentorName}</p>
                                    <p className="text-sm text-text-muted">{session.subject} - {session.topic}</p>
                                    <p className="text-sm text-text-muted">{formattedDate} | {startTime} - {endTime} </p>
                                </div>

                                {/* Session status */}
                                <div>
                                    <StatusBadge status={session.bookingStatus} />
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}

            <Link href="/student/history" className="block text-center text-xs font-bold text-text-muted hover:text-up-maroon py-3 border-t border-white-border transition">
                View all sessions
            </Link>
        </div>

    )
}