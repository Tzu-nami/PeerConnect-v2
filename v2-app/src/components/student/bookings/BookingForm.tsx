import { useState, useMemo, useCallback, useEffect } from 'react';
import DateTimeSelection from './DateTimeSelection';
import MentorSelection from './MentorSelection';
import GroupEmailInput from './GroupEmailInput';
import ConfirmBookingModal from './ConfirmBookingModal';
import { toast } from 'sonner';
import type { BookingMentor, MentorAvailability, MentorBookedSlot, MentorSubjectLink, TutorialMode } from '@/types/bookings';
import type { Subject } from '@/types/mentor';

const SESSION_MIN = '08:00';
const SESSION_MAX = '18:00';

export interface BookingFormState {
    mentor_id: string;
    subject_id: string;
    topic: string;
    tutorialMode_id: string;
    date: string;
    schedule_start: string;
    schedule_end: string;
    group_emails: string[];
}

interface BookingFormProps {
    mentors: BookingMentor[];
    availabilities: MentorAvailability[];
    bookedSlots: MentorBookedSlot[];
    mentorSubjects: MentorSubjectLink[];
    subjects: Subject[];
    tutorialModes: TutorialMode[];
    lockedMentorId?: string;
    hasProfile: boolean;
    onSuccess: () => void;
    userRole?: string;
}

function getDayOfWeek(dateStr: string): string {
    const days = ['sunday','monday','tuesday','wednesday','thursday','friday','saturday'];
    return days[new Date(dateStr + 'T00:00:00').getDay()];
}

function StepHeader({ n, label }: { n: number; label: React.ReactNode }) {
    return (
        <div className="flex items-center mb-2">
            <span className="w-4 h-4 rounded-full bg-up-maroon text-white text-xs flex items-center justify-center">
                {n}
            </span>
            <p className="text-xs font-bold pl-2.5 text-text-brown-light uppercase tracking-wider flex items-center gap-2">
                {label}
            </p>
            <span className="text-red-500">*</span>
        </div>
    );
}

export default function BookingForm({
    mentors, availabilities, bookedSlots, mentorSubjects, subjects, tutorialModes, lockedMentorId, hasProfile, onSuccess, userRole
}: BookingFormProps) {
    const [form, setForm] = useState<BookingFormState>({
        mentor_id: lockedMentorId ?? '',
        subject_id: '', topic: '', tutorialMode_id: '',
        date: '', schedule_start: '', schedule_end: '',
        group_emails: [],
    });
    const isMentorLocked = !!lockedMentorId;
    const [errors, setErrors]   = useState<Record<string,string>>({});
    const [dateError, setDateError] = useState('');
    const [startTimeError, setStartTimeError] = useState('');
    const [endTimeError, setEndTimeError]     = useState('');
    const [showConfirm, setShowConfirm] = useState(false);
    const [submitting, setSubmitting]   = useState(false);
    const [validating, setValidating]   = useState(false);
    
    // Booking form post field
    const updateField = <K extends keyof BookingFormState>(key: K, value: BookingFormState[K]) => {
        setForm((f) => ({ ...f, [key]: value }));
        setErrors((e) => ({ ...e, [key]: '' }));
    };

    // Check mode of tutorial
    const selectedMode = tutorialModes.find((m) => String(m.id) === String(form.tutorialMode_id));
    const modeName = selectedMode?.mode ?? '';
    const isGroupTutorial = modeName.toLowerCase().includes('small group') || modeName.toLowerCase().includes('large group');

    // Filter mentors based on inputs
    const filteredMentors = useMemo(() => {
        if (isMentorLocked && lockedMentorId) {
            return mentors.filter((m) => m.profile_id === lockedMentorId);
        }
        let result = [...mentors];
        // Subject filter
        if (form.subject_id) {
            const validIds = mentorSubjects
                .filter((s) => String(s.subject_id) === String(form.subject_id)) 
                .map((s) => String(s.mentorProfile_id));
            result = result.filter((m) => validIds.includes(String(m.profile_id)));
        }
        // Date filter
        if (form.date && (!form.mentor_id || form.mentor_id === 'any')) {
            const dayChosen = getDayOfWeek(form.date);
            result = result.filter((m) => {
                const avails = availabilities.filter(
                    (a) => a.mentorProfile_id === m.profile_id && a.day_of_week === dayChosen
                );
                if (avails.length === 0) return false;
                if (form.schedule_start && form.schedule_end) {
                    return avails.some(
                        (a) => a.start_time.substring(0,5) <= form.schedule_start &&
                            a.end_time.substring(0,5) >= form.schedule_end
                    );
                }
                return true;
            });
        }
    return result;
    }, [mentors, mentorSubjects, availabilities, form.subject_id, form.date, form.schedule_start, form.schedule_end, form.mentor_id, isMentorLocked, lockedMentorId]);

    useEffect(() => {
        if (!form.mentor_id || isMentorLocked) return;

        const isStillValid = form.mentor_id === 'any'
            ? filteredMentors.length > 0
            : filteredMentors.some((m) => String(m.profile_id) === String(form.mentor_id));

        if (!isStillValid) {
            setForm((f) => ({ ...f, mentor_id: '' }));
            setErrors((e) => ({ ...e, mentor_id: '' }));
        }
    }, [filteredMentors, form.mentor_id, isMentorLocked]);

    // Filter subjects based on locked mentor
    const filteredSubjects = useMemo(() => {
        if (!isMentorLocked || !lockedMentorId) return subjects;
        const mentorCanTeach = mentorSubjects
            .filter((ms) => String(ms.mentorProfile_id) === String(lockedMentorId))
            .map((ms) => String(ms.subject_id));

        return subjects.filter((s) => mentorCanTeach.includes(String(s.id)));
    }, [isMentorLocked, lockedMentorId, mentorSubjects, subjects]);

    // Date error handlings
    const validateDate = useCallback((value: string) => {
        setDateError('');
        if (!value) return;
        const d = new Date(value + 'T00:00:00');
        if (d.getDay() === 0) { setDateError('The session cannot be on a Sunday.'); return; }
        if (form.mentor_id && form.mentor_id !== 'any') {
            const day = getDayOfWeek(value);
            const avails = availabilities.filter(
                (a) => a.mentorProfile_id === form.mentor_id && a.day_of_week === day
            );
            if (avails.length === 0) setDateError('This mentor is not available on this day.');
        }
    }, [form.mentor_id, availabilities]);

    // Time error handlings
    const validateTime = useCallback((start: string, end: string) => {
        setStartTimeError('');
        setEndTimeError('');

        if (start && (start < SESSION_MIN || start >= SESSION_MAX)) {
            setStartTimeError('Sessions must be scheduled between 8:00 AM and 6:00 PM.'); return;
        }
        if (end && (end <= SESSION_MIN || end > SESSION_MAX)) {
            setEndTimeError('Sessions must be scheduled between 8:00 AM and 6:00 PM.'); return;
        }
        if (start && end && end <= start) {
            setEndTimeError('End time must be later than start time.'); return;
        }
        // Mentor schedule fit check
        if (form.mentor_id && form.mentor_id !== 'any' && form.date) {
            const dayChosen = getDayOfWeek(form.date);
            const avails = availabilities.filter(
                (a) => a.mentorProfile_id === form.mentor_id && a.day_of_week === dayChosen
            );
            if (avails.length > 0 && (start || end)) {
                if (start && end) {
                    const fits = avails.some(
                        (a) => a.start_time.substring(0,5) <= start && a.end_time.substring(0,5) >= end
                    );
                    if (!fits) {
                        const startFits = avails.some((a) => start >= a.start_time.substring(0,5) && start < a.end_time.substring(0,5));
                        const endFits   = avails.some((a) => end > a.start_time.substring(0,5) && end <= a.end_time.substring(0,5));
                        if (!startFits) setStartTimeError('Start time does not fit the mentor schedule.');
                        if (!endFits)   setEndTimeError('End time does not fit the mentor schedule.');
                    }
                }
            }
        }

        // Conflict check
        if (form.mentor_id && form.mentor_id !== 'any' && form.date && (start || end)) {
            const conflicts = bookedSlots.filter((b) => {
                if (b.mentor_id !== form.mentor_id) return false;
                if (b.date !== form.date) return false;
                if (start && end) return b.start < end && b.end > start;
                return false;
            });
            if (conflicts.length > 0) {
                const msg = `This mentor already has a booked session`;
                if (!startTimeError && start) setStartTimeError(msg);
                if (!endTimeError && end)     setEndTimeError(msg);
            }
        }
    }, [form.mentor_id, form.date, availabilities, bookedSlots, startTimeError, endTimeError]);

    // Validations api
    const handleValidate = async () => {
        setErrors({});
        setValidating(true);
        try {
            const r = await fetch('/api/bookings/validate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                ...form,
                group_emails: form.group_emails.filter((e) => e.trim() !== ''),
                }),
            });
            const data = await r.json();
            if (!r.ok) {
                setErrors(data.errors ?? {});
                return;
            }
            setShowConfirm(true);
        } finally {
            setValidating(false);
        }
    };

    // Submit api
    const handleSubmit = async () => {
        setSubmitting(true);
        try {
            const r = await fetch('/api/bookings/bookings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({...form, group_emails: form.group_emails.filter((e) => e.trim() !== ''),
                }),
            });
            if (!r.ok) {
                const data = await r.json();
                const errorData = data.errors ?? { general: 'Booking failed.' };
                setErrors(errorData);
                setShowConfirm(false);
                if (errorData.general) toast.error(errorData.general);
                return;
            }
            setShowConfirm(false);
            onSuccess();
        } finally {
            setSubmitting(false);
        }
    }; 
    
    const isSubmitDisabled = !hasProfile || !!dateError || !!startTimeError || !!endTimeError || !form.subject_id || !form.topic || !form.tutorialMode_id || !form.date || !form.schedule_start || !form.schedule_end || !form.mentor_id || validating;

    const inputClass = "w-full px-3 py-2 text-sm rounded-lg border border-cream-border bg-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-up-maroon/30 focus:border-up-maroon transition disabled:text-slate-400 disabled:bg-gray-50";

    return (
        <div>
            <div className="px-4 sm:px-6 pb-6 pt-4 rounded-lg bg-cream rounded-xl border border-cream-border overflow-hidden">
                <div className="space-y-3">
                    {/* Tutorial Mode */}
                    <div>
                        <StepHeader n={1} label="Tutorial Mode" />
                        <div className="grid grid-cols-3 gap-4">
                            {tutorialModes.map((m) => (
                                <button
                                    key={m.id}
                                    type="button"
                                    onClick={() => { 
                                        setForm((f) => ({ ...f, tutorialMode_id : m.id })); 
                                        setErrors((err) => ({ ...err, tutorialMode_id: '' })); 
                                    }}
                                    className={`py-3 px-2 text-xs font-bold rounded-lg border transition-colors ${
                                        form.tutorialMode_id === m.id
                                            ? 'bg-cream-complement text-text-brown border-cream-dot shadow-sm'
                                            : 'bg-white text-text-brown border-cream-border hover:bg-cream-hover disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed disabled:hover:bg-cream'
                                    }`}
                                >
                                    {m.mode}
                                </button>
                            ))}
                        </div>
                        {errors.tutorialMode_id && <p className="mt-1 text-xs text-red-600">{errors.tutorialMode_id}</p>}
                    </div>

                    {/* Group emails */}
                    {isGroupTutorial && (
                        <GroupEmailInput
                            emails={form.group_emails}
                            onChange={(emails) => updateField('group_emails', emails)}
                            modeName={modeName}
                            error={errors.group_emails}
                        />
                    )}

                    {/* Subject */}
                    <div>
                        <StepHeader n={2} label="Subject" />
                        <select
                            value={form.subject_id}
                            onChange={(e) => { updateField('subject_id', e.target.value); if (!isMentorLocked) updateField('mentor_id', ''); }}
                            className={`${inputClass} ${!form.subject_id ? 'text-slate-400' : 'text-text-brown'}`}
                        >
                            <option value="" disabled>--- Select a Subject ---</option>
                            {filteredSubjects.map((s) => (
                                <option key={s.id} value={s.id}>{s.code.toUpperCase()} - {s.name}</option>
                            ))}
                        </select>
                        {errors.subject_id && <p className="mt-1 text-xs text-red-600">{errors.subject_id}</p>}
                    </div>

                    {/* Mentor */}
                    <MentorSelection 
                        mentor_id={form.mentor_id}
                        date={form.date}
                        isMentorLocked={isMentorLocked}
                        filteredMentors={filteredMentors}
                        availabilities={availabilities}
                        bookedSlots={bookedSlots}
                        error={errors.mentor_id}
                        userRole={userRole}
                        updateField={updateField}
                    />

                    {/* Date time row */}
                    <DateTimeSelection
                        date={form.date}
                        schedule_start={form.schedule_start}
                        schedule_end={form.schedule_end}
                        dateError={dateError}
                        startTimeError={startTimeError}
                        endTimeError={endTimeError}
                        errors={errors}
                        updateField={updateField}
                        validateDate={validateDate}
                        validateTime={validateTime}
                    />

                    {/* Topic */}
                    <div>
                        <StepHeader n={7} label="Specific Topic" />
                        <textarea
                            value={form.topic}
                            onChange={(e) => updateField('topic', e.target.value)}
                            placeholder="e.g. Integration by Parts."
                            maxLength={255}
                            rows={3}
                            className={`${inputClass} text-text-brown resize-y break-words overflow-y-auto`}
                        />
                        {errors.topic && <p className="mt-1 text-xs text-red-600">{errors.topic}</p>}
                    </div>

                    {/* Submit */}
                    <div className="pt-4">
                        <button
                            type="button"
                            onClick={handleValidate}
                            disabled={isSubmitDisabled}
                            className="w-full flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer py-2.5 px-4 rounded-lg text-sm transition-colors font-semibold text-cream bg-btn-brown hover:bg-btn-brown-hover rounded-lg shadow-md"
                        >
                        {validating ? (
                            <>
                                Validating...
                            </>
                        ) : (
                            'Submit Booking Request'
                        )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Confirm */}
            <ConfirmBookingModal
                isOpen={showConfirm}
                form={form}
                subjects={subjects}
                tutorialModes={tutorialModes}
                filteredMentors={filteredMentors}
                submitting={submitting}
                onConfirm={handleSubmit}
                onCancel={() => setShowConfirm(false)}
            />
        </div>
    );
}