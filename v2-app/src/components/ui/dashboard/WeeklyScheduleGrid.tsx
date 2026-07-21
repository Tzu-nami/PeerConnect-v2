import { useMemo } from "react"

// Full calendar
import FullCalendar from "@fullcalendar/react"
import timeGridPlugin from "@fullcalendar/timegrid"
import dayGridPlugin from "@fullcalendar/daygrid"
import interactionPlugin from "@fullcalendar/interaction"
import listPlugin from "@fullcalendar/list"

// Types
import { SessionList } from "@/types/sessionList"
import {FaCalendar } from "react-icons/fa";

interface WeeklyScheduleGridProps {
    sessionList: SessionList[]
    role: 'mentor' | 'student'
}

const STATUS_COLORS: Record<string, { bg: string; text: string; border: string }> = {
    pending:   { bg: '#fef9c3', text: '#a16207', border: '#a16207' },
    accepted:  { bg: '#dcfce7', text: '#15803d', border: '#15803d' },
    rejected:  { bg: '#fee2e2', text: '#b91c1c', border: '#b91c1c' },
    completed: { bg: '#dbeafe', text: '#1d4ed8', border: '#1d4ed8' },
    no_show:   { bg: '#f3f4f6', text: '#374151', border: '#374151' },
    cancelled: { bg: '#e7e5e4', text: '#57534e', border: '#44403c' },
}

export default function WeeklyScheduleGrid({ sessionList, role }: WeeklyScheduleGridProps) {
    const events = useMemo(() => {
        return sessionList.map((session) => ({
            id: session.id,
            title: session.subject,
            start: session.scheduleStart,
            end: session.scheduleEnd,
            extendedProps: {
                status: session.bookingStatus,
                studentName: session.studentName,
                mentorName: session.mentorName,
                subject: session.subject,
                topic: session.topic,
                mode: session.mode,
            }
        }))
    }, [sessionList])

    return (
        <div className="bg-white rounded-xl shadow-sm border border-white-border p-4 sm:p-5">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between mb-4 sm:mb-0">
                <div className="flex flex-col">
                    <div className="flex items-center gap-2 mb-2 sm:mb-4">
                        <FaCalendar  className="text-lg" />
                        <p className="font-bold text-xl">Calendar Grid</p>
                    </div>
                </div>
            </div>

            {/* Legend */}
            <div className="flex items-center gap-3 sm:gap-4 mb-4 flex-wrap">
                {Object.entries(STATUS_COLORS).map(([status, colors]) => (
                    <div key={status} className="flex items-center gap-1.5 text-xs font-semibold capitalize whitespace-nowrap">
                        <span className="w-2.5 h-2.5 rounded-full border shrink-0" style={{ backgroundColor: colors.bg, borderColor: colors.border }} />
                        {status.replace('_', ' ')}
                    </div>
                ))}
            </div>

            {/* Calendar */}
            <div className="overflow-x-auto">
                <div className="min-w-[700px]">
                    <FullCalendar
                        plugins={[timeGridPlugin, dayGridPlugin, interactionPlugin, listPlugin]}
                        initialView="timeGridWeek"
                        headerToolbar={{
                            left: 'prev,next today',
                            center: 'title',
                            right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
                        }}
                        events={events}
                        slotMinTime="08:00:00"
                        slotMaxTime="18:00:00"
                        slotDuration="00:30:00"
                        allDaySlot={false}
                        height={670}
                        eventContent={(eventInfo) => {
                            const { status, studentName, mentorName, subject } = eventInfo.event.extendedProps
                            const colors = STATUS_COLORS[status] ?? STATUS_COLORS.cancelled
                            return (
                                <div style={{
                                    backgroundColor: colors.bg,
                                    color: colors.text,
                                    borderLeft: `3px solid ${colors.border}`,
                                    borderRadius: '4px',
                                    padding: '2px 6px',
                                    fontSize: '11px',
                                    fontWeight: '600',
                                    overflow: 'hidden',
                                    height: '100%'
                                }}>
                                    <p className="font-bold truncate">{subject}</p>
                                    <p className="truncate opacity-80">{role === 'mentor' ? studentName : mentorName}</p>
                                </div>
                            )
                        }}
                        dayHeaderFormat={{ weekday: 'short', month: 'short', day: 'numeric' }}
                        slotLabelFormat={{ hour: 'numeric', minute: '2-digit', hour12: true }}
                    />
                </div>
            </div>
        </div>
    )
}