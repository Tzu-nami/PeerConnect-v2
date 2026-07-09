import { useState } from 'react';
import ConfirmModal from '@/components/ui/ConfirmModal';
import { FaCircleExclamation } from 'react-icons/fa6';
import type { AdminSession } from '@/types/admin';
import { MentorSessionRow } from '@/pages/mentor/sessions';

interface CancelSessionModalProps {
  isOpen: boolean;
  session: AdminSession | null | MentorSessionRow;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CancelSessionModal({ isOpen, session, onClose, onSuccess }: CancelSessionModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCancelExecution = async () => {
    if (!session) return;

    setIsSubmitting(true);
    try {
      const idsToCancel = session.group_ids?.length > 0 ? session.group_ids : [session.id];

      const res = await fetch('/api/admin/sessions/cancel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: idsToCancel }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to cancel the session.');
      }

      onSuccess();
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'An error occurred while canceling the session.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!session) return null;

  return (
    <ConfirmModal
      isOpen={isOpen}
      title="Cancel Tutorial Session"
      message={
        <div className="text-left bg-cream p-4 rounded-xl border border-cream-border text-xs text-text-brown space-y-2 mt-4">
          <p className="text-sm text-center font-medium text-slate-600 mb-2 normal-case">
            Are you sure you want to cancel this session? This action cannot be undone.
          </p>
          <div className="flex justify-between">
            <span className="font-bold text-text-brown-light uppercase tracking-wider">Student:</span>
            <span className="font-semibold text-slate-700 truncate max-w-[70%]" title={session.studentNames || session.student}>
              {session.student}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="font-bold text-text-brown-light uppercase tracking-wider">Mentor:</span>
            <span className="font-semibold text-slate-700">{session.mentor}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-bold text-text-brown-light uppercase tracking-wider">Subject:</span>
            <span className="font-semibold text-slate-700">{session.subject}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-bold text-text-brown-light uppercase tracking-wider">Schedule:</span>
            <span className="font-semibold text-slate-700 text-right">{session.date}<br/>{session.time}</span>
          </div>
        </div>
      }
      icon={<FaCircleExclamation className="text-4xl text-red-600" />}
      confirmLabel="Cancel Session"
      confirmClassName="bg-red-600 hover:bg-red-700 text-white"
      loading={isSubmitting}
      onCancel={onClose}
      onConfirm={handleCancelExecution}
    />
  );
}