import { useState, useEffect, useMemo } from 'react';
import { v4 as uuid } from 'uuid';
import { createClient as createBrowserClient } from '@/utils/supabase/client';

import CrudModal from '@/components/ui/CrudModal';
import ConfirmModal from '@/components/ui/ConfirmModal';
import MentorCrudForm from '@/components/admin/mentors/MentorCrudForm';
import type { AdminMentor, AvailabilityRow } from '@/types/admin';

const EMPTY_AVAILABILITY = (): AvailabilityRow => ({ id: uuid(), day_of_week: '', start_time: '', end_time: '' });

interface EditMentorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  subjects: { id: string; code: string; name: string }[];
  mentor: AdminMentor | null;
}

export default function EditMentorModal({ isOpen, onClose, onSuccess, subjects, mentor }: EditMentorModalProps) {
  const supabase = createBrowserClient();

  const [formState, setFormState] = useState({
    firstName: '', lastName: '', middleInitial: '',
    lockedEmail: '', avatarPreview: '',
    avatarFile: null as File | null,
    selectedSubjects: [] as string[],
    availabilities: [EMPTY_AVAILABILITY()],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [lastMentorId, setLastMentorId] = useState<string | null>(null);

  // Auto-populate
  useEffect(() => {
    if (!mentor) return;

    if (mentor.id !== lastMentorId) {
      setFormState({
        firstName: mentor.firstName,
        lastName: mentor.lastName,
        middleInitial: mentor.middleInitial.replace('.', ''),
        lockedEmail: mentor.email,
        avatarPreview: mentor.avatar,
        avatarFile: null,
        selectedSubjects: mentor.subjects.map(s => s.id),
        availabilities: Object.entries(mentor.schedule).flatMap(([day, { slots }]) =>
          slots.map(slot => {
            const to24 = (t: string) => {
              const [time, p] = t.split(' ');
              let [h, m] = time.split(':').map(Number);
              if (p === 'PM' && h !== 12) h += 12;
              if (p === 'AM' && h === 12) h = 0;
              return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`;
            };
            return { id: uuid(), day_of_week: day, start_time: to24(slot.start), end_time: to24(slot.end) };
          })
        ) || [EMPTY_AVAILABILITY()],
      });
      
      setLastMentorId(mentor.id);
      setErrors({});
    }
    
  }, [mentor, lastMentorId]);

  // Check if there are new inputs
  const hasChanges = useMemo(() => {
    if (!mentor) return false;

    // Check field texts
    if (formState.firstName !== mentor.firstName) return true;
    if (formState.lastName !== mentor.lastName) return true;
    if (formState.middleInitial !== mentor.middleInitial.replace('.', '')) return true;
    
    // Check avatar upload
    if (formState.avatarFile !== null) return true;

    // Check subjects 
    const originalSubjects = mentor.subjects.map(s => s.id).sort();
    const currentSubjects = [...formState.selectedSubjects].sort();
    if (originalSubjects.length !== currentSubjects.length) return true;
    if (originalSubjects.some((id, index) => id !== currentSubjects[index])) return true;

    // Check availabilities
    const originalAvails = Object.entries(mentor.schedule).flatMap(([day, { slots }]) =>
      slots.map(slot => {
        const to24 = (t: string) => {
          const [time, p] = t.split(' ');
          let [h, m] = time.split(':').map(Number);
          if (p === 'PM' && h !== 12) h += 12;
          if (p === 'AM' && h === 12) h = 0;
          return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`;
        };
        return { day_of_week: day, start_time: to24(slot.start), end_time: to24(slot.end) };
      })
    );

    const currentAvails = formState.availabilities.map(a => ({
      day_of_week: a.day_of_week, start_time: a.start_time, end_time: a.end_time
    }));

    if (originalAvails.length !== currentAvails.length) return true;

    const sortFn = (a: any, b: any) => a.day_of_week.localeCompare(b.day_of_week) || a.start_time.localeCompare(b.start_time);
    originalAvails.sort(sortFn);
    currentAvails.sort(sortFn);

    if (originalAvails.some((orig, i) => 
      orig.day_of_week !== currentAvails[i].day_of_week || 
      orig.start_time !== currentAvails[i].start_time || 
      orig.end_time !== currentAvails[i].end_time
    )) return true;

    return false;
  }, [formState, mentor]);

  // Validate inputs
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
    if (!formState.firstName.trim()) errs.firstName = 'First name is required.';
    if (!formState.lastName.trim()) errs.lastName = 'Last name is required.';
    if (formState.selectedSubjects.length === 0) errs.selectedSubjects = 'At least one subject is required.';
    const availErr = validateAvailabilities(formState.availabilities);
    if (availErr) errs.availabilities = availErr;
    setErrors(errs);
    if (Object.keys(errs).length === 0) setConfirmOpen(true);
  };

  const handleSave = async () => {
    if (!mentor) return;
    setLoading(true);
    try {
      let avatarUrl: string | undefined = undefined;
      if (formState.avatarFile) {
        avatarUrl = await uploadAvatar(formState.avatarFile, mentor.user_id);
      }
      const r = await fetch(`/api/admin/mentors/${mentor.id}`, {
        method: 'PUT', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: formState.firstName, lastName: formState.lastName,
          middleInitial: formState.middleInitial, selectedSubjects: formState.selectedSubjects,
          availabilities: formState.availabilities, avatarUrl
        }),
      });

      if (r.ok) {
        setConfirmOpen(false);
        onSuccess();
      }
    } finally { setLoading(false); }
  };

  return (
    <>
      <CrudModal
        open={isOpen} title="Edit Mentor Profile" subtitle="Update their profile picture, subjects, or availabilities."
        onClose={onClose}
        footer={
          <div className="flex gap-3">
            <button onClick={onClose} className="flex-1 px-4 py-2 text-sm font-semibold text-slate-600 bg-white border border-cream-border rounded-lg hover:bg-cream-dark cursor-pointer">Cancel</button>
            <button onClick={handleConfirm} disabled={loading || !hasChanges}className="flex-1 px-4 py-2 text-sm font-semibold text-cream bg-btn-brown hover:bg-btn-brown-hover rounded-lg shadow-md disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed">{loading ? 'Validating...' : 'Save Changes'}</button>
          </div>
        }
      >
        <MentorCrudForm
          mode="edit" formState={formState} subjects={subjects} errors={errors}
          onFormChange={(p) => setFormState(f => ({ ...f, ...p } as any))}
        />
      </CrudModal>

      <ConfirmModal
        isOpen={confirmOpen} title="Confirm Changes" message="This will update the mentor's profile information."
        confirmLabel="Save" confirmClassName="bg-blue-600 hover:bg-blue-700"
        icon={<div className="w-16 h-16 bg-blue-100 text-blue-500 rounded-full flex items-center justify-center"><i className="fa-solid fa-pen-to-square text-3xl"></i></div>}
        loading={loading} onConfirm={handleSave} onCancel={() => setConfirmOpen(false)}
      />
    </>
  );
}