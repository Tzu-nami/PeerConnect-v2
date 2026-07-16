import StatusBadge from "@/components/ui/StatusBadge";
import type { MentorSessionRow } from "@/pages/mentor/sessions";
import { MdCancel, MdEdit, MdCheck, MdClose, MdPersonOff } from 'react-icons/md';
import { BsPersonCheck } from "react-icons/bs";

type Props = {
  session: MentorSessionRow;
  onView: (session: MentorSessionRow) => void;
  onEdit: (session: MentorSessionRow) => void;
  onCancel: (session: MentorSessionRow) => void;
  onAccept: (session: MentorSessionRow) => void;
  onReject: (session: MentorSessionRow) => void;
  onComplete: (session: MentorSessionRow) => void;
  onNoShow: (session: MentorSessionRow) => void;
};

export default function MentorSessionsTableRow({ session, onView, onEdit, onCancel, onAccept, onReject, onComplete, onNoShow }: Props) {
  return (
    <tr
      onClick={() => onView(session)}
      className="border-t border-white-border hover:bg-white-hover transition cursor-pointer group"
    >
        <td className="px-5 py-4 align-middle sticky left-0 bg-white z-10 group-hover:bg-white-hover">
        <p className="font-bold text-sm text-text-primary truncate">
          {session.date}
        </p>
        <p className="text-text-white-light text-xs truncate mt-0.5">
          {session.status === "completed" ? session.durationText : session.time}
        </p>
      </td>

      <td className="px-5 py-4 align-middle">
        <p
          className="font-bold text-sm text-text-primary truncate"
          title={session.studentNames}
        >
          {session.student}
        </p>
        <p
          className="text-text-white-light text-xs truncate mt-0.5"
          title={session.emails}
        >
          {session.email}
        </p>
      </td>

      <td className="px-5 py-4 align-middle">
        <p
          className="font-bold text-sm text-text-primary truncate"
          title={session.subject}
        >
          {session.subject}
        </p>
        <p
          className="text-text-white-light text-xs truncate mt-0.5"
          title={session.topic}
        >
          {session.topic}
        </p>
      </td>

      <td className="px-5 py-4 align-middle">
        <p
          className="font-bold text-sm text-text-primary truncate"
          title={session.room}
          >
          {session.room}
        </p>
        <p
          className="text-text-white-light text-xs truncate mt-0.5"
          title={session.mode}
        >
          {session.mode}
        </p>
      </td>

      <td className="px-5 py-4 align-middle text-center">
        <StatusBadge status={session.status} />
      </td>

      <td className="px-5 py-4 align-middle text-sm text-center relative">
        {!['cancelled', 'rejected', 'no_show'].includes(session.status) && (
            <span className="w-2 h-2 rounded-full bg-text-brown-light hidden md:inline-block md:group-hover:opacity-0 transition-all duration-150 ease-in-out" />
        )}
          <div className="absolute inset-0 flex items-center justify-center gap-2 text-lg opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-200 ease-in-out">
          {session.status === 'pending' && (
            <>
            {/* Pending */}
              {session.isOpen ? (
                <button 
                  onClick={(e) => { e.stopPropagation(); onAccept(session); }}
                  className="p-1.5 rounded-lg text-emerald-600 hover:text-emerald-700 bg-emerald-100 hover:bg-emerald-200 hover:scale-110 transition cursor-pointer" 
                  title="Claim Session"
                >
                  <MdCheck />
                </button>
              ) : (
                <>
                  <button 
                    onClick={(e) => { e.stopPropagation(); onAccept(session); }}
                    className="p-1.5 rounded-lg text-green-600 hover:text-green-700 bg-green-100 hover:bg-green-200 hover:scale-110 transition cursor-pointer" 
                    title="Accept Session"
                  >
                    <MdCheck />
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); onReject(session); }}
                    className="p-1.5 rounded-lg text-red-600 hover:text-red-700 bg-red-100 hover:bg-red-200 hover:scale-110 transition cursor-pointer" 
                    title="Mark Unavailable"
                  >
                    <MdClose />
                  </button>
                </>
              )}
            </>
          )}

          {/* Accepted */}
          {session.status === 'accepted' && (
            <>
              <button 
                onClick={(e) => { e.stopPropagation(); onComplete(session); }}
                className="p-1.5 rounded-lg text-blue-600 hover:text-blue-700 bg-blue-100 hover:bg-blue-200 hover:scale-110 transition cursor-pointer" 
                title="Mark as Completed"
              >
                <BsPersonCheck />
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); onNoShow(session); }}
                className="p-1.5 rounded-lg text-[#F46D06] hover:text-[#C85A05] bg-[#FEEADB] hover:bg-[#FDD2B0] hover:scale-110 transition cursor-pointer" 
                title="Mark as No Show"
              >
                <MdPersonOff />
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); onCancel(session); }}
                className="p-1.5 rounded-lg text-red-600 hover:text-red-700 bg-red-100 hover:bg-red-200 hover:scale-110 transition cursor-pointer" 
                title="Cancel Session"
              >
                <MdCancel />
              </button>
            </>
          )}

          {/* Completed */}
          {session.status === 'completed' && (
            <button 
              onClick={(e) => { e.stopPropagation(); onEdit(session); }}
              className="p-1.5 rounded-lg text-blue-600 hover:text-blue-700 bg-blue-100 hover:bg-blue-200 hover:scale-110 transition cursor-pointer" 
              title="Edit Logged Hours"
            >
              <MdEdit />
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}