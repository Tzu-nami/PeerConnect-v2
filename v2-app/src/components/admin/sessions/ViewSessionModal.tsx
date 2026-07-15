import ModalBase from "@/components/ui/ModalBase";
import StatusBadge from "@/components/ui/StatusBadge";
import type { AdminSession } from "@/types/admin";

type Props = {
  isOpen: boolean;
  session: AdminSession | null;
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

export default function AdminSessionDetailModal({ session, onClose }: Props) {
  if (!session) return null;

  const isGroup = session.group_ids?.length > 1;

  return (
    <ModalBase isOpen={!!session} onClose={onClose} maxWidth="max-w-xl">
      <div className="p-6 flex flex-col max-h-[90vh]">
        <div className="shrink-0 flex items-start justify-between gap-4 border-b border-white-border pb-4">
          <div>
            <h2 className="text-2xl font-extrabold text-up-maroon">
              Session Details
            </h2>
            <p className="text-sm text-text-muted mt-1">
              {session.subject} - {session.topic}
            </p>
          </div>

          <StatusBadge status={session.status} />
        </div>
        <div className="flex-1 overflow-y-auto min-h-0 py-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <DetailItem label="Date" value={session.date} />
            <DetailItem label="Room" value={session.room} />
            <DetailItem label="Duration" value={session.durationText} />
            <DetailItem label="Tutorial Mode" value={session.mode} />
            <DetailItem label={isGroup ? "Students" : "Student"} value={<FormatList text={session.studentNames} />} />
            <DetailItem label={isGroup ? "Emails" : "Email"} value={<FormatList text={session.emails} />} />
            <DetailItem label="Course Code" value={session.subject} />
            <DetailItem label="Course Name" value={session.subjectName} />
            <DetailItem label={isGroup ? "Year Levels" : "Year Level"} value={<FormatList text={session.yearLevel} />} />
            <DetailItem label={isGroup ? "Degree Programs" : "Degree Program"} value={<FormatList text={session.degreeProgram} />} />
          </div>
        </div>

        <div className="flex-1 py-2">
          <div className="mt-2 pt-2 pl-3 pb-2 border border-white-border flex flex-col gap-3 rounded-xl bg-white-complement">
            <DetailItem label="Mentor" value={session.mentor} />
            <DetailItem label="Topic" value={session.topic} />
          </div>

          {session.is_open && (
            <div className="mt-5 rounded-lg border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm font-semibold text-yellow-700">
              This is an open booking that can be claimed by any qualified mentors.
            </div>
          )}
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