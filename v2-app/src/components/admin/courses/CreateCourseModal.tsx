import { useState } from 'react';
import CrudModal from '@/components/ui/CrudModal';
import ConfirmModal from '@/components/ui/ConfirmModal';
import { FaBook } from 'react-icons/fa6';
import { createClient } from '@/utils/supabase/client';
import { checkSubjectExists } from '@/utils/services/courseService';

interface CreateCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const inputClass = "w-full px-3 py-2 text-sm rounded-lg border border-white-border bg-white text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-up-maroon/30 focus:border-up-maroon transition";

export default function CreateCourseModal({ isOpen, onClose, onSuccess }: CreateCourseModalProps) {
  const supabase = createClient();
  const [form, setForm] = useState({ code: '', name: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [confirmOpen, setConfirmOpen] = useState(false);

  const [isValidating, setIsValidating] = useState(false);
  const [loading, setLoading] = useState(false);

  // Check if there is input
  const hasInput = Boolean(form.code || form.name);
  const isFormComplete = Boolean(form.code.trim() && form.name.trim());

  const handleReset = () => {
    setForm({ code: '', name: '' });
    setErrors({});
  };

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
    setLoading(true);
    try {
      const r = await fetch('/api/admin/mentors/subjects', {
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: form.code.trim(), name: form.name.trim() }),
      });
      
      if (r.ok) {
        setConfirmOpen(false);
        handleReset();
        onClose();
        onSuccess();
      } else {
        const errorData = await r.json();
        throw new Error(errorData.error || 'Failed to add subject');
      }
    } catch (error: any) {
      console.error('Subject Save Error:', error);

      setConfirmOpen(false);
      setErrors({ code: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <CrudModal
        open={isOpen && !confirmOpen}
        title="Add New Subject" 
        subtitle="This will become available for mentor assignments."
        onClose={onClose}
        maxWidth="max-w-md"
        footer={
          <div className="flex gap-3">
            {hasInput ? (
              <button 
                onClick={handleReset} 
                className="flex-1 px-4 py-2 text-sm font-semibold text-text-primary bg-white border border-white-border rounded-lg hover:bg-white-dark cursor-pointer transition"
              >
                Reset Form
              </button>
            ) : (
              <button 
                onClick={onClose} 
                className="flex-1 px-4 py-2 text-sm font-semibold text-text-primary bg-white border border-white-border rounded-lg hover:bg-white-dark cursor-pointer transition"
              >
                Cancel
              </button>
            )}
            <button 
              onClick={handleValidate} 
              disabled={loading || !isFormComplete || isValidating}
              className="flex-1 px-4 py-2 text-sm font-semibold text-white bg-btn-gray hover:bg-btn-gray-hover rounded-lg shadow-md disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition"
            >
              {isValidating ? 'Validating...' : 'Add Subject'}
            </button>
          </div>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-[10px] font-bold text-text-white-light uppercase mb-1">Subject Code <span className="text-red-500">*</span></label>
            <input 
              type="text" 
              value={form.code} 
              onChange={(e) => setForm(f => ({ ...f, code: e.target.value }))} 
              placeholder="e.g. Math 54" 
              className={inputClass} 
              maxLength={20}
            />
            {errors.code && <p className="mt-1 text-xs text-red-600">{errors.code}</p>}
          </div>
          <div>
            <label className="block text-[10px] font-bold text-text-white-light uppercase mb-1">Subject Name <span className="text-red-500">*</span></label>
            <input 
              type="text" 
              value={form.name} 
              onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))} 
              placeholder="e.g. Elementary Analysis II" 
              className={inputClass}
              maxLength={255}
            />
            {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
          </div>
        </div>
      </CrudModal>

      <ConfirmModal
        isOpen={confirmOpen} 
        title="Confirm New Subject" 
        message="This will be added to the list of available subjects."
        confirmLabel="Save" 
        confirmClassName="bg-green-700 hover:bg-sidebar-green"
        icon={<div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center"><FaBook className="text-3xl" /></div>}
        loading={loading} 
        onConfirm={handleSave} 
        onCancel={() => setConfirmOpen(false)}
      />
    </>
  );
}