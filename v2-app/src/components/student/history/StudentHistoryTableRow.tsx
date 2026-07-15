
import StatusBadge from "@/components/ui/StatusBadge";
import type { StudentHistoryRow } from "@/pages/student/history";

type Props = {
  booking: StudentHistoryRow;
  onView: (booking: StudentHistoryRow) => void;
};

export default function StudentHistoryTableRow({ booking, onView }: Props) {
  return (
    <tr
      onClick={() => onView(booking)}
      className="border-t border-white-border hover:bg-white-hover transition cursor-pointer group"
    >
      <td className="px-5 py-4 align-middle">
        <p className="font-bold text-sm text-text-primary truncate">
          {booking.date}
        </p>
        <p className="text-text-white-light text-xs truncate mt-0.5">
          {booking.status === "completed" ? booking.durationText : booking.time}
        </p>
      </td>

      <td className="px-5 py-4 align-middle">
        <p
          className="font-bold text-sm text-text-primary truncate"
          title={booking.subject}
        >
          {booking.subject}
        </p>
        <p
          className="text-text-white-light text-xs truncate mt-0.5"
          title={booking.topic}
        >
          {booking.topic}
        </p>
      </td>

      <td className="px-5 py-4 align-middle">
        <p
          className="font-bold text-sm text-text-primary truncate"
          title={booking.mentor}
        >
          {booking.mentor}
        </p>
        <p
          className="text-text-white-light text-xs truncate mt-0.5"
          title={booking.subjectName}
        >
          {booking.subjectName}
        </p>
      </td>

      <td className="px-5 py-4 align-middle">
        <p
          className="font-bold text-sm text-text-primary truncate"
          title={booking.room}
        >
          {booking.room}
        </p>
        <p
          className="text-text-white-light text-xs truncate mt-0.5"
          title={booking.mode}
        >
          {booking.mode}
        </p>
      </td>

      <td className="px-5 py-4 align-middle text-center">
        <StatusBadge status={booking.status} />
      </td>
    </tr>
  );
}