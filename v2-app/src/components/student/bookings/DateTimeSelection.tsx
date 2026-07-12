import TimePicker from '@/components/ui/TimePicker';
import type { BookingFormState } from './BookingForm';

interface DateTimeSelectionProps {
    date: string;
    schedule_start: string;
    schedule_end: string;
    dateError: string;
    startTimeError: string;
    endTimeError: string;
    errors: Record<string, string>;
    updateField: <K extends keyof BookingFormState>(key: K, value: BookingFormState[K]) => void;
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

export default function DateTimeSelection({
    date, schedule_start, schedule_end, dateError, startTimeError, endTimeError, errors, updateField
}: DateTimeSelectionProps) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Date Input */}
            <div>
                <StepHeader n={4} label="Preferred Date" />
                <input
                    type="date"
                    value={date}
                    min={new Date(Date.now() + 86400000).toISOString().split('T')[0]}
                    onChange={(e) => {
                        updateField('date', e.target.value);
                    }}
                    className={`w-full px-3 py-2 text-sm rounded-lg border border-cream-border bg-white text-text-brown focus:outline-none focus:ring-2 focus:ring-up-maroon/30 focus:border-up-maroon transition disabled:text-slate-400 disabled:bg-gray-50`}
                />
                {(errors.date || dateError) && <p className="mt-1 text-xs text-red-600">{errors.date || dateError}</p>}
            </div>

            {/* Start time */}
            <div>
                <StepHeader n={5} label="Start Time" />
                <TimePicker
                    value={schedule_start}
                    onChange={(v) => { updateField('schedule_start', v); }}
                    placeholder="Start time"
                />
                {(errors.schedule_start || startTimeError) && <p className="mt-1 text-xs text-red-600">{errors.schedule_start || startTimeError}</p>}
            </div>

            {/* End time */}
            <div>
                <StepHeader n={6} label="End Time" />
                <TimePicker
                    value={schedule_end}
                    onChange={(v) => { updateField('schedule_end', v); }}
                    placeholder="End time"
                />
                {(errors.schedule_end || endTimeError) && <p className="mt-1 text-xs text-red-600">{errors.schedule_end || endTimeError}</p>}
            </div>
        </div>
    );
}