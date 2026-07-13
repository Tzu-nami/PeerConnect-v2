import type { ActiveBooking } from '@/types/bookings';
import { FaHourglassHalf, FaCircleCheck, FaCircleInfo, FaBan } from 'react-icons/fa6';
import { format12hrTime } from '@/utils/formatHours';

interface ActiveBookingCardProps {
  booking: ActiveBooking;
  onCancel: () => void;
}

export default function ActiveBookingCard({ booking, onCancel }: ActiveBookingCardProps) {
    const isPending = booking.status === 'pending';
    const dateFormatted = new Date(booking.date + 'T00:00:00').toLocaleDateString('en-US', {
        weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
    });

    return (
        <div className="bg-white rounded-xl overflow-hidden mb-6 border border-white-border">
            {/* Banner */}
            <div className={`flex items-start gap-4 p-6 ${isPending ? 'bg-yellow-100' : 'bg-green-100'}`}>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl flex-shrink-0 ${isPending ? 'bg-yellow-200 text-yellow-700' : 'bg-green-200 text-green-600'}`}>
                    {isPending ? <FaHourglassHalf /> : <FaCircleCheck />}
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-3 mb-1">
                        <h2 className={`text-xl font-extrabold tracking-tight ${isPending ? 'text-yellow-900' : 'text-green-900'}`}>
                        You have an active booking
                        </h2>
                        <span className={`inline-flex items-center gap-1 text-sm font-bold px-3 py-0.5 rounded-full ${isPending ? 'bg-yellow-200 text-yellow-800' : 'bg-green-200 text-green-800'}`}>
                        {isPending ? 'Awaiting Approval' : 'Accepted'}
                        </span>
                    </div>
                    <p className={`text-sm leading-snug ${isPending ? 'text-yellow-800' : 'text-green-800'}`}>
                        {isPending
                        ? 'Your booking request has been submitted. You cannot make a new booking until this one is resolved.'
                        : 'Your session has been confirmed! Please be on time.'}
                    </p>
                </div>
            </div>

            {/* Details */}
            <div className="p-6">
                <h2 className="text-lg font-extrabold text-up-maroon mb-3">Session Details</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                        { label: 'Subject',      value: `${booking.subject_code} — ${booking.subject_name}` },
                        { label: 'Tutorial Mode',value: booking.mode },
                        { label: 'Topic',        value: booking.topic },
                        { label: 'Peer Mentor',  value: booking.mentor_name || 'TBA' },
                        { label: 'Date',         value: dateFormatted },
                        { label: 'Time',         value: `${format12hrTime(booking.start_time)} – ${format12hrTime(booking.end_time)}` },
                    ].map(({ label, value }) => (
                        <div key={label} className="min-w-0">
                            <label className="block text-[10px] font-bold text-text-white-light uppercase tracking-wider mb-0.5">{label}</label>
                            <p className="text-sm font-medium text-text-primary truncate">{value}</p>
                        </div>
                    ))}
                </div>

                <div className="mt-6 pt-5 border-t border-white-border flex flex-wrap items-center justify-between gap-3">
                    <p className="flex items-center gap-2 text-xs font-bold text-gray-500">
                        <FaCircleInfo className="text-gray-400 flex-shrink-0 text-sm" />
                        You may cancel this booking at any time.
                    </p>
                    <button
                        type="button"
                        onClick={onCancel}
                        className="flex-shrink-0 flex items-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 font-semibold text-sm rounded-lg border border-red-200 transition-colors cursor-pointer"
                    >
                        <FaBan /> Cancel Booking
                    </button>
                </div>
            </div>
        </div>
    );
}