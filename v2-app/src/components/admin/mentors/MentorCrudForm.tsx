import { useState, useRef, useEffect } from 'react';
import SubjectChecklist from './SubjectChecklist';
import AvailabilityScheduler from './AvailabilityScheduler';
import type { AvailabilityRow } from '@/types/admin';
import { FaCircleCheck, FaImage } from 'react-icons/fa6';

interface Subject { id: string; code: string; name: string; }

export interface MentorCrudForm {
    upMail?: string;
    verifiedUser?: { id: string; name: string; email: string } | null;
    firstName?: string;
    lastName?: string;
    middleInitial?: string;
    lockedEmail?: string;
    avatarPreview?: string;
    avatarFile: File | null;
    selectedSubjects: string[];
    availabilities: AvailabilityRow[];
}

interface Props {
    mode: 'create' | 'edit';
    formState: MentorCrudForm;
    subjects: Subject[];
    errors: Record<string, string>;
    onFormChange: (partial: Partial<MentorCrudForm>) => void;
    onCheckEmail?: () => Promise<void>;
    emailError?: string;
    isCheckingEmail?: boolean;
} 

const inputClass = "w-full px-3 py-2 text-sm rounded-lg border border-white-border bg-white text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-up-maroon/30 focus:border-up-maroon transition"

export default function MentorCrudForm({
    mode, formState, subjects, errors, onFormChange, onCheckEmail, emailError, isCheckingEmail,
}: Props) {
    // For avatar uploads and previews
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    useEffect(() => {
        if (formState.avatarFile) {
            const objectUrl = URL.createObjectURL(formState.avatarFile);
            setPreviewUrl(objectUrl);
            return () => URL.revokeObjectURL(objectUrl);
        }
        setPreviewUrl(formState.avatarPreview ?? null);
    }, [formState.avatarFile, formState.avatarPreview]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        onFormChange({ avatarFile: file });
    };

    return (
        <div className="flex flex-col gap-8">
            
            {/* Email/info, picture, subjects */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                <div className="space-y-8">
                    
                    {/* Personal Info */}
                    <div>
                        <StepHeader n={1} label={mode === 'create' ? "Student Email" : "Student Information"} />
                        
                        {mode === 'create' ? (
                            <div className="flex flex-col gap-2">
                                <input
                                    type="email"
                                    value={formState.upMail ?? ''}
                                    onChange={(e) => onFormChange({ upMail: e.target.value })}
                                    placeholder="student@up.edu.ph"
                                    className={inputClass}
                                />
                                {emailError && <p className="text-xs text-red-600 font-medium">{emailError}</p>}
                                {errors.upMail && <p className="text-xs text-red-600 font-medium">{errors.upMail}</p>}
                                <button type="button" onClick={onCheckEmail} disabled={isCheckingEmail}
                                    className="flex-1 px-4 py-2 text-sm font-semibold text-white bg-btn-gray hover:bg-btn-gray-hover rounded-lg shadow-md disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed">
                                    {isCheckingEmail ? <>Verifying...</> : 'Find Email'}
                                </button>
                    
                                {/* Email */}
                                {formState.verifiedUser && (
                                    <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-lg px-4 py-1 shadow-sm">
                                        <div className="w-7 h-7 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                                            {formState.verifiedUser.name.charAt(0)}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-xs font-bold text-slate-800 truncate">{formState.verifiedUser.name}</p>
                                            <p className="text-xs text-gray-500 truncate">{formState.verifiedUser.email}</p>
                                        </div>
                                        <FaCircleCheck className="text-green-500 ml-auto text-lg"/>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="space-y-3">
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-[10px] font-bold text-text-white-light uppercase tracking-wider mb-1.5">First Name</label>
                                        <input type="text" value={formState.firstName ?? ''} onChange={(e) => onFormChange({ firstName: e.target.value })}
                                            className={inputClass} maxLength={255} 
                                        />
                                        {errors.firstName && <span className="text-[10px] text-red-500 font-medium">{errors.firstName}</span>}
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-text-white-light uppercase tracking-wider mb-1.5">Last Name</label>
                                        <input type="text" value={formState.lastName ?? ''} onChange={(e) => onFormChange({ lastName: e.target.value })}
                                            className={inputClass} maxLength={255} 
                                        />
                                        {errors.lastName && <span className="text-[10px] text-red-500 font-medium">{errors.lastName}</span>}
                                    </div>
                                </div>
                                <div className="grid grid-cols-[60px_1fr] gap-3">
                                    <div>
                                        <label className="block text-[10px] font-bold text-text-white-light uppercase tracking-wider mb-1.5">M.I.</label>
                                        <input type="text" value={formState.middleInitial ?? ''} onChange={(e) => onFormChange({ middleInitial: e.target.value })}
                                            className={inputClass} maxLength={2} 
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-text-white-light uppercase tracking-wider mb-1.5">UP Mail (Locked)</label>
                                        <input type="text" disabled value={formState.lockedEmail ?? ''}
                                            className={`${inputClass} text-text-white-light`} 
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Subject Checklist */}
                    <div>
                        <StepHeader n={2} label="Teachable Subjects" />
                        <SubjectChecklist
                            subjects={subjects}
                            selected={formState.selectedSubjects}
                            onChange={(s) => onFormChange({ selectedSubjects: s })}
                            error={errors.selectedSubjects}
                        />
                    </div>
                </div>

                {/* Avatar upload */}
                <div>
                    <StepHeader n={3} label={mode === 'create' ? "Profile Picture" : "Update Picture"} />
                    <div className="flex flex-col mt-2">
                        <div 
                            onClick={() => fileInputRef.current?.click()}
                            className="w-full aspect-square max-w-[375px] rounded-xl border-2 border-dashed border-white-border bg-white flex flex-col items-center justify-center cursor-pointer hover:bg-white-hover hover:border-white-complement transition overflow-hidden relative group bg-white shadow-sm"
                        >
                            {previewUrl ? (
                            <>
                                <img src={previewUrl} alt="Avatar preview" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <FaImage className="text-2xl text-white mb-2" />
                                    <span className="text-white text-xs font-bold">Change Image</span>
                                </div>
                            </>
                            ) : (
                            <div className="text-center p-6">
                                <div className="w-16 h-16 flex items-center justify-center mx-auto mb-3">
                                    <FaImage className="text-2xl" />
                                </div>
                                <p className="text-sm font-bold text-slate-700">Upload Image</p>
                                <p className="text-[10px] text-gray-400 mt-1">PNG, JPG up to 5MB</p>
                            </div>
                            )}
                        </div>
                        <input 
                            type="file" 
                            ref={fileInputRef} 
                            onChange={handleFileChange} 
                            accept="image/*" 
                            className="hidden" 
                        />
                        {errors.avatar && <p className="mt-2 text-xs text-red-600">{errors.avatar}</p>}
                    </div>
                </div>
            </div>

            {/* Availabilities */}
            <div>
                <StepHeader n={4} label="Availability Schedule" />
                <div className="p-4 rounded-xl border border-white-border">
                    <AvailabilityScheduler
                        rows={formState.availabilities}
                        onChange={(rows) => onFormChange({ availabilities: rows })}
                        errors={errors.availabilities ? [errors.availabilities] : []}
                    />
                </div>
            </div>
        </div>
    );
}

function StepHeader({ n, label }: { n: number; label: React.ReactNode }) {
    return (
        <div className="flex items-center mb-4">
            <span className="w-5 h-5 rounded-full bg-up-maroon text-white text-xs flex items-center justify-center">
                {n}
            </span>
            <p className="text-xs font-bold pl-2.5 text-text-white-light uppercase tracking-wider flex items-center gap-2">
                {label}
            </p>
            <span className="text-red-500">*</span>
        </div>
    );
}