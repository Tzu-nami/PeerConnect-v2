import ModalBase from "@/components/ui/ModalBase";
import StatusBadge from "@/components/ui/StatusBadge";
import type { MentorSessionRow } from "@/pages/mentor/sessions";

type Props = {
  session: MentorSessionRow | null;
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
      <p className="text-xs font-bold uppercase tracking-wide text-text-brown-light">
        {label}
      </p>
      <div className="mt-1 text-sm font-semibold text-text-brown">{value}</div>
    </div>
  );
}

export default function MentorSessionDetailModal({ session, onClose }: Props) {
  if (!session) return null;

  return (
    <ModalBase isOpen={!!session} onClose={onClose} maxWidth="max-w-xl">
      <div className="p-6">
        <div className="flex items-start justify-between gap-4 border-b border-cream-border pb-4">
          <div>
            <h2 className="text-2xl font-extrabold text-up-maroon">
              Session Details
            </h2>
            <p className="text-sm text-text-brown-light mt-1">
              {session.subject} - {session.topic}
            </p>
          </div>

          <StatusBadge status={session.status} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5">
          <DetailItem label="Date" value={session.date} />
          <DetailItem label="Time" value={session.time} />
          <DetailItem label="Duration" value={session.durationText} />
          <DetailItem label="Tutorial Mode" value={session.mode} />
          <DetailItem label="Student" value={session.studentNames} />
          <DetailItem label="Email" value={session.emails} />
          <DetailItem label="Subject Code" value={session.subject} />
          <DetailItem label="Subject Name" value={session.subjectName} />
          <DetailItem label="Year Level" value={session.yearLevel} />
          <DetailItem label="Degree Program" value={session.degreeProgram} />
        </div>

        <div className="mt-5 pt-5 border-t border-cream-border">
          <DetailItem label="Topic" value={session.topic} />
        </div>

        {session.isOpen && (
          <div className="mt-5 rounded-lg border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm font-semibold text-yellow-700">
            This is an open pending booking that matches your subjects.
          </div>
        )}

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