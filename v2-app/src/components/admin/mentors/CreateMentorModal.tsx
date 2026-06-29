import { useState } from 'react';
import { v4 as uuid } from 'uuid';
import { createClient as createBrowserClient } from '@/utils/supabase/client';
import { FaUserPlus } from 'react-icons/fa6';

import CrudModal from '@/components/ui/CrudModal';
import ConfirmModal from '@/components/ui/ConfirmModal';
import MentorCrudForm from '@/components/admin/mentors/MentorCrudForm';
import type { AvailabilityRow } from '@/types/admin';

const EMPTY_AVAILABILITY = (): AvailabilityRow => ({ id: uuid(), day_of_week: '', start_time: '', end_time: '' });

interface CreateMentorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  subjects: { id: string; code: string; name: string }[];
}

export default function CreateMentorModal({ isOpen, onClose, onSuccess, subjects }: CreateMentorModalProps) {
  const supabase = createBrowserClient();
  
  const [formState, setFormState] = useState({
    upMail: '', verifiedUser: null as any,
    avatarFile: null as File | null,
    selectedSubjects: [] as string[],
    availabilities: [EMPTY_AVAILABILITY()],
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [emailError, setEmailError] = useState('');
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const [loading, setLoading] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  // Check if there is an input
  const hasInput = Boolean(
    formState.upMail ||
    formState.verifiedUser ||
    formState.avatarFile ||
    formState.selectedSubjects.length > 0 ||
    formState.availabilities.length > 1 ||
    formState.availabilities[0].day_of_week ||
    formState.availabilities[0].start_time ||
    formState.availabilities[0].end_time
  );

  // Reset forms
  const handleReset = () => {
    setFormState({ 
        upMail: '', 
        verifiedUser: null, 
        avatarFile: null, 
        selectedSubjects: [], 
        availabilities: [EMPTY_AVAILABILITY()] 
    });
    setErrors({});
    setEmailError('');
  };

  // Validate time inputs
  function validateAvailabilities(rows: AvailabilityRow[]): string | null {
    const grouped: Record<string, {start:string;end:string}[]> = {};
    for (const row of rows) {
      if (!row.day_of_week || !row.start_time || !row.end_time) return 'All slots must be filled.';
      if (row.end_time <= row.start_time) return 'Start time must be before end time.';
      if (!grouped[row.day_of_week]) grouped[row.day_of_week] = [];
      for (const ex of grouped[row.day_of_week]) {
        if (row.start_time < ex.end && row.end_time > ex.start) return `Overlapping times on ${row.day_of_week}.`;
      }
      grouped[row.day_of_week].push({ start: row.start_time, end: row.end_time });
    }
    return null;
  }

  // Check email
  const handleCheckEmail = async () => {
    setIsCheckingEmail(true); setEmailError('');
    try {
      const r = await fetch('/api/admin/mentors/check-email', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formState.upMail }),
      });
      const data = await r.json();
      if (!r.ok) { setEmailError(data.error); setFormState(f => ({ ...f, verifiedUser: null })); }
      else setFormState(f => ({ ...f, verifiedUser: data }));
    } finally { setIsCheckingEmail(false); }
  };

  const uploadAvatar = async (file: File, userId: string): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}-${Date.now()}.${fileExt}`;
    const { error } = await supabase.storage.from('avatars').upload(`mentors/${fileName}`, file);
    if (error) throw error;
    const { data: publicUrlData } = supabase.storage.from('avatars').getPublicUrl(`mentors/${fileName}`);
    return publicUrlData.publicUrl;
  };

  const handleConfirm = () => {
    const errs: Record<string,string> = {};
    const availErr = validateAvailabilities(formState.availabilities);
    if (availErr) errs.availabilities = availErr;
    setErrors(errs);
    if (Object.keys(errs).length === 0) setConfirmOpen(true);
  };

  // Check if all fields have inputs
  const isFormComplete = Boolean(
    formState.verifiedUser &&
    formState.avatarFile &&
    formState.selectedSubjects.length > 0 &&
    formState.availabilities.every(row => row.day_of_week && row.start_time && row.end_time)
  );

  // Validate all inputs
  const handleSave = async () => {
    setLoading(true);
    try {
      let avatarUrl: string | undefined = undefined;
      if (formState.avatarFile) {
        avatarUrl = await uploadAvatar(formState.avatarFile, formState.verifiedUser.id);
      }
      const r = await fetch('/api/admin/mentors/mentors', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: formState.verifiedUser.id,
          selectedSubjects: formState.selectedSubjects,
          availabilities: formState.availabilities,
          avatarUrl
        })
      });

      if (r.ok) {
        setConfirmOpen(false);
        handleReset();
        onSuccess();
      } else {
        const errorData = await r.json();
        throw new Error(errorData.error || 'Failed to register mentor');
      }
    } catch (error: any) {
      alert(error.message);
    } finally { setLoading(false); }
  };

  return (
    <>
      <CrudModal
        open={isOpen} title="Register Mentor" subtitle="Add their email, assign subjects, then set availabilities."
        onClose={onClose}
        footer={
          <div className="flex gap-3">
            {hasInput ? (
              <button 
                onClick={handleReset} 
                className="flex-1 px-4 py-2 text-sm font-semibold text-slate-600 bg-white border border-cream-border rounded-lg hover:bg-cream-dark cursor-pointer"
              >
                Reset Form
              </button>
            ) : (
              <button 
                onClick={onClose} 
                className="flex-1 px-4 py-2 text-sm font-semibold text-slate-600 bg-white border border-cream-border rounded-lg hover:bg-cream-dark cursor-pointer"
              >
                Cancel
              </button>
            )}
            <button onClick={handleConfirm} disabled={loading || !isFormComplete} className="flex-1 px-4 py-2 text-sm font-semibold text-cream bg-btn-brown hover:bg-btn-brown-hover rounded-lg shadow-md disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed">{loading ? 'Validating...' : 'Register Mentor'}</button>
          </div>
        }
      >
        <MentorCrudForm
          mode="create" formState={formState} subjects={subjects} errors={errors}
          onFormChange={(p) => setFormState(f => ({ ...f, ...p } as any))}
          onCheckEmail={handleCheckEmail} emailError={emailError} isCheckingEmail={isCheckingEmail}
        />
      </CrudModal>

      <ConfirmModal
        isOpen={confirmOpen} title="Confirm Mentor Registration" message="This will register the student as a peer mentor and allow them access to the mentor module."
        confirmLabel="Save" confirmClassName="bg-green-700 hover:bg-sidebar-green"
        icon={<div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center"><FaUserPlus className="text-3xl" /></div>}
        loading={loading} onConfirm={handleSave} onCancel={() => setConfirmOpen(false)}
      />
    </>
  );
}