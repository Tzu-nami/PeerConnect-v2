import StatusBadge from "@/components/ui/StatusBadge";
import type { MentorSessionRow } from "@/pages/mentor/sessions";
import { MdCancel, MdEdit } from 'react-icons/md';

type Props = {
  session: MentorSessionRow;
  onView: (session: MentorSessionRow) => void;
  onEdit: (session: MentorSessionRow) => void;
  onCancel: (session: MentorSessionRow) => void;
};

export default function MentorSessionsTableRow({ session, onView, onEdit, onCancel }: Props) {
  return (
    <tr
      onClick={() => onView(session)}
      className="border-t border-white-border hover:bg-white-hover transition cursor-pointer group"
    >
      <td className="px-5 py-4 align-middle">
        <p className="font-bold text-sm text-text-brown truncate">
          {session.date}
        </p>
        <p className="text-text-brown-light text-xs truncate mt-0.5">
          {session.status === "completed" ? session.durationText : session.time}
        </p>
      </td>

      <td className="px-5 py-4 align-middle">
        <p
          className="font-bold text-sm text-text-brown truncate"
          title={session.studentNames}
        >
          {session.student}
        </p>
        <p
          className="text-text-brown-light text-xs truncate mt-0.5"
          title={session.emails}
        >
          {session.email}
        </p>
      </td>

      <td className="px-5 py-4 align-middle">
        <p
          className="font-bold text-sm text-text-brown truncate"
          title={session.subject}
        >
          {session.subject}
        </p>
        <p
          className="text-text-brown-light text-xs truncate mt-0.5"
          title={session.topic}
        >
          {session.topic}
        </p>
      </td>

      <td className="px-5 py-4 align-middle text-sm text-text-brown-light truncate">
        {session.mode}
      </td>

      <td className="px-5 py-4 align-middle text-center">
        <StatusBadge status={session.status} />
      </td>

      <td className="px-5 py-4 align-middle text-sm text-center relative">
        {!['cancelled', 'rejected', 'no_show'].includes(session.status) && (
          <span className="w-2 h-2 rounded-full bg-text-brown-light inline-block group-hover:opacity-0 transition-all duration-150 ease-in-out" />
        )}
        <div className="absolute inset-0 flex items-center justify-center gap-2 text-lg opacity-0 group-hover:opacity-100 transition-all duration-200 ease-in-out">
          {/* Edit completed sessions */}
          {session.status === 'completed' && (
            <button 
              onClick={(e) => { e.stopPropagation(); onEdit(session); }}
              className="p-1.5 rounded-lg text-blue-600 hover:text-blue-700 bg-blue-100 hover:bg-blue-200 hover:scale-110 transition cursor-pointer" 
              title="Edit Logged Hours"
            >
              <MdEdit />
            </button>
          )}
          {/* Cancel sessions */}
          {(session.status === 'pending' || session.status === 'accepted') && (
            <button 
              onClick={(e) => { e.stopPropagation(); onCancel(session); }}
              className="p-1.5 rounded-lg text-red-600 hover:text-red-700 bg-red-100 hover:bg-red-200 hover:scale-110 transition cursor-pointer" 
              title="Cancel Session"
            >
              <MdCancel />
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}