import ModalBase from "@/components/ui/ModalBase";
import StatusBadge from "@/components/ui/StatusBadge";
import type { MentorHistoryRow } from "@/pages/mentor/history";

type Props = {
  isOpen: boolean;
  title: string;
  subtitle: string;
  bookings: MentorHistoryRow[];
  showHours?: boolean;
  onClose: () => void;
  onSelect: (booking: MentorHistoryRow) => void;
};

function formatDuration(hours: number) {
  if (hours === 0) return "N/A";

  const totalMinutes = Math.round(hours * 60);
  const hrs = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;

  let durationString = "";
  if (hrs > 0) durationString += `${hrs} hr${hrs !== 1 ? 's' : ''}`;
  if (mins > 0) durationString += `${hrs > 0 ? ' ' : ''}${mins} min${mins !== 1 ? 's' : ''}`;

  return durationString || "0 mins";
}

export default function MentorHistoryStatsModal({
  isOpen,
  title,
  subtitle,
  bookings,
  showHours = false,
  onClose,
  onSelect,
}: Props) {
  return (
    <ModalBase isOpen={isOpen} onClose={onClose} maxWidth="max-w-xl">
      <div className="p-6">
        <div className="border-b border-white-border pb-4">
          <h2 className="text-2xl font-extrabold text-up-maroon">{title}</h2>
          <p className="text-sm text-text-white-light mt-1">{subtitle}</p>
        </div>

        <div className="mt-4 max-h-[420px] overflow-y-auto">
          {bookings.length > 0 ? (
            <div className="space-y-3">
              {bookings.map((booking) => (
                <button
                  key={booking.id}
                  type="button"
                  onClick={() => onSelect(booking)}
                  className="w-full text-left rounded-lg border border-white-border bg-white-complement px-4 py-3 hover:bg-white-complement-hover transition cursor-pointer"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-bold text-sm text-text-primary truncate">
                        {booking.subject} - {booking.topic}
                      </p>
                      <p className="text-xs text-text-white-light mt-1">
                        {booking.date} •{" "}
                        {showHours ? booking.durationText : booking.time}
                      </p>
                      <p className="text-xs text-text-white-light mt-1 truncate">
                        Mentor: {booking.mentor}
                      </p>
                    </div>

                    <div className="flex shrink-0 flex-col items-center gap-1">
                      <StatusBadge status={booking.status} />
                      {showHours && (
                        <p className="text-lg font-bold text-up-maroon">
                          {formatDuration(booking.durationHours)}
                        </p>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <p className="py-12 text-center text-sm font-semibold text-slate-500">
              No bookings found.
            </p>
          )}
        </div>

        <div className="mt-6">
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