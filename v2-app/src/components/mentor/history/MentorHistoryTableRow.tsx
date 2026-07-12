import StatusBadge from "@/components/ui/StatusBadge";
import type { MentorHistoryRow } from "@/pages/mentor/history";

type Props = {
  booking: MentorHistoryRow;
  onView: (booking: MentorHistoryRow) => void;
};

export default function MentorHistoryTableRow({ booking, onView }: Props) {
  return (
    <tr
      onClick={() => onView(booking)}
      className="border-t border-white-border hover:bg-white-hover transition cursor-pointer"
    >
      <td className="px-5 py-4 align-middle">
        <p className="font-bold text-sm text-text-brown truncate">
          {booking.date}
        </p>
        <p className="text-text-brown-light text-xs truncate mt-0.5">
          {booking.status === "completed" ? booking.durationText : booking.time}
        </p>
      </td>

      <td className="px-5 py-4 align-middle">
        <p
          className="font-bold text-sm text-text-brown truncate"
          title={booking.subject}
        >
          {booking.subject}
        </p>
        <p
          className="text-text-brown-light text-xs truncate mt-0.5"
          title={booking.topic}
        >
          {booking.topic}
        </p>
      </td>

      <td className="px-5 py-4 align-middle">
        <p
          className="font-bold text-sm text-text-brown truncate"
          title={booking.mentor}
        >
          {booking.mentor}
        </p>
        <p
          className="text-text-brown-light text-xs truncate mt-0.5"
          title={booking.subjectName}
        >
          {booking.subjectName}
        </p>
      </td>

      <td className="px-5 py-4 align-middle text-sm text-text-brown-light truncate">
        {booking.mode}
      </td>

      <td className="px-5 py-4 align-middle text-center">
        <StatusBadge status={booking.status} />
      </td>
    </tr>
  );
}