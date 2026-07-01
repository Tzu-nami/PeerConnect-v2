import CrudModal from '@/components/ui/CrudModal';
import { FaCalendarDays, FaUserGraduate, FaChalkboardUser, FaClock } from 'react-icons/fa6';
import type { AdminSession } from '@/types/admin';

interface SessionDetailModalProps {
  isOpen: boolean;
  session: AdminSession | null;
  onClose: () => void;
}

export default function SessionDetailModal({ isOpen, session, onClose }: SessionDetailModalProps) {
  if (!session) return null;

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'pending': return 'text-yellow-700 bg-yellow-50 border-yellow-200';
      case 'accepted': return 'text-green-700 bg-green-50 border-green-200';
      case 'completed': return 'text-slate-600 bg-slate-100 border-slate-300';
      case 'cancelled': return 'text-red-700 bg-red-50 border-red-200';
      case 'no_show': return 'text-orange-700 bg-orange-50 border-orange-200';
      case 'unavailable': return 'text-red-800 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const formattedStatus = session.status === 'no_show' 
    ? 'No Show' 
    : session.status.charAt(0).toUpperCase() + session.status.slice(1);

  return (
    <CrudModal
      open={isOpen}
      onClose={onClose}
      maxWidth="max-w-xl"
      title="Session Details"
      subtitle="Complete overview of the tutorial session."
      footer={
        <div className="flex justify-end w-full">
          <button 
            onClick={onClose} 
            className="px-6 py-2 text-sm font-semibold text-cream bg-slate-800 hover:bg-black rounded-lg shadow-md transition cursor-pointer"
          >
            Close
          </button>
        </div>
      }
    >
      <div className="space-y-6">
        
        {/* 1. Header Card (Date, Time, Status) */}
        <div className="bg-cream p-4 rounded-xl border border-cream-border flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-white border border-cream-border flex items-center justify-center text-up-maroon flex-shrink-0 mt-0.5">
            <FaCalendarDays className="text-lg" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start gap-2 mb-1">
              <p className="text-sm font-extrabold text-slate-800 truncate">{session.date}</p>
              <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold border whitespace-nowrap ${getStatusColor(session.status)}`}>
                {formattedStatus}
              </span>
            </div>
            <p className="text-xs font-semibold text-slate-600 flex items-center gap-1.5">
              <FaClock className="text-slate-400" /> 
              {session.durationText || session.time}
            </p>
          </div>
        </div>

        {/* 2. People Section */}
        <div className="space-y-3">
          <p className="text-[10px] font-bold text-text-brown-light uppercase tracking-wider border-b border-cream-border pb-1">Participants</p>
          
          <div className="flex items-start gap-3">
            <FaUserGraduate className="text-slate-400 mt-0.5" />
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase">Student(s)</p>
              <p className="text-xs font-bold text-slate-800">{session.studentNames || session.student}</p>
              <p className="text-[10px] text-slate-500">{session.emails || session.email}</p>
              
              {/* Only show Degree/Year if it's a 1-on-1 session */}
              {!session.group_ids || session.group_ids.length === 1 ? (
                <p className="text-[10px] text-slate-500 mt-0.5">{session.degreeProgram} • {session.yearLevel}</p>
              ) : null}
            </div>
          </div>

          <div className="flex items-start gap-3 pt-2">
            <FaChalkboardUser className="text-slate-400 mt-0.5" />
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase">Mentor</p>
              <p className="text-xs font-bold text-slate-800">{session.mentor}</p>
            </div>
          </div>
        </div>

        {/* 3. Subject Section */}
        <div className="space-y-3">
          <p className="text-[10px] font-bold text-text-brown-light uppercase tracking-wider border-b border-cream-border pb-1">Tutorial Info</p>
          
          <div className="grid grid-cols-2 gap-y-4 gap-x-3">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase">Subject</p>
              <p className="text-xs font-bold text-slate-800">{session.subject}</p>
              <p className="text-[10px] text-slate-500 truncate" title={session.subjectName}>{session.subjectName}</p>
            </div>
            
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase">Mode</p>
              <p className="text-xs font-bold text-slate-800">{session.mode}</p>
            </div>
            
            <div className="col-span-2">
              <p className="text-[10px] font-bold text-slate-400 uppercase">Topic</p>
              <p className="text-xs font-bold text-slate-800 break-words bg-slate-50 p-2.5 rounded-lg border border-slate-100 mt-1">
                {session.topic}
              </p>
            </div>
          </div>
        </div>

      </div>
    </CrudModal>
  );
}