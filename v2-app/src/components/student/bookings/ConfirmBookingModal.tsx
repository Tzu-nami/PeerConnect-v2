import ConfirmModal from '@/components/ui/ConfirmModal';
import { FaCalendarCheck } from 'react-icons/fa6';
import { format12hrTime } from '@/utils/formatHours';
import type { BookingFormState } from './BookingForm'; 
import type { Subject } from '@/types/mentor';
import type { TutorialMode, BookingMentor } from '@/types/bookings';

interface ConfirmBookingModalProps {
    isOpen: boolean;
    form: BookingFormState;
    subjects: Subject[];
    tutorialModes: TutorialMode[];
    filteredMentors: BookingMentor[];
    submitting: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

export default function ConfirmBookingModal({
    isOpen, 
    form, 
    subjects, 
    tutorialModes, 
    filteredMentors, 
    submitting, 
    onConfirm, 
    onCancel
}: ConfirmBookingModalProps) {
    
    // Confirm message
    const confirmBody = (
        <div className="text-left bg-cream p-4 rounded-xl border border-cream-border text-xs text-text-brown space-y-2 mt-4">
            {[
                { label: 'Subject:', value: subjects.find((s) => String(s.id) === String(form.subject_id))?.code ?? 'N/A' },
                { label: 'Topic:',   value: form.topic },
                { label: 'Mode:',    value: tutorialModes.find((m) => String(m.id) === String(form.tutorialMode_id))?.mode ?? 'N/A' },
                { label: 'Mentor:',  value: form.mentor_id === 'any' ? 'Any (First Come First Serve)' : filteredMentors.find((m) => String(m.profile_id) === String(form.mentor_id))?.name ?? 'N/A' },
                { label: 'Date:',    value: form.date ? new Date(form.date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }) : 'N/A' },
                { label: 'Time:',    value: form.schedule_start && form.schedule_end ? `${format12hrTime(form.schedule_start)} – ${format12hrTime(form.schedule_end)}` : 'N/A' },
            ].map(({ label, value }) => (
                <div key={label} className="flex justify-between gap-4">
                    <span className="text-text-brown-light font-bold shrink-0 uppercase tracking-wider">{label}</span>
                    <span className="font-bold text-text-brown truncate">{value}</span>
                </div>
            ))}
        </div>
    );

    return (
        <ConfirmModal
            isOpen={isOpen}
            title="Confirm booking request?"
            message={
                <>
                    <p className="text-sm text-center font-medium text-text-brown-light mb-2 normal-case">
                        Please review your session details. Your request will be reviewed by the peer mentor.
                    </p>
                    {confirmBody}
                </>
            }
            confirmLabel="Submit Booking"
            confirmClassName="bg-green-600 hover:bg-green-700"
            icon={ <FaCalendarCheck className="text-4xl text-green-600" /> }
            loading={submitting}
            onConfirm={onConfirm}
            onCancel={onCancel}
        />
    );
}