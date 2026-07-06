import ModalBase from "@/components/ui/ModalBase";
import StatusBadge from "@/components/ui/StatusBadge";
import type { StudentHistoryRow } from "@/pages/student/history";

type Props = {
  isOpen: boolean;
  title: string;
  subtitle: string;
  bookings: StudentHistoryRow[];
  showHours?: boolean;
  onClose: () => void;
  onSelect: (booking: StudentHistoryRow) => void;
};

export default function StudentHistoryStatsModal({
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
        <div className="border-b border-cream-border pb-4">
          <h2 className="text-2xl font-extrabold text-up-maroon">{title}</h2>
          <p className="text-sm text-text-brown-light mt-1">{subtitle}</p>
        </div>

        <div className="mt-4 max-h-[420px] overflow-y-auto">
          {bookings.length > 0 ? (
            <div className="space-y-3">
              {bookings.map((booking) => (
                <button
                  key={booking.id}
                  type="button"
                  onClick={() => onSelect(booking)}
                  className="w-full text-left rounded-lg border border-cream-border bg-cream px-4 py-3 hover:bg-cream-hover transition cursor-pointer"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-bold text-sm text-text-brown truncate">
                        {booking.subject} - {booking.topic}
                      </p>
                      <p className="text-xs text-text-brown-light mt-1">
                        {booking.date} •{" "}
                        {showHours ? booking.durationText : booking.time}
                      </p>
                      <p className="text-xs text-text-brown-light mt-1 truncate">
                        Mentor: {booking.mentor}
                      </p>
                    </div>

                    <StatusBadge status={booking.status} />
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
            className="w-full px-5 py-2 rounded-lg border border-cream-border bg-white text-sm font-bold text-text-brown hover:bg-cream-hover transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </ModalBase>
  );
}