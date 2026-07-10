import { useState } from 'react';
import ConfirmModal from '@/components/ui/ConfirmModal';
import { MdCheck, MdClose, MdPersonOff } from 'react-icons/md';
import type { AdminSession } from '@/types/admin';
import type { MentorSessionRow } from '@/pages/mentor/sessions';
import { toast } from 'sonner';
import { BsPersonCheck } from 'react-icons/bs';

export type StatusAction = 'claim' | 'accepted' | 'rejected' | 'completed' | 'no_show';

interface Props {
isOpen: boolean;
session: AdminSession | MentorSessionRow | null;
action: StatusAction | null;
onClose: () => void;
onSuccess: (action: StatusAction) => void;
}

export default function UpdateSessionStatusModal({ isOpen, session, action, onClose, onSuccess }: Props) {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const configMap: Record<StatusAction, any> = {
        claim: {
            title: "Claim Open Session",
            msg: "First come, first serve. Do you want to claim this session?",
            btnLabel: "Claim Session",
            btnClass: "bg-emerald-600 hover:bg-emerald-700 text-white",
            icon: <MdCheck className="text-4xl text-emerald-600" />
        },
            accepted: {
            title: "Accept Session",
            msg: "Are you sure you want to accept this session request?",
            btnLabel: "Accept Session",
            btnClass: "bg-green-600 hover:bg-green-700 text-white",
            icon: <MdCheck className="text-4xl text-green-600" />
        },
            rejected: {
            title: "Reject Session",
            msg: "Are you sure you want to mark yourself unavailable?",
            btnLabel: "Mark Unavailable",
            btnClass: "bg-red-600 hover:bg-red-700 text-white",
            icon: <MdClose className="text-4xl text-red-600" />
        },
            completed: {
            title: "Complete Session",
            msg: "Mark this session as successfully completed?",
            btnLabel: "Mark Completed",
            btnClass: "bg-blue-600 hover:bg-blue-700 text-white",
            icon: <BsPersonCheck className="text-4xl text-blue-600" />
        },
        no_show: {
            title: "Mark as No Show",
            msg: "Are you sure you want to mark this student as a No Show?",
            btnLabel: "Confirm No Show",
            btnClass: "bg-[#F46D06] hover:bg-[#C85A05] text-white",
            icon: <MdPersonOff className="text-4xl text-[#F46D06]" />
        }
    };

    const handleExecute = async () => {
        if (!session || !action) return;
        setIsSubmitting(true);
        try {
            const idsToUpdate = session.group_ids?.length > 0 ? session.group_ids : [session.id];
            const url = action === 'claim' ? '/api/sessions/claim' : '/api/sessions/update-status';
            const body = action === 'claim' 
                ? { group_ids: idsToUpdate } 
                : { booking_ids: idsToUpdate, booking_status: action };
            const res = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });
            if (res.status === 409 && action === 'claim') {
                throw new Error('Session is no longer open. Another mentor just claimed it!');
            }
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to update session.');
            }
            onSuccess(action);
        } catch (err: any) {
            console.error(err);
            toast(err.message || 'An error occurred while updating the session.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!session || !action) return null;
    const cfg = configMap[action];

    return (
        <ConfirmModal
        isOpen={isOpen}
        title={cfg.title}
        message={
            <div className="text-left bg-cream p-4 rounded-xl border border-cream-border text-xs text-text-brown space-y-2 mt-4">
            <p className="text-sm text-center font-medium text-slate-600 mb-2 normal-case">
                {cfg.msg}
            </p>
            <div className="flex justify-between">
                <span className="font-bold text-text-brown-light uppercase tracking-wider">Student:</span>
                <span className="font-semibold text-slate-700 truncate max-w-[70%]" title={session.studentNames || session.student}>
                {session.student}
                </span>
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
        icon={cfg.icon}
        confirmLabel={cfg.btnLabel}
        confirmClassName={cfg.btnClass}
        loading={isSubmitting}
        onCancel={onClose}
        onConfirm={handleExecute}
        />
    );
}