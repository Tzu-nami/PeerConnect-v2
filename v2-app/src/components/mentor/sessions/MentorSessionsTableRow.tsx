import StatusBadge from "@/components/ui/StatusBadge";
import type { MentorSessionRow } from "@/pages/mentor/sessions";

type Props = {
  session: MentorSessionRow;
  onView: (session: MentorSessionRow) => void;
};

export default function MentorSessionsTableRow({ session, onView }: Props) {
  return (
    <tr
      onClick={() => onView(session)}
      className="border-t border-cream-border hover:bg-cream-hover transition cursor-pointer"
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
    </tr>
  );
}