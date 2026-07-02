import CrudModal from '@/components/ui/CrudModal';
import SessionStatDetails from './SessionStatDetails';
import type { AdminSession } from '@/types/admin';

interface SessionStatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle: string;
  sessions: AdminSession[];
  showHours?: boolean;
}

export default function SessionStatsModal({ 
  isOpen, onClose, title, subtitle, sessions, showHours
}: SessionStatsModalProps) {
  
  return (
    <CrudModal 
      open={isOpen} 
      title={title}
      subtitle={subtitle}
      onClose={onClose} 
      maxWidth="max-w-xl"
      footer={
        <button onClick={onClose}
                className="w-full px-4 py-2 text-sm font-semibold text-slate-600 bg-white border border-cream-border rounded-lg hover:bg-cream-dark cursor-pointer transition">
            Close
        </button>
      }>

      {/* Body */}
      <div className="overflow-y-auto flex-1 min-h-[200px]">
        <SessionStatDetails sessions={sessions} showHours={showHours} />
      </div>

    </CrudModal>
  );
}