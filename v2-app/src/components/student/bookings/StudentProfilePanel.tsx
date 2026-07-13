import { useState } from 'react';
import type { College, DegreeProgram, YearLevel, StudentProfile } from '@/types/bookings';
import { MdKeyboardArrowDown } from 'react-icons/md';

interface StudentProfilePanelProps {
    profile: StudentProfile | null;
    colleges: College[];
    degreePrograms: DegreeProgram[];
    yearLevels: YearLevel[];
    onSaved: (profile: StudentProfile) => void;
}

function StepHeader({ n, label }: { n: number; label: React.ReactNode }) {
    return (
        <div className="flex items-center mb-2">
            <span className="w-4 h-4 rounded-full bg-up-maroon text-white text-xs flex items-center justify-center">
                {n}
            </span>
            <p className="text-xs font-bold pl-2.5 text-text-white-light uppercase tracking-wider flex items-center gap-2">
                {label}
            </p>
            <span className="text-red-500">*</span>
        </div>
    );
}

export default function StudentProfilePanel({ profile, colleges, degreePrograms, yearLevels, onSaved }: StudentProfilePanelProps) {
    const [open, setOpen]               = useState(!profile); 
    const [locked, setLocked]           = useState(!!profile);
    const [showSuccess, setShowSuccess] = useState(false);
    const [loading, setLoading]         = useState(false);
    const [errors, setErrors]           = useState<Record<string,string>>({});
    const [form, setForm]               = useState<StudentProfile>(
        profile ?? { student_num: '', college_id: '', degreeProgram_id: '', yearLevel_id: '' } as StudentProfile
    );
    const [original, setOriginal] = useState(form);
    const filteredDegrees = degreePrograms.filter((d) => String(d.college_id) === String(form.college_id));

    // Edit form disabled
    const hasChanges =
        String(form.student_num)      !== String(original.student_num) ||
        String(form.college_id)       !== String(original.college_id) ||
        String(form.degreeProgram_id) !== String(original.degreeProgram_id) ||
        String(form.yearLevel_id)     !== String(original.yearLevel_id);
    const isValidStudentNum = /^\d{4}-\d{5}$/.test(form.student_num);
    const isComplete = !!(isValidStudentNum && form.college_id && form.degreeProgram_id && form.yearLevel_id);

    // Degree program dropdown
    const handleCollegeChange = (college_id: string) => {
        setForm((f) => ({ ...f, college_id, degreeProgram_id: '' }));
        setErrors((e) => ({ ...e, college_id: '' }));
    };

    const handleSave = async () => {
        setErrors({});
        setLoading(true);
        try {
            const r = await fetch('/api/bookings/profile', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });
            const data = await r.json();
            if (!r.ok) {
                setErrors(data.errors ?? {});
                return;
            }
            setOriginal(form);
            setLocked(true);
            setOpen(false);
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 5000);
            onSaved(form);
        } finally {
            setLoading(false);
        }
    };
    const inputClass = "w-full px-3 py-2 text-sm rounded-lg border border-white-border bg-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-up-maroon/30 focus:border-up-maroon transition disabled:text-slate-400 disabled:bg-gray-50";
    return (
        <div className="bg-white rounded-xl border border-white-border overflow-hidden mb-7">
            <button
                onClick={() => setOpen((v) => !v)}
                type="button"
                className="w-full flex items-center justify-between px-5 py-3 text-left hover:bg-white-hover transition-colors cursor-pointer"
            >
                <span className="font-bold text-lg text-text-primary">Student Profile</span>
                    <MdKeyboardArrowDown
                    className={`w-6 h-6 text-text-white-light transition-transform duration-200 ${open ? 'rotate-180' : ''}`} 
                />
            </button>

            {open && (
                <div className="px-5 py-3">
                    {showSuccess && (
                        <div className="mb-4 text-sm font-semibold text-green-700 bg-green-50 border border-green-200 rounded-xl px-3 py-2">
                            Profile Updated!
                        </div>
                    )}
                    <div className="space-y-3">
                        <div>
                            <StepHeader n={1} label="Student Number" />
                            <input
                                type="text"
                                value={form.student_num}
                                disabled={locked}
                                maxLength={10}
                                onChange={(e) => {
                                    const v = e.target.value.replace(/[^0-9\-]/g, '').slice(0, 10);
                                    setForm((f) => ({ ...f, student_num: v }));
                                    if (v.length > 0 && !/^\d{4}-\d{5}$/.test(v)) {
                                        setErrors((err) => ({ ...err, student_num: 'Format must be XXXX-XXXXX' }));
                                    } else {
                                        setErrors((err) => ({ ...err, student_num: '' }));
                                    }
                                }}
                                placeholder="e.g. 2023-00000"
                                className={`${inputClass} text-text-primary`}
                            />
                            {errors.student_num && <p className="mt-1 text-xs text-red-600">{errors.student_num}</p>}
                        </div>

                        <div>
                            <StepHeader n={2} label="College" />
                            <div className="grid grid-cols-3 gap-2">
                                {colleges.map((c) => (
                                    <button
                                        key={c.id}
                                        type="button"
                                        disabled={locked}
                                        onClick={() => handleCollegeChange(c.id)}
                                        className={`py-2 px-2 text-xs font-bold rounded-lg border transition-colors ${
                                            form.college_id === c.id
                                                ? 'bg-white-complement text-text-primary border-white-dot shadow-sm'
                                                : 'bg-white text-text-primary border-white-border hover:bg-white-hover disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed disabled:hover:bg-white'
                                        }`}
                                    >
                                        {c.code}
                                    </button>
                                ))}
                            </div>
                            {errors.college_id && <p className="mt-1 text-xs text-red-600">{errors.college_id}</p>}
                        </div>

                        <div>
                            <StepHeader n={3} label="Degree Program" />
                            <select
                                value={form.degreeProgram_id}
                                disabled={!form.college_id || locked}
                                onChange={(e) => { setForm((f) => ({ ...f, degreeProgram_id: e.target.value })); setErrors((err) => ({ ...err, degreeProgram_id: '' })); }}
                                className={`${inputClass} ${!form.degreeProgram_id ? 'text-slate-400' : 'text-text-primary'}`}
                            >
                                <option value="" disabled>--- Degree Program ---</option>
                                {filteredDegrees.map((d) => (
                                <option key={d.id} value={d.id}>{d.name}</option>
                                ))}
                            </select>
                            {errors.degreeProgram_id && <p className="mt-1 text-xs text-red-600">{errors.degreeProgram_id}</p>}
                        </div>

                        <div>
                            <StepHeader n={4} label="Year Level" />
                            <div className="grid grid-cols-5 gap-2">
                                {yearLevels.map((y) => {
                                    const rawName = y.name.toLowerCase();
                                    const displayName = rawName.includes('5th') 
                                        ? '5th +' 
                                        : y.name.replace(/ year/i, '').trim();
                                    return (
                                        <button
                                            key={y.id}
                                            type="button"
                                            disabled={locked}
                                            onClick={() => { 
                                                setForm((f) => ({ ...f, yearLevel_id: y.id })); 
                                                setErrors((err) => ({ ...err, yearLevel_id: '' })); 
                                            }}
                                            className={`py-2 px-1 text-xs font-bold rounded-lg border transition-colors ${
                                                String(form.yearLevel_id) === String(y.id)
                                                    ? 'bg-white-complement text-text-primary border-white-dot shadow-sm'
                                                    : 'bg-white text-text-primary border-white-border hover:bg-white-hover disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed disabled:hover:bg-white'
                                            }`}
                                        >
                                            {displayName}
                                        </button>
                                    );
                                })}
                            </div>
                            {errors.yearLevel_id && <p className="mt-1 text-xs text-red-600">{errors.yearLevel_id}</p>}
                        </div>

                        <div className="mt-5">
                            {locked ? (
                                <button
                                type="button"
                                onClick={() => setLocked(false)}
                                className="w-full flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer py-2.5 px-4 rounded-lg text-sm transition-colors font-semibold text-white bg-btn-brown hover:bg-btn-brown-hover rounded-lg shadow-md"
                                >
                                    Edit Profile
                                </button>
                            ) : (
                                <button
                                type="button"
                                onClick={handleSave}
                                disabled={!hasChanges || !isComplete || loading}
                                className="w-full flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer py-2.5 px-4 rounded-lg text-sm transition-colors font-semibold text-white bg-btn-brown hover:bg-btn-brown-hover rounded-lg shadow-md"
                                >
                                    {loading ? (
                                        <>
                                            Saving...
                                        </>
                                    ) : profile ? (
                                        'Update Profile'
                                    ) : (
                                        'Save Profile'
                                    )}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}