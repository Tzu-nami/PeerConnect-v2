import { useState } from "react"

// Icons
import { FaCheck, FaTimes, FaHourglassHalf } from "react-icons/fa"

// Types
import { SessionList } from "@/types/sessionList"

// Utilities
import { createClient } from "@/utils/supabase/client"
import { formatTime } from "@/utils/formatTime"
import Link from "next/link";

interface PendingRequestsProps {
    pendingSessions: SessionList[]
    onSuccess: (status: 'accepted' | 'rejected') => void
}

export default function PendingRequests({ pendingSessions, onSuccess }: PendingRequestsProps) {
    const [bookingId, setBookingId] = useState<string | null>(null)
    const supabase = createClient()
    const displayedRequests = pendingSessions.slice(0, 5)

    async function handleAction(id: string, status: 'accepted' | 'rejected') {
        setBookingId(id)
        await supabase.from('bookings').update({ booking_status: status }).eq('id', id)
        setBookingId(null)
        onSuccess(status)
    }

    return(
        <div className="bg-white rounded-xl shadow-sm border border-white-border flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between bg-text-primary rounded-t-xl">
                <div className="flex items-center gap-2 text-white px-5 py-3 font-semibold">
                    <FaHourglassHalf />
                    <span>Pending Requests</span>
                </div>
                <span>{pendingSessions.length} Request{pendingSessions.length !== 1 ? 's' : ''}</span>
            </div>

            {/* Content */}
            {displayedRequests.length === 0 ? (
                <p className="text-sm text-text-muted italic text-center py-[6px]">No pending requests.</p>
            ) : (
                <div className="flex flex-col divide-y divide-white-border">
                    {displayedRequests.map((session) => {
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
                                    <p className="font-semibold mb-0.5">{session.studentName}</p>
                                    <p className="text-sm text-text-muted">{session.subject} - {session.topic}</p>
                                    <p className="text-sm text-text-muted">{formattedDate} | {startTime} - {endTime} </p>
                                </div>

                                {/* Action buttons */}
                                <div className="flex gap-2">
                                    <button onClick={() => handleAction(session.id,'accepted')} disabled={bookingId === session.id}
                                            className="p-1.5 rounded-lg text-green-500  bg-green-50 hover:bg-green-200 cursor-pointer disabled:opacity-50">
                                        <FaCheck />
                                    </button>
                                    <button onClick={() => handleAction(session.id, 'rejected')} disabled={bookingId === session.id}

                                        className="p-1.5 rounded-lg text-red-500  bg-red-50 hover:bg-red-100 cursor-pointer disabled:opacity-50">
                                        <FaTimes />
                                    </button>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}

            <Link href="/mentor/sessions" className="block text-center text-xs font-bold text-text-muted hover:text-up-maroon py-3 border-t border-white-border transition">
                View all sessions
            </Link>
        </div>
    )
}