import { FaStar } from "react-icons/fa6";

import ModalBase from "@/components/ui/ModalBase";
import type { MentorFeedbackRow } from "@/pages/mentor/feedbacks";

type Props = {
  feedback: MentorFeedbackRow | null;
  onClose: () => void;
};

const QUESTIONS = [
  "The mentor explained the lesson clearly.",
  "The mentor was prepared for the session.",
  "The mentor encouraged me to ask questions.",
  "The mentor answered my questions well.",
  "The mentor made the topic easier to understand.",
  "The mentor used the time effectively.",
  "The mentor was patient and respectful.",
  "The session helped me improve my understanding.",
  "I am satisfied with the tutorial session.",
];

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

function RatingPill({
  avg,
  label,
}: {
  avg: number | null;
  label: string;
}) {
  const className =
    avg === null
      ? "bg-slate-100 text-slate-500 border-slate-200"
      : avg >= 4.5
        ? "bg-green-50 text-green-700 border-green-200"
        : avg >= 3.5
          ? "bg-blue-50 text-blue-700 border-blue-200"
          : avg >= 2.5
            ? "bg-yellow-50 text-yellow-700 border-yellow-200"
            : "bg-red-50 text-red-700 border-red-200";

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-bold ${className}`}
    >
      <FaStar />
      {avg === null ? "N/A" : `${avg} - ${label}`}
    </span>
  );
}

export default function MentorFeedbackDetailModal({
  feedback,
  onClose,
}: Props) {
  if (!feedback) return null;

  const scores = [
    feedback.q1,
    feedback.q2,
    feedback.q3,
    feedback.q4,
    feedback.q5,
    feedback.q6,
    feedback.q7,
    feedback.q8,
    feedback.q9,
  ];

  return (
    <ModalBase isOpen={!!feedback} onClose={onClose} maxWidth="max-w-4xl">
      <div className="p-6 overflow-y-auto">
        <div className="flex items-start justify-between gap-4 border-b border-cream-border pb-4">
          <div>
            <h2 className="text-2xl font-extrabold text-up-maroon">
              Feedback Details
            </h2>
            <p className="text-sm text-text-brown-light mt-1">
              {feedback.subject} - {feedback.topic}
            </p>
          </div>

          <RatingPill avg={feedback.avg} label={feedback.avgLabel} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-5">
          <DetailItem label="Date" value={feedback.date_formatted} />
          <DetailItem label="Subject" value={feedback.subject} />
          <DetailItem label="Topic" value={feedback.topic} />
        </div>

        <div className="mt-5 pt-5 border-t border-cream-border">
          <DetailItem label="Written Feedback" value={feedback.feedback} />
        </div>

        <div className="mt-5 pt-5 border-t border-cream-border">
          <p className="text-xs font-bold uppercase tracking-wide text-text-brown-light mb-3">
            Rating Breakdown
          </p>

          <div className="space-y-3">
            {QUESTIONS.map((question, index) => (
              <div
                key={question}
                className="flex flex-col gap-1 rounded-lg border border-cream-border bg-cream px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <p className="text-sm font-medium text-text-brown">
                  {index + 1}. {question}
                </p>
                <span className="text-sm font-extrabold text-up-maroon">
                  {scores[index] ?? "N/A"}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-5 pt-5 border-t border-cream-border">
          <DetailItem
            label="Would Recommend"
            value={
              feedback.q10 === null || feedback.q10 === undefined
                ? "N/A"
                : String(feedback.q10)
            }
          />
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