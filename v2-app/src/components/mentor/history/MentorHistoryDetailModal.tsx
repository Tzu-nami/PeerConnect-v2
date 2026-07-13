import ModalBase from "@/components/ui/ModalBase";
import StatusBadge from "@/components/ui/StatusBadge";
import type { MentorHistoryRow } from "@/pages/mentor/history";

type Props = {
  booking: MentorHistoryRow | null;
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

export default function MentorHistoryDetailModal({ booking, onClose }: Props) {
  if (!booking) return null;

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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5">
          <DetailItem label="Date" value={booking.date} />
          <DetailItem label="Time" value={booking.time} />
          <DetailItem label="Duration" value={booking.durationText} />
          <DetailItem label="Tutorial Mode" value={booking.mode} />
          <DetailItem label="Mentor" value={booking.mentor} />
          <DetailItem label="Subject Code" value={booking.subject} />
        </div>

        <div className="mt-5 pt-5 border-t border-white-border">
          <DetailItem label="Subject Name" value={booking.subjectName} />
        </div>

        <div className="mt-5 pt-5 border-t border-white-border">
          <DetailItem label="Topic" value={booking.topic} />
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-up-maroon text-white text-sm font-bold hover:bg-up-maroon/90 transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </ModalBase>
  );
}