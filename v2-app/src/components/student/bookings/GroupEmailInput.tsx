import { useEffect } from 'react';
import { MdAdd, MdClose, MdWarning } from 'react-icons/md';

interface GroupEmailInputProps {
    emails: string[];
    onChange: (emails: string[]) => void;
    modeName: string;
    error?: string;
}

function getLimits(modeName: string): { min: number; max: number } {
    const name = modeName.toLowerCase();
    if (name.includes('small group')) return { min: 1, max: 4 };
    if (name.includes('large group')) return { min: 5, max: 13 };
    return { min: 1, max: 1 };
}

export default function GroupEmailInput({ emails, onChange, modeName, error }: GroupEmailInputProps) {
    const { min, max } = getLimits(modeName);

    useEffect(() => {
        const active = emails.filter((e) => e.trim() !== '');
        if (active.length < min) {
            onChange([...active, ...Array(min - active.length).fill('')]);
        }
        else if (active.length > max) {
            onChange(active.slice(0, max));
        }
        else if (active.length !== emails.length) {
            onChange(active);
        }
    }, [modeName, min, max]);
    const updateEmail = (index: number, value: string) => {
        const next = [...emails];
        next[index] = value;
        onChange(next);
    };

    const addEmail = () => onChange([...emails, '']);
    const removeEmail = (index: number) => onChange(emails.filter((_, i) => i !== index));

    const filled = emails.filter((e) => e.trim() !== '').length;
    const meetsMin = filled >= min;

    return (
        <div className="mt-3 p-4 bg-white-complement border border-white-border rounded-lg animate-[slide-down_0.6s_ease-out]">
            <div className="flex items-center justify-between mb-1">
                <label className="text-sm font-bold text-blue-900">Group Members (UP Mails)</label>
                <span className={`text-[10px] font-medium px-2 py-1 rounded ${meetsMin && filled <= max ? 'bg-green-200 text-green-800' : 'bg-blue-200 text-blue-800'}`}>
                    {filled} / {max} added
                </span>
            </div>
            <p className="text-[10px] text-blue-700 mb-3 leading-tight">
                Add the UP Mails of the students joining you.{' '}
                {min > 0 } You must add at least {min} member{min !== 1 ? 's' : ''}.
            </p>
            <div className="space-y-2 mb-3">
                {emails.map((email, index) => (
                <div key={index} className="flex items-center gap-2">
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => updateEmail(index, e.target.value)}
                        className="w-full px-3 py-2 text-sm rounded-lg border border-white-border bg-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-up-maroon/30 focus:border-up-maroon transition disabled:text-slate-400 disabled:bg-gray-50"
                        placeholder="student@up.edu.ph"
                    />
                    {emails.length > min && (
                        <button
                            type="button"
                            onClick={() => removeEmail(index)}
                            className="text-red-400 hover:text-red-600 transition flex-shrink-0 w-6 flex justify-center"
                            title="Remove student"
                        >
                            <MdClose className="text-lg" />
                        </button>
                    )}
                </div>
                ))}
            </div>

            {emails.length < max && (
                <button
                type="button"
                onClick={addEmail}
                className="text-xs font-medium text-blue-700 hover:text-blue-800 transition flex items-center"
                >
                    <MdAdd className="mr-1" /> Add Student
                </button>
            )}
            {error && (
                <span className="text-xs text-red-600 flex items-center mt-2 font-medium">
                    <MdWarning className="mr-1" /> {error}
                </span>
            )}
        </div>
    );
}