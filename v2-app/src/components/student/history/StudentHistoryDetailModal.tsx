import ModalBase from "@/components/ui/ModalBase";
import StatusBadge from "@/components/ui/StatusBadge";
import type { StudentHistoryRow } from "@/pages/student/history";

type Props = {
  booking: StudentHistoryRow | null;
  onClose: () => void;
};

function DetailItem({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-wide text-text-white-light">
        {label}
      </p>
      <div className="mt-1 text-sm font-semibold text-text-primary">{value}</div>
    </div>
  );
}

function FormatList({ text }: { text?: string }) {
  if (!text || text === "-") return <span>-</span>;
  
  return (
    <div className="space-y-0.5">
      {text.split(",").map((item, index) => (
        <div key={index} className="truncate" title={item.trim()}>
          {item.trim()}
        </div>
      ))}
    </div>
  );
}

export default function MentorHistoryDetailModal({ booking, onClose }: Props) {
  if (!booking) return null;

  const isGroup = booking.group_ids?.length > 1;

  return (
    <ModalBase isOpen={!!booking} onClose={onClose} maxWidth="max-w-xl">
      <div className="p-6">
        <div className="flex items-start justify-between gap-4 border-b border-white-border pb-4">
          <div>
            <h2 className="text-2xl font-extrabold text-up-maroon">
              Booking Details
            </h2>
            <p className="text-sm text-text-white-light mt-1">
              {booking.subject} - {booking.topic}
            </p>
          </div>

          <StatusBadge status={booking.status} />
        </div>

      <div className="flex-1 overflow-y-auto min-h-0 py-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <DetailItem label="Date" value={booking.date} />
          <DetailItem label="Room" value={booking.room} />
          <DetailItem label="Duration" value={booking.durationText} />
          <DetailItem label="Tutorial Mode" value={booking.mode} />
          <DetailItem label={isGroup ? "Students" : "Student"} value={<FormatList text={booking.studentNames} />} />
          <DetailItem label="Mentor" value={booking.mentor} />
        </div>
      </div>

        <div className="flex-1 py-2">
          <div className="mt-2 pt-2 pl-3 pb-2 border border-white-border flex flex-col gap-3 rounded-xl bg-white-complement">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2">
              <DetailItem label="Course Code" value={booking.subject} />
              <DetailItem label="Course Name" value={booking.subjectName} />
            </div>
            <DetailItem label="Topic" value={booking.topic} />
          </div>
        </div>

        <div className="shrink-0 pt-4 mt-1 border-t border-white-border flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="w-full px-5 py-2 rounded-lg border border-white-border bg-white text-sm font-bold text-text-primary hover:bg-white-hover transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </ModalBase>
  );
}