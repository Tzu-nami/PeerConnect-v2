import type { AdminSession } from '@/types/admin';
import { formatHours } from '@/utils/formatHours';
import StatusBadge from '@/components/ui/StatusBadge';

interface SessionStatDetailsProps {
  sessions: AdminSession[];
  showHours?: boolean;
}

export default function SessionStatDetails({ sessions, showHours }: SessionStatDetailsProps) {
  const valueClass = "w-full px-3 py-2 text-sm rounded-lg border border-cream-border bg-cream-dark text-slate-700 flex items-center gap-4"
  
  if (sessions.length === 0) {
    return <p className="text-xs text-gray-400 italic py-6 text-center">No sessions found in this category.</p>;
  }

  return (
    <div className="flex flex-col divide-y divide-gray-50 space-y-3">
      {sessions.map((s) => (
        <div key={s.id} className={valueClass}>
          {/* Avatar */}
          <div className="w-8 h-8 rounded-full bg-slate-100 flex-shrink-0 overflow-hidden border border-slate-200">
            <img 
              src={s.avatar || `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(s.student)}`} 
              alt={s.student}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(s.student)}`;
              }}
            />
          </div>
          
          {/* Info */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-text-brown tracking-wider truncate" title={`${s.subject} — ${s.topic}`}>
              {s.subject} — {s.topic}
            </p>
            <p className="text-xs text-text-brown-light tracking-wider truncate py-0.5" title={`${s.student}`}>
              <span className="font-bold">Student: </span>{s.student}
            </p>
            <p className="text-xs text-text-brown-light tracking-wider truncate" title={`${s.mentor}`}>
              <span className="font-bold">Mentor: </span>{s.mentor}
            </p>
            <p className="text-xs text-text-brown-light tracking-wider truncate py-0.5">
              {s.date}, {s.time}
            </p>
          </div>
          
          {/* Status */}
          <div className="flex-shrink-0 flex items-center gap-4">
            {s.status === 'completed' && (
               <span className="text-sm font-bold text-blue-600">{formatHours(s.durationHours * 60)}</span>
            )}
            {!showHours && (
            <StatusBadge status={s.status} />
            )}
          </div>
        </div>
      ))}
    </div>
  );
}