import { useState } from 'react';
import type { RecentBooking } from '@/types/bookings';
import { format12hrTime } from '@/utils/formatHours';
import { FaChevronDown, FaRegCalendar } from 'react-icons/fa6';
import { STATUS_COLORS } from '@/constants/statusColors';
import { STATUS_LABELS } from '@/constants/statusLabels';

interface RecentBookingsPanelProps { bookings: RecentBooking[]; }

export default function RecentBookingsPanel({ bookings }: RecentBookingsPanelProps) {
    const [open, setOpen] = useState(false);

    return (
        <div className="bg-white rounded-xl border border-white-border overflow-hidden mb-7">
            <button
                onClick={() => setOpen((v) => !v)}
                type="button"
                className="w-full flex items-center justify-between px-5 py-3 text-left hover:bg-white-hover transition-colors cursor-pointer"
            >
                <span className="font-bold text-lg text-text-primary">Recent Bookings</span>
                <FaChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
            </button>

            {open && (
                <div className="px-5 pb-5">
                    {bookings.length === 0 ? (
                        <p className="text-sm text-text-white-light text-center py-4">No recent bookings found.</p>
                    ) : (
                        bookings.map((b, i) => (
                            <div key={b.id} className={`mb-4 pb-4 ${i < bookings.length - 1 ? 'border-b border-white-border' : ''}`}>
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-bold text-text-primary">{b.subject_code.toUpperCase()}</p>
                                        <p className="text-xs font-medium text-text-white-light mt-0.5 truncate">
                                            <span className="font-bold text-text-white-light tracking-wide">Mentor:</span> {b.mentor_name || 'Any'}
                                        </p>
                                        <p className="text-xs font-medium text-text-white-light mt-0.5 truncate">
                                            <span className="font-bold text-text-white-light tracking-wide">Topic:</span> {b.topic}
                                        </p>
                                        <p className="text-xs font-medium text-text-white-light mt-0.5 truncate">
                                            <span className="font-bold text-text-white-light tracking-wide">Mode:</span> {b.mode}
                                        </p>
                                    </div>
                                    <div className="flex-shrink-0 mt-1">
                                        <span className={`font-bold text-[10px] px-2 py-1 rounded ${STATUS_COLORS[b.status] ?? 'bg-gray-100 text-gray-500 border-gray-500'}`}>
                                        {STATUS_LABELS[b.status] ?? b.status}
                                        </span>
                                    </div>
                                </div>
                                <p className="text-[11px] text-text-primary font-bold mt-1.5 flex items-center flex-wrap">
                                    <FaRegCalendar className="mr-1.5" />
                                    {new Date(b.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', weekday: 'short' })}
                                    <span className="mx-1.5 text-text-white-light">|</span>
                                    {format12hrTime(b.start_time)} – {format12hrTime(b.end_time)}
                                </p>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}