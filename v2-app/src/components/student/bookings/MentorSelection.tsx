import MentorAvailabilityWidget from './MentorAvailabilityWidget';
import { FaLock } from 'react-icons/fa6';
import type { BookingFormState } from './BookingForm';
import type { BookingMentor, MentorAvailability, MentorBookedSlot } from '@/types/bookings';

interface MentorSelectionProps {
    mentor_id: string;
    date: string;
    isMentorLocked: boolean;
    filteredMentors: BookingMentor[];
    availabilities: MentorAvailability[];
    bookedSlots: MentorBookedSlot[];
    error?: string;
    userRole?: string;
    updateField: <K extends keyof BookingFormState>(key: K, value: BookingFormState[K]) => void;
}

export default function MentorSelection({
    mentor_id,
    date,
    isMentorLocked,
    filteredMentors,
    availabilities,
    bookedSlots,
    error,
    userRole,
    updateField
}: MentorSelectionProps) {

    return (
        <>
            {/* Mentor dropdown */}
            <div>
                <div className="flex items-center mb-2">
                    <span className="w-4 h-4 rounded-full bg-up-maroon text-white text-xs flex items-center justify-center">3</span>
                    <p className="text-xs font-bold pl-2.5 text-text-brown-light uppercase tracking-wider flex items-center gap-2">
                        Preferred Mentor
                    </p>
                    <span className="text-red-500">*</span>
                </div>
                <select
                    value={mentor_id}
                    disabled={isMentorLocked}
                    onChange={(e) => { updateField('mentor_id', e.target.value); }}
                    className={`w-full px-3 py-2 text-sm rounded-lg border border-cream-border bg-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-up-maroon/30 focus:border-up-maroon transition disabled:text-slate-400 disabled:bg-gray-50 ${!mentor_id ? 'text-slate-400' : 'text-text-brown'}`}
                >
                    <option value="" disabled>
                        {filteredMentors.length === 0
                            ? '--- No mentors available. Please select a different date or time. ---'
                            : '--- Select a mentor ---'}
                    </option>
                    {filteredMentors.length > 0 && !isMentorLocked && (
                        <option value="any" className="bg-cream-complement">ANY (Alerts all available mentors)</option>
                    )}
                    {filteredMentors.map((m) => (
                        <option key={m.profile_id} value={m.profile_id}>{m.name}</option>
                    ))}
                </select>

                {/* Locked Mentor */}
                {isMentorLocked && (
                    <div className="mt-1.5 flex justify-between items-center px-1">
                        <span className="text-[11px] text-blue-600 font-normal flex items-center">
                            <FaLock className="mr-1" /> Mentor Locked.
                        </span>
                        <a href={`/${userRole}/bookings `}className="text-[10px] text-gray-400 hover:text-red-400 underline">
                            Unlock & Clear
                        </a>
                    </div>
                )}
                {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
            </div>

            {/* ANY */}
            {mentor_id === 'any' && filteredMentors.length > 0 && (
                <div className="mt-3 p-4 bg-cream-complement border border-cream-border rounded-lg animate-[slide-down_0.6s_ease-out]">
                    <p className="text-sm font-bold text-blue-900">
                        First Come First Serve
                    </p>
                    <p className="text-[10px] text-blue-700 mb-2 leading-tight">
                        Your request will be sent to the following mentors. The first to accept will take your session.
                    </p>
                    <ul className="text-xs font-bold text-blue-900 space-y-1 pl-1">
                        {filteredMentors.map((m) => (
                            <li key={m.profile_id} className="flex items-center gap-1.5">
                                <span className="w-1 h-1 rounded-full bg-blue-400"></span>
                                {m.name}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Mentor availability */}
            {mentor_id && mentor_id !== 'any' && (
                <MentorAvailabilityWidget
                    mentorProfileId={mentor_id}
                    availabilities={availabilities}
                    bookedSlots={bookedSlots}
                    selectedDate={date || null}
                />
            )}
        </>
    );
}