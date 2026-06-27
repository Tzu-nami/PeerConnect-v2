import { FaPlus, FaRotateLeft, FaXmark } from "react-icons/fa6";
import TimePicker from "../../ui/TimePicker";
import type { AvailabilityRow } from "@/types/admin";

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

interface Props {
    rows: AvailabilityRow[];
    onChange: (rows: AvailabilityRow[]) => void;
    errors?: string[];
}

const generateId = () => {
    if (typeof window !== 'undefined' && window.crypto && crypto.randomUUID) {
        return crypto.randomUUID();
    }
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

const inputClass = "w-full px-3 py-2 text-sm rounded-lg border border-cream-border bg-white text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-up-maroon/30 focus:border-up-maroon transition"

export default function AvailabilityScheduler({ rows, onChange, errors = [] }: Props) {
    const update = (index: number, field: keyof AvailabilityRow, value: any) => {
        const safeValue = value?.target?.value ?? value;
        const next = rows.map((r, i) => i === index ? {...r, [field]: safeValue }: r);
        onChange(next);
    };

    const addRow = () => {
        const last = rows[rows.length - 1] ?? {};
        const lastDay = (last as AvailabilityRow).day_of_week ?? '';
        onChange([...rows, { id: generateId(), day_of_week: lastDay, start_time: '', end_time: ''}]);
    };

    const removeRow = (index: number) => {
        onChange(rows.filter((_, i) => i !== index));
    };

    const clearAll = () => {
        onChange([{ id: generateId(), day_of_week: '', start_time: '', end_time: ''}]);
    };

    return (
        <div>
            <div className="grid grid-cols-[1fr_1fr_1fr_auto] gap-2 px-1 mb-1">
                {['Day', 'Start Time', 'End Time', ''].map((label, i) => (
                    <label key={i} className="text-[10px] font-bold text-text-brown-light uppercase">{label}</label>
                ))}
            </div>

            {/* Rows */}
            <div className="space-y-2">
                {rows.map((row, index) => (
                    <div key={row.id} className="grid grid-cols-[1fr_1fr_1fr_auto] gap-2 items-center">
                        <select 
                            value={row.day_of_week}
                            onChange={(e) => update(index, 'day_of_week', e.target.value)}
                            className={`${inputClass} cursor-pointer`}
                        >
                            <option value="" disabled hidden>- Day -</option>
                            {DAYS.map((d) => (
                                <option key={d} value={d}>{d.charAt(0).toUpperCase() + d.slice(1)}</option>
                            ))}
                        </select>

                        <TimePicker
                            value={row.start_time}
                            onChange={(v) => update(index, 'start_time', v)}
                            placeholder="Start"
                        />

                        <TimePicker
                            value={row.end_time}
                            onChange={(v) => update(index, 'end_time', v)}
                            placeholder="End"
                        />

                        <div className="flex items-center justify-center">
                            {rows.length > 1 ? (
                                <button
                                    type="button"
                                    onClick={() => removeRow(index)}
                                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-50 text-red-400 hover:bg-red-100 hover:text-red-600 transition"
                                    title="Remove time slot"
                                >
                                    <FaXmark className="text-xs" />
                                </button>
                            ) : <div className="w-8" />}
                        </div>
                    </div>
                ))}
            </div>
            
            {/* Actions */}
            <div className="flex items-center justify-between px-1 mt-3">
                <button type="button" onClick={addRow} className="flex items-center gap-1.5 text-xs font-bold text-text-brown hover:text-text-brown-light transition cursor-pointer">
                    <FaPlus className="text-[10px]"/> Add more days or time slots
                </button>
                <button type="button" onClick={clearAll} className="flex items-center gap-1.5 text-xs font-bold text-red-600 hover:text-red-800 transition cursor-pointer" title="Clear All Availabilities">
                    <FaRotateLeft className="text-[10px]" />
                </button>
            </div>

            {/* Error message */}
            {errors.length > 0 && (
                <div className="mt-2 p-3 rounded-lg bg-red-50 border border-red-200">
                    <p className="text-xs text-red-700 font-medium leading-relaxed">
                        Please check if all slots are filled out properly or if there are overlapping time slots on the same day.
                    </p>
                </div>
            )}
        </div>
    );
}