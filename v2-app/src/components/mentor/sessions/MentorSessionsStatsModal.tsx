import ModalBase from "@/components/ui/ModalBase";
import StatusBadge from "@/components/ui/StatusBadge";
import type { MentorSessionRow } from "@/pages/mentor/sessions";

type Props = {
  isOpen: boolean;
  title: string;
  subtitle: string;
  sessions: MentorSessionRow[];
  showHours?: boolean;
  onClose: () => void;
  onSelect: (session: MentorSessionRow) => void;
};

export default function MentorSessionsStatsModal({
  isOpen,
  title,
  subtitle,
  sessions,
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
          {sessions.length > 0 ? (
            <div className="space-y-3">
              {sessions.map((session) => (
                <button
                  key={session.id}
                  type="button"
                  onClick={() => onSelect(session)}
                  className="w-full text-left rounded-lg border border-white-border bg-white px-4 py-3 hover:bg-white-hover transition cursor-pointer"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-bold text-sm text-text-primary truncate">
                        {session.subject} - {session.topic}
                      </p>
                      <p className="text-xs text-text-white-light mt-1">
                        {session.date} •{" "}
                        {showHours ? session.durationText : session.time}
                      </p>
                      <p className="text-xs text-text-white-light mt-1 truncate">
                        Student: {session.student}
                      </p>
                    </div>

                    <div className="flex shrink-0 flex-col items-center gap-1">
  <StatusBadge status={session.status} />

  {showHours && (
    <p className="text-lg font-extrabold text-up-maroon">
      {session.durationHours === 1
        ? "1 hr"
        : `${Number(session.durationHours.toFixed(2))} hrs`}
    </p>
  )}
</div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <p className="py-12 text-center text-sm font-semibold text-slate-500">
              No sessions found.
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