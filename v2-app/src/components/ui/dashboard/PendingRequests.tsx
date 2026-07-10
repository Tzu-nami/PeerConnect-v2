import { useState } from "react"

// Icons
import { FaCheck, FaTimes, FaHourglassHalf } from "react-icons/fa"

// Types
import { SessionList } from "@/types/sessionList"

// Utilities
import { formatTime } from "@/utils/formatTime"
import UpdateSessionStatusModal, { StatusAction } from "@/components/mentor/sessions/UpdateSessionStatusModal"
import Link from "next/link";

interface PendingRequestsProps {
    pendingSessions: (SessionList & { isOpen: boolean})[]
    onSuccess: (status: StatusAction) => void
}

export default function PendingRequests({ pendingSessions, onSuccess }: PendingRequestsProps) {
    const [selectedSession, setSelectedSession] = useState<any | null>(null);
    const [modalAction, setModalAction] = useState<StatusAction | null>(null);
    const displayedRequests = pendingSessions.slice(0, 5)

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
                                    <button 
                                        onClick={() => {
                                            setSelectedSession({
                                                id: session.id,
                                                group_ids: [session.id],
                                                student: session.studentName,
                                                subject: session.subject,
                                                date: formattedDate,
                                                time: `${startTime} - ${endTime}`
                                            });
                                            setModalAction(session.isOpen ? 'claim' : 'accepted');
                                        }}
                                        className={`p-1.5 rounded-lg cursor-pointer transition ${session.isOpen ? 'text-emerald-500 bg-emerald-50 hover:bg-emerald-200' : 'text-green-500 bg-green-50 hover:bg-green-200'}`}
                                        title={session.isOpen ? "Claim Session" : "Accept Session"}
                                    >
                                        <FaCheck />
                                    </button>
                                    {!session.isOpen && (
                                        <button 
                                            onClick={() => {
                                                setSelectedSession({
                                                    id: session.id,
                                                    group_ids: [session.id],
                                                    student: session.studentName,
                                                    subject: session.subject,
                                                    date: formattedDate,
                                                    time: `${startTime} - ${endTime}`
                                                });
                                                setModalAction('rejected');
                                            }}
                                            className="p-1.5 rounded-lg text-red-500 bg-red-50 hover:bg-red-100 cursor-pointer transition"
                                            title="Mark as unavailable"
                                        >
                                            <FaTimes />
                                        </button>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}

            <Link href="/mentor/sessions" className="block text-center text-xs font-bold text-text-muted hover:text-up-maroon py-3 border-t border-white-border transition">
                View all sessions
            </Link>

            <UpdateSessionStatusModal
                isOpen={!!selectedSession}
                session={selectedSession}
                action={modalAction}
                onClose={() => {
                    setSelectedSession(null);
                    setModalAction(null);
                }}
                onSuccess={(action) => {
                    setSelectedSession(null);
                    setModalAction(null);
                    onSuccess(action);
                }}
            />
        </div>
    )
}