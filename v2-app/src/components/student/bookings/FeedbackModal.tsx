import { useState } from 'react';
import { LikertStep, BoolStep } from './FeedbackStep';
import type { CompletedBookingForFeedback, FeedbackFormState } from '@/types/bookings';
import CrudModal from '@/components/ui/CrudModal';

// Icons
import { FaClipboardList, FaForwardStep, FaSpinner, FaPenToSquare, FaPaperPlane } from 'react-icons/fa6';

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
    const [step, setStep]     = useState(1);
    const [form, setForm]     = useState<FeedbackFormState>(EMPTY_FORM);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);

    // Format date to display
    const dateFormatted = new Date(booking.date + 'T00:00:00').toLocaleDateString('en-US', {
        weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
    });

    // Question handling
    const setRating = (key: string, value: number) => {
        setForm((f) => ({ ...f, [key]: value }));
        setErrors((e) => ({ ...e, [key]: '' }));
    };
    const validateStep = (s: number): boolean => {
        const errs: Record<string, string> = {};
        if (s === 1) {
            ['q1','q2','q3','q4','q5'].forEach((k) => {
                if (!form[k as keyof FeedbackFormState])
                errs[k] = `Please rate this question.`;
            });
        } else if (s === 2) {
            ['q6','q7','q8','q9'].forEach((k) => {
                if (!form[k as keyof FeedbackFormState])
                errs[k] = `Please rate this question.`;
            });
            if (form.q10 === null) errs.q10 = 'Please answer this question.';
        }
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };
    const handleNext = () => { if (validateStep(step)) setStep((s) => s + 1); };
    const handleBack = () => { setStep((s) => s - 1); setErrors({}); };

    // Submit
    const handleSubmit = async () => {
        if (!validateStep(3)) return;
        setLoading(true);
        try {
            const r = await fetch('/api/bookings/feedback', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ booking_id: booking.id, skip: false, ...form }),
            });
            if (!r.ok) {
                const data = await r.json();
                setErrors(data.errors ?? { general: 'Submission failed. Please try again.' });
                return;
            }
            onDone();
        } finally {
            setLoading(false);
        }
    };
    // Skip
    const handleSkip = async () => {
        setLoading(true);
        try {
            await fetch('/api/bookings/feedback', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ booking_id: booking.id, skip: true }),
            });
            onDone();
        } finally {
            setLoading(false);
        }
    };

    const ProgressBar = () => (
        <div className="flex items-center gap-2 mb-6">
        {[1, 2, 3].map((s) => (
            <div
            key={s}
            className={`h-1.5 flex-1 rounded-full transition-colors ${
                s < step ? 'bg-green-500' : s === step ? 'bg-green-400' : 'bg-gray-200'
            }`}
            />
        ))}
        <span className="text-[10px] font-bold text-gray-400 whitespace-nowrap">Step {step} / 3</span>
        </div>
    );

    // Session summary
    const SessionSummary = () => (
        <div className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 grid grid-cols-2 gap-x-4 gap-y-2 text-xs mb-5">
            <div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Subject</span>
                <span className="font-semibold text-gray-700">
                {booking.subject_code}{booking.subject_name ? ` — ${booking.subject_name}` : ''}
                </span>
            </div>
            <div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Mentor</span>
                <span className="font-semibold text-gray-700">{booking.mentor_name}</span>
            </div>
            <div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Date</span>
                <span className="font-semibold text-gray-700">{dateFormatted}</span>
            </div>
            <div className="min-w-0">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Topic</span>
                <span className="font-semibold text-gray-700 truncate block" title={booking.topic}>{booking.topic}</span>
            </div>
        </div>
    );

    // Title
    const modalTitle = phase === 'prompt' ? "Session Completed!" : "Feedback Form";
    const modalSubtitle = phase === 'prompt' 
        ? "Your enrichment session has ended. Help us improve by sharing your experience."
        : `Step ${step} of 3 — Please rate your enrichment session experience.`;
    const renderFooter = () => {
        if (phase === 'prompt') {
            return (
                <div className="flex flex-col gap-3 w-full">
                    <button
                        type="button"
                        onClick={() => setPhase('form')}
                        className="w-full py-2.5 rounded-xl text-sm font-bold bg-green-600 hover:bg-green-700 text-white transition flex items-center justify-center gap-2 shadow-sm"
                    >
                        <FaClipboardList className="text-lg" />
                        Answer Feedback Form
                    </button>
                    <button
                        type="button"
                        onClick={handleSkip}
                        disabled={loading}
                        className="w-full py-2 rounded-xl text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        {loading ? (
                            <><FaSpinner className="animate-spin" /> Skipping...</>
                        ) : (
                            <><FaForwardStep /> Skip for now</>
                        )}
                    </button>
                    <p className="text-[10px] text-gray-400 text-center leading-snug">
                        Skipping will dismiss this prompt permanently for this session.<br />
                        You will not be asked again for this specific session.
                    </p>
                </div>
            );
        }

        // Footer form
        return (
            <div className="flex gap-3 w-full">
                {step > 1 && (
                    <button
                        type="button"
                        onClick={handleBack}
                        disabled={loading}
                        className="flex-1 py-2.5 rounded-xl text-sm font-bold bg-gray-100 text-gray-600 hover:bg-gray-200 transition disabled:opacity-50"
                    >
                        Back
                    </button>
                    )}

                    {step < 3 && (
                    <button
                        type="button"
                        onClick={handleNext}
                        className="flex-1 py-2.5 rounded-xl text-sm font-bold bg-green-600 hover:bg-green-700 text-white transition shadow-sm"
                    >
                        Continue
                    </button>
                    )}

                    {step === 3 && (
                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={loading}
                        className="flex-1 py-2.5 rounded-xl text-sm font-bold bg-green-600 hover:bg-green-700 text-white transition shadow-sm disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {loading ? (
                        <><FaSpinner className="animate-spin" /> Submitting...</>
                        ) : (
                        <><FaPaperPlane />Submit Feedback</>
                        )}
                    </button>
                )}
            </div>
        );
    };

    return (
        <CrudModal
            open={isOpen}
            title={modalTitle}
            subtitle={modalSubtitle}
            maxWidth="max-w-4xl"
            footer={renderFooter()}
        >
            <SessionSummary />
            {phase === 'prompt' && (
                <p className="text-sm text-gray-600 leading-relaxed mb-4">
                Your session has been completed! We'd love to hear how it went.
                Your feedback helps improve the peer mentoring program.
                <br /><br />
                <span className="font-semibold text-gray-700">Would you like to answer the Feedback Form?</span>
                {' '}It only takes a minute, and it's completely optional.
                </p>
            )}

            {phase === 'form' && (
                <div className="-mt-2">
                    <ProgressBar />
                    {/* Q1-5 */}
                    {step === 1 && (
                        <LikertStep
                        questions={LIKERT_QUESTIONS.slice(0, 5)}
                        values={form as any}
                        onChange={setRating}
                        errors={errors}
                        />
                    )}

                    {/* Q6–Q10 */}
                    {step === 2 && (
                        <div className="space-y-5">
                        <LikertStep
                            questions={LIKERT_QUESTIONS.slice(5, 9)}
                            values={form as any}
                            onChange={setRating}
                            errors={errors}
                        />
                        <BoolStep
                            question={BOOL_QUESTION}
                            value={form.q10}
                            onChange={(v) => { setForm((f) => ({ ...f, q10: v })); setErrors((e) => ({ ...e, q10: '' })); }}
                            error={errors.q10}
                        />
                        </div>
                    )}

                    {/* Feedback remarks */}
                    {step === 3 && (
                        <div>
                        <p className="text-sm font-bold text-gray-700 mb-1 flex items-center gap-2">
                            <FaPenToSquare className="text-green-500" />
                            Additional Remarks
                            <span className="font-normal text-gray-400 text-xs">(optional)</span>
                        </p>
                        <p className="text-xs text-gray-400 mb-4">
                            Any other thoughts about the session? This is optional — you can submit without filling this in.
                        </p>
                        <textarea
                            value={form.feedback}
                            onChange={(e) => setForm((f) => ({ ...f, feedback: e.target.value }))}
                            placeholder="Share your thoughts about the session — what went well, what could be improved, or any other comments for your mentor..."
                            rows={5}
                            maxLength={2000}
                            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-green-400 resize-none transition-shadow"
                        />
                        <p className="text-xs text-gray-400 mt-1 text-right">{form.feedback.length} / 2000</p>
                        {errors.feedback && <p className="mt-1 text-xs text-red-600">{errors.feedback}</p>}
                        {errors.general && <p className="mt-1 text-xs text-red-600">{errors.general}</p>}
                        </div>
                    )}
                </div>
            )}
        </CrudModal>
    );
}