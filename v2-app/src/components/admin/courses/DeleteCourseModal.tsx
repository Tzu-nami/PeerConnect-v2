import { useState, useEffect } from 'react';
import ConfirmModal from '@/components/ui/ConfirmModal';
import { FaTriangleExclamation, FaSpinner } from 'react-icons/fa6';
import { AdminCourse } from '@/types/admin';

interface DeleteSubjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  subject: AdminCourse | null;
}

export default function DeleteCourseModal({ isOpen, onClose, onSuccess, subject }: DeleteSubjectModalProps) {
    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {
        if (!subject) return;
        setLoading(true);
        try {
        const r = await fetch(`/api/admin/courses/${subject.id}`, { method: 'DELETE' });
        if (r.ok) onSuccess();
        } finally { setLoading(false); }
    };

    return (
        <ConfirmModal
        isOpen={isOpen} title="Delete Subject?" message={`Are you sure you want to remove ${subject?.code}? It will be unassigned from all mentors.`}
        confirmLabel="Delete" confirmClassName="bg-red-600 hover:bg-red-700"
        icon={<div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center"><FaTriangleExclamation className="text-3xl" /></div>}
        loading={loading} onConfirm={handleDelete} onCancel={onClose}
        />
    );
}