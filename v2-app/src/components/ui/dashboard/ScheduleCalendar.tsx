import * as React from "react"

// Types
import { SessionList } from "@/types/sessionList"

// Components
import { Calendar, CalendarDayButton } from "@/components/ui/calendar"

interface ScheduleCalendarProps {
    sessionsByDate: Record<string, SessionList[]>
    today: string
    selectedDate: Date | undefined
    onDateSelect: (date: Date | undefined) => void
}

// Display current time and date
function ScheduleHeader() {
    const [now, setNow] = React.useState<Date | null>(null)

    React.useEffect(() => {
        setNow(new Date())
        const interval = setInterval(() => setNow(new Date()), 1000)
        return () => clearInterval(interval)
    }, [])

    const currentDay = now?.toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
        })

    const currentTime = now?.toLocaleTimeString("en-GB")

    return (
        <div className="flex items-center justify-between rounded-t-xl bg-cream-dark border-b border-cream-border px-4 py-3 text-[13px] font-semibold">
            <span className="tracking-wide">{currentDay}</span>
            <span className="text-text-brown-light">{currentTime}</span>
        </div>
    )
}

// Display status dots on days with sessions
function getDotColor(sessions: SessionList[] | undefined, dateKey: string, today: string) {
    if (!sessions || sessions.length === 0) return null

    if (dateKey < today) {
        return 'bg-stone-400';
    }

    const hasPending = sessions.some((s) => s.bookingStatus === 'pending')
    if (hasPending) return 'bg-yellow-500'

    const hasAccepted = sessions.some((a) => a.bookingStatus === 'accepted')
    if (hasAccepted) return 'bg-green-500'

    return 'bg-stone-400'
}

export default function ScheduleCalendar({ sessionsByDate, today, selectedDate, onDateSelect }: ScheduleCalendarProps) {
    return (
        <div className="rounded-xl shadow-sm border border-cream-border overflow-hidden">
            <ScheduleHeader />
            <Calendar
                mode="single"
                fixedWeeks
                selected={selectedDate}
                onSelect={(date) => onDateSelect(date)}
                className="w-full rounded-xl"
                components={{
                    DayButton: (props) => {
                        const dateKey = props.day.date.toLocaleDateString('en-CA')
                        const sessions = sessionsByDate[dateKey]
                        const dotColor = getDotColor(sessions, dateKey, today)
                        return (
                            <div className="relative w-full h-full">
                                <CalendarDayButton
                                    {...props}
                                    className="absolute inset-0 w-full h-full"
                                />
                                {dotColor && (
                                    <span className={`pointer-events-none absolute bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full ${dotColor}`} />
                                )}
                            </div>
                        )
                    }
                }}
            />
        </div>
    )
}