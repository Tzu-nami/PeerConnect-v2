import { useState, useEffect } from 'react';
import ConfirmModal from '@/components/ui/ConfirmModal';
import type { AdminMentor } from '@/types/admin';
import { FaTriangleExclamation } from 'react-icons/fa6';

interface DeleteMentorModalProps {
  mentor: AdminMentor | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function DeleteMentorModal({ mentor, onClose, onSuccess }: DeleteMentorModalProps) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!mentor) return;
    setLoading(true);
    try {
      const r = await fetch(`/api/admin/mentors/${mentor.id}`, { method: 'DELETE' });
      if (r.ok) {
        onClose();
        onSuccess();
      }
    } finally {
      setLoading(false);
    }
  };

  const getMessage = () => {
      return (
        <div className="flex items-center justify-center gap-2 py-2">
          Are you sure you want to remove this mentor? Their schedule and subjects will be deleted.
        </div>
      );
    }

  return (
    <ConfirmModal
      isOpen={!!mentor} 
      title="Remove Mentor?" 
      confirmLabel="Confirm" 
      confirmClassName="bg-red-600 hover:bg-red-700"
      icon={<div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center"><FaTriangleExclamation className="text-3xl" /></div>}
      loading={loading} 
      onConfirm={handleDelete} 
      onCancel={onClose}
      message={getMessage()}
    />
  );
}