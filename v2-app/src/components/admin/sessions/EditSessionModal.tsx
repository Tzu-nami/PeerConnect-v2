import { useState, useEffect } from 'react';
import CrudModal from '@/components/ui/CrudModal';
import ConfirmModal from '@/components/ui/ConfirmModal';
import { FaClock, FaPenToSquare } from 'react-icons/fa6';
import type { AdminSession } from '@/types/admin';

interface EditSessionModalProps {
  isOpen: boolean;
  session: AdminSession | null;
  onClose: () => void;
  onSuccess: () => void;
}

const inputClass = "w-full pl-8 pr-3 py-2 text-sm rounded-lg border border-cream-border bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-up-maroon/30 focus:border-up-maroon transition shadow-sm";

export default function EditSessionModal({ isOpen, session, onClose, onSuccess }: EditSessionModalProps) {
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [showConfirm, setShowConfirm] = useState(false); 

  useEffect(() => {
    if (isOpen && session) {
      setStartTime(session.start);
      setEndTime(session.end);
      setError('');
      setIsSubmitting(false);
      setShowConfirm(false);
    }
  }, [isOpen, session]);

  const computeNewDuration = () => {
    if (!startTime || !endTime) return '—';
    const [sh, sm] = startTime.split(':').map(Number);
    const [eh, em] = endTime.split(':').map(Number);
    const diffMins = (eh * 60 + em) - (sh * 60 + sm);
    
    if (diffMins <= 0) return 'Invalid Range';
    const hrs = Math.floor(diffMins / 60);
    const mins = diffMins % 60;
    
    if (hrs === 0) return `${mins} min`;
    if (mins === 0) return `${hrs} hr`;
    return `${hrs} hr ${mins} min`;
  };

  const handleSave = async () => {
    if (!session) return;
    setError('');

    const [sh, sm] = startTime.split(':').map(Number);
    const [eh, em] = endTime.split(':').map(Number);
    if ((eh * 60 + em) <= (sh * 60 + sm)) {
      setError('End time must be strictly after the start time.');
      setShowConfirm(false);
      return;
    }

    setIsSubmitting(true);
    try {
      const idsToUpdate = session.group_ids?.length > 0 ? session.group_ids : [session.id];

      const res = await fetch('/api/admin/sessions/update-time', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          ids: idsToUpdate, 
          startTime, 
          endTime 
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to update time.');
      }

      setShowConfirm(false);
      onSuccess();
    } catch (err: any) {
      console.error(err);
      setError(err.message);
      setShowConfirm(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const hasChanges = session && (startTime !== session.start || endTime !== session.end);

  if (!session) return null;

  return (
    <>
      <CrudModal
        open={isOpen}
        onClose={onClose}
        maxWidth="max-w-md"
        title="Edit Session Time"
        subtitle="Modify the start or end times to fix logging errors."
        footer={
          <div className="flex gap-3">
            <button 
              onClick={onClose} 
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 text-sm font-semibold text-slate-600 bg-white border border-cream-border rounded-lg hover:bg-cream-dark transition cursor-pointer"
            >
              Cancel
            </button>
            <button 
              onClick={() => setShowConfirm(true)} 
              disabled={!hasChanges || isSubmitting || computeNewDuration() === 'Invalid Range'}
              className="flex-1 px-4 py-2 text-sm font-semibold text-cream bg-btn-brown hover:bg-btn-brown-hover rounded-lg shadow-md disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition"
            >
              Save Changes
            </button>
          </div>
        }
      >
        {/* Details */}
        <div className="grid grid-cols-2 gap-y-4 gap-x-3 bg-cream p-4 rounded-xl border border-cream-border mb-2">
          <div>
            <p className="text-[10px] font-bold text-text-brown-light uppercase mb-0.5">Student</p>
            <p className="text-xs font-bold text-slate-700 truncate" title={session.studentNames || session.student}>{session.student}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold text-text-brown-light uppercase mb-0.5">Mentor</p>
            <p className="text-xs font-bold text-slate-700 truncate" title={session.mentor}>{session.mentor}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold text-text-brown-light uppercase mb-0.5">Subject</p>
            <p className="text-xs font-bold text-slate-700 truncate" title={`${session.subject} - ${session.subjectName}`}>{session.subject}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold text-text-brown-light uppercase mb-0.5">Date</p>
            <p className="text-xs font-bold text-slate-700">{session.date}</p>
          </div>
        </div>

        {/* Hours */}
        <div className="pt-2">
          <p className="text-[10px] font-bold text-text-brown-light uppercase tracking-wider mb-3">Update Schedule</p>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold text-up-maroon uppercase tracking-wider block mb-1.5">Start Time</label>
              <div className="relative flex items-center">
                <FaClock className="absolute left-3 text-up-maroon/50 text-xs pointer-events-none" />
                <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} className={inputClass} />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-up-maroon uppercase tracking-wider block mb-1.5">End Time</label>
              <div className="relative flex items-center">
                <FaClock className="absolute left-3 text-up-maroon/50 text-xs pointer-events-none" />
                <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} className={inputClass} />
              </div>
            </div>
          </div>

          {error && (
            <p className="text-xs text-red-500 font-bold mt-3 bg-red-50 p-2 rounded-lg border border-red-100 text-center">{error}</p>
          )}

          <div className={`mt-4 border rounded-lg px-4 py-3 flex items-center justify-between transition-colors ${computeNewDuration() === 'Invalid Range' ? 'bg-red-50 border-red-200' : 'bg-cream-dark border-cream-border'}`}>
            <span className={`text-[10px] font-bold uppercase tracking-wider ${computeNewDuration() === 'Invalid Range' ? 'text-red-500' : 'text-text-brown-light'}`}>New Duration</span>
            <span className={`text-sm font-bold ${computeNewDuration() === 'Invalid Range' ? 'text-red-700' : 'text-up-maroon'}`}>{computeNewDuration()}</span>
          </div>
        </div>
      </CrudModal>

      <ConfirmModal
        isOpen={showConfirm}
        title="Confirm Time Change"
        message="Are you sure you want to alter this session's log?"
        confirmLabel="Save" confirmClassName="bg-blue-600 hover:bg-blue-700"
        icon={<div className="w-16 h-16 bg-blue-100 text-blue-500 rounded-full flex items-center justify-center"><FaPenToSquare className="text-3xl" /></div>}
        loading={isSubmitting}
        onCancel={() => setShowConfirm(false)}
        onConfirm={handleSave}
      />
    </>
  );
}