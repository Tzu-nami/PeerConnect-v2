import { useState, useEffect, useMemo } from 'react';
import CrudModal from '@/components/ui/CrudModal';
import ConfirmModal from '@/components/ui/ConfirmModal';
import { FaPenToSquare } from 'react-icons/fa6';
import type { AdminCourse } from '@/types/admin';
import { createClient } from '@/utils/supabase/client';
import { checkSubjectExists } from '@/utils/services/courseService';

interface EditSubjectModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    subject: AdminCourse | null;
}

export default function EditCourseModal({ isOpen, onClose, onSuccess, subject }: EditSubjectModalProps) {
    const supabase = createClient();
    const [form, setForm] = useState({ code: '', name: '' });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [confirmOpen, setConfirmOpen] = useState(false);

    const [isValidating, setIsValidating] = useState(false);
    const [loading, setLoading] = useState(false);
    const [lastSubjectId, setLastSubjectId] = useState<string | null>(null);

    // Keep current inputs
    useEffect(() => {
        if (!subject) return;
        if (subject.id !== lastSubjectId) {
            setForm({ code: subject.code, name: subject.name });
            setLastSubjectId(subject.id);
            setErrors({});
        }
    }, [subject, lastSubjectId]);

    const hasChanges = useMemo(() => {
        if (!subject) return false;
        return form.code.trim() !== subject.code || form.name.trim() !== subject.name;
    }, [form, subject]);

    const handleValidate = async () => {
        const errs: Record<string, string> = {};
        if (!form.code.trim()) errs.code = 'Subject code is required.';
        if (!form.name.trim()) errs.name = 'Subject name is required.';
        if (Object.keys(errs).length > 0) {
            setErrors(errs);
            return;
        }

        setIsValidating(true);
        // Check duplicate subjects
        const isDuplicate = await checkSubjectExists(supabase, form.code);

        if (isDuplicate) {
            setErrors({ code: `The subject already exists.` });
            setIsValidating(false);
            return; 
        }

        setErrors({});
        setConfirmOpen(true);
        setIsValidating(false);
    };

    const handleSave = async () => {
        if (!subject) return;
        setLoading(true);
        try {
            const r = await fetch(`/api/admin/courses/${subject.id}`, {
                method: 'PUT', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code: form.code.trim(), name: form.name.trim() }),
            });
        if (r.ok) {
            setConfirmOpen(false);
            onSuccess();
        } else {
            const err = await r.json();
            throw new Error(err.error);
        }
        } catch (e: any) {
            alert(`Could not update: ${e.message}`);
        } finally { setLoading(false); }
    };

    return (
        <div>
            <CrudModal
                open={isOpen && !confirmOpen} title="Edit Subject" subtitle="Update the course code or the descriptive name."
                onClose={onClose} maxwidth="max-w-md"
                footer={
                <div className="flex gap-3">
                    <button onClick={onClose} className="flex-1 px-4 py-2 text-sm font-semibold text-slate-600 bg-white border border-cream-border rounded-lg hover:bg-cream-dark transition">Cancel</button>
                    <button onClick={handleValidate} disabled={loading || !hasChanges || isValidating} className="flex-1 px-4 py-2 text-sm font-semibold text-cream bg-btn-brown hover:bg-btn-brown-hover rounded-lg shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition">
                    {isValidating ? 'Validating...' : 'Save Changes'}
                    </button>
                </div>
                }
            >
                <div className="space-y-4">
                    <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Subject Code <span className="text-red-500">*</span></label>
                        <input type="text" value={form.code} onChange={(e) => setForm(f => ({ ...f, code: e.target.value }))} className="w-full px-3 py-2 text-sm rounded-lg border border-cream-border bg-white outline-none focus:ring-2 focus:ring-up-maroon/30 focus:border-up-maroon transition" maxLength={20} />
                        {errors.code && <p className="mt-1 text-xs text-red-600">{errors.code}</p>}
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Subject Name <span className="text-red-500">*</span></label>
                        <input type="text" value={form.name} onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))} className="w-full px-3 py-2 text-sm rounded-lg border border-cream-border bg-white outline-none focus:ring-2 focus:ring-up-maroon/30 focus:border-up-maroon transition" maxLength={255}/>
                        {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
                    </div>
                </div>
            </CrudModal>

            <ConfirmModal
                isOpen={confirmOpen} title="Confirm Changes" message="Are you sure you want to save the changes made to this subject?"
                confirmLabel="Save" confirmClassName="bg-blue-600 hover:bg-blue-700"
                icon={<div className="w-16 h-16 bg-blue-100 text-blue-500 rounded-full flex items-center justify-center"><FaPenToSquare className="text-3xl" /></div>}
                loading={loading} onConfirm={handleSave} onCancel={() => setConfirmOpen(false)}
            />
        </div>
    );
}