import { useState } from 'react';
import { LikertStep, BoolStep } from './FeedbackStep';
import type { CompletedBookingForFeedback, FeedbackFormState } from '@/types/bookings';
import CrudModal from '@/components/ui/CrudModal';

// Icons
import { FaForwardStep } from 'react-icons/fa6';
import { MdChat, MdSend } from 'react-icons/md';

// Questions
const LIKERT_QUESTIONS = [
    { key: 'q1', num: 1, text: 'The topics have been discussed very well.' },
    { key: 'q2', num: 2, text: 'I have learned a lot from the Tutorial Session.' },
    { key: 'q3', num: 3, text: 'The mentor is good enough in doing his/her tasks.' },
    { key: 'q4', num: 4, text: 'The mentor was able to clearly explain the topics I do not understand.' },
    { key: 'q5', num: 5, text: 'There were adequate exercises given.' },
    { key: 'q6', num: 6, text: 'The mentor has mastery of the subject matter.' },
    { key: 'q7', num: 7, text: 'The mentor introduces new techniques or simpler approach to the subject.' },
    { key: 'q8', num: 8, text: 'I will recommend the Tutorial Sessions to my classmates.' },
    { key: 'q9', num: 9, text: 'I am coming back to attend more Tutorial Sessions.' },
];
const BOOL_QUESTION = { key: 'q10' as const, num: 10, text: 'The peer mentor started the session on time.' };
const EMPTY_FORM: FeedbackFormState = {
    q1: null, q2: null, q3: null, q4: null, q5: null, q6: null, q7: null, q8: null, q9: null, q10: null, feedback: '',
};

interface FeedbackModalProps {
    isOpen: boolean;
    booking: CompletedBookingForFeedback;
    onDone: () => void;
}

export default function FeedbackModal({ isOpen, booking, onDone }: FeedbackModalProps) {
    const [phase, setPhase]   = useState<'prompt' | 'form'>('prompt');
    const [form, setForm]     = useState<FeedbackFormState>(EMPTY_FORM);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loadingAction, setLoadingAction] = useState<'none' | 'skip' | 'submit'>('none');

    // Format date to display
    const dateFormatted = new Date(booking.date + 'T00:00:00').toLocaleDateString('en-US', {
        weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
    });

    // Question handling
    const setRating = (key: string, value: number) => {
        setForm((f) => ({ ...f, [key]: value }));
        setErrors((e) => ({ ...e, [key]: '' }));
    };

    // Validation
    const validateForm = (): boolean => {
        const errs: Record<string, string> = {};
        ['q1','q2','q3','q4','q5','q6','q7','q8','q9'].forEach((k) => {
            if (!form[k as keyof FeedbackFormState]) errs[k] = `Please rate this question.`;
        });
        if (form.q10 === null) errs.q10 = 'Please answer this question.';
        
        setErrors(errs);
        
        if (Object.keys(errs).length > 0) {
            document.querySelector('.overflow-y-auto')?.scrollTo({ top: 0, behavior: 'smooth' });
        }
        
        return Object.keys(errs).length === 0;
    };

    // Submit
    const handleSubmit = async () => {
        if (!validateForm()) return;
        setLoadingAction('submit');
        try {
            const r = await fetch('/api/bookings/feedback', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ booking_id: booking.id, skip: false, ...form }),
            });
            if (!r.ok) {
                const data = await r.json();
                setErrors(data.errors ?? { general: data.error || 'Submission failed. Please try again.' });
                return;
            }
            onDone();
        } finally {
            setLoadingAction('none');
        }
    };

    // Skip
    const handleSkip = async () => {
        setLoadingAction('skip');
        try {
            await fetch('/api/bookings/feedback', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ booking_id: booking.id, skip: true }),
            });
            onDone();
        } finally {
            setLoadingAction('none');
        }
    };

    // Session summary
    const SessionSummary = () => (
        <div className="bg-white-hover border border-white-border rounded-xl px-4 py-3 grid grid-cols-2 gap-x-4 gap-y-2 mb-5">
            <div>
                <span className="text-xs font-bold uppercase tracking-wide text-text-white-light block">Subject</span>
                <span className="mt-1 text-sm font-semibold text-text-primary">
                {booking.subject_code}{booking.subject_name ? ` — ${booking.subject_name}` : ''}
                </span>
            </div>
            <div>
                <span className="text-xs font-bold uppercase tracking-wide text-text-white-light block">Mentor</span>
                <span className="mt-1 text-sm font-semibold text-text-primary">{booking.mentor_name}</span>
            </div>
            <div>
                <span className="text-xs font-bold uppercase tracking-wide text-text-white-light block">Date</span>
                <span className="mt-1 text-sm font-semibold text-text-primary">{dateFormatted}</span>
            </div>
            <div className="min-w-0">
                <span className="text-xs font-bold uppercase tracking-wide text-text-white-light block">Topic</span>
                <span className="mt-1 text-sm font-semibold text-text-primary" title={booking.topic}>{booking.topic}</span>
            </div>
        </div>
    );

    const renderFooter = () => {
        if (phase === 'prompt') {
            return (
                <div>
                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={handleSkip}
                            disabled={loadingAction !== 'none'}
                            className="flex-1 flex items-center justify-center px-4 py-2 text-sm font-semibold text-text-primary bg-white border border-white-border rounded-lg hover:bg-white-dark cursor-pointer transition"
                        >
                            {loadingAction === 'skip' ? (
                                <>Skipping...</>
                            ) : (
                                <>Skip for now <FaForwardStep className="ml-2"/></>
                            )}
                        </button>
                        <button
                            type="button"
                            onClick={() => setPhase('form')}
                            className="flex-1 flex justify-center px-4 py-2 text-sm font-semibold text-white bg-btn-gray hover:bg-btn-gray-hover rounded-lg shadow-md disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition"
                        >
                            Answer Feedback Form
                        </button>
                    </div>
                    <div className="flex gap-3 justify-center mt-4">
                        <p className="text-[10px] text-text-muted text-center leading-snug">
                            Skipping will dismiss this form. You will not be asked again for this specific session.
                        </p>
                    </div>
                </div>
            );
        }

        return (
            <div className="flex gap-3 w-full">
                <button
                    type="button"
                    onClick={handleSkip}
                    disabled={loadingAction !== 'none'}
                    className="flex-1 flex items-center justify-center px-4 py-2 text-sm font-semibold text-text-primary bg-white border border-white-border rounded-lg hover:bg-white-dark cursor-pointer transition"
                >
                    {loadingAction === 'skip' ? (
                        <>Skipping...</>
                    ) : (
                        <>Skip for now <FaForwardStep className="ml-2"/></>
                    )}
                </button>
                <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={loadingAction !== 'none'}
                    className="flex-1 flex items-center justify-center px-4 py-2 text-sm font-semibold text-white bg-btn-gray hover:bg-btn-gray-hover rounded-lg shadow-md disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition"
                >
                    {loadingAction == 'submit' ? (
                        <>Submitting...</>
                    ) : (
                        <>Submit Feedback <MdSend className="ml-2"/></>
                    )}
                </button>
            </div>
        );
    };

    return (
        <CrudModal
            open={isOpen}
            title="Feedback Form"
            subtitle="Your enrichment session has been completed! Help us improve our tutoring services by evaluating your experience."
            maxWidth="max-w-4xl"
            footer={renderFooter()}
        >
            <SessionSummary />
            
            {phase === 'prompt' && (
                <p className="text-sm text-text-muted">
                    <span className="font-extrabold text-text-primary">Would you like to answer the Feedback Form?</span> This will help us give students the highest quality of our tutoring services.
                </p>
            )}

            {phase === 'form' && (
                <div className="space-y-3 mt-2">
                    
                    {/* Q1-9 */}
                    <LikertStep
                        questions={LIKERT_QUESTIONS}
                        values={form as any}
                        onChange={setRating}
                        errors={errors}
                    />
                    
                    {/* Q10 */}
                    <BoolStep
                        question={BOOL_QUESTION}
                        value={form.q10}
                        onChange={(v) => { setForm((f) => ({ ...f, q10: v })); setErrors((e) => ({ ...e, q10: '' })); }}
                        error={errors.q10}
                    />

                    {/* Feedback remarks */}
                    <div className="pt-2 mt-5">
                        <p className="text-sm font-semibold mb-1 leading-tight flex items-center gap-1">
                            <MdChat className="text-blue-700" />
                            Additional Remarks
                            <span className="text-text-white-light">(optional)</span>
                        </p>
                        <p className="text-xs text-text-white-light mb-4">
                            Any other thoughts about the session? You can submit without filling this in.
                        </p>
                        <textarea
                            value={form.feedback}
                            onChange={(e) => setForm((f) => ({ ...f, feedback: e.target.value }))}
                            placeholder="Share your thoughts about the session — what went well, what could be improved, or any other comments for your mentor..."
                            rows={5}
                            maxLength={2000}
                            className="w-full px-3 py-2 text-sm rounded-lg border border-white-border bg-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-up-maroon/30 focus:border-up-maroon transition disabled:text-slate-400 disabled:bg-gray-50 resize-y break-words overflow-y-auto"
                        />
                        <p className="text-xs text-text-white-light mt-1 text-right">{form.feedback.length} / 2000</p>
                        {errors.feedback && <p className="mt-1 text-xs text-red-600">{errors.feedback}</p>}
                        {errors.general && <p className="mt-1 text-xs text-red-600">{errors.general}</p>}
                    </div>
                </div>
            )}
        </CrudModal>
    );
}