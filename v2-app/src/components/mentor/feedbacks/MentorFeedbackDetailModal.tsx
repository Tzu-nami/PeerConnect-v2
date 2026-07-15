import ModalBase from "@/components/ui/ModalBase";
import type { MentorFeedbackRow } from "@/pages/mentor/feedbacks";
import { FaCheck, FaXmark } from "react-icons/fa6";

const questions = [
  "The peer mentor demonstrated mastery of the topic.",
  "The peer mentor explained the concepts clearly.",
  "The peer mentor encouraged me to ask questions.",
  "The peer mentor answered my questions effectively.",
  "The peer mentor used examples or strategies that helped me understand.",
  "The session helped me understand the topic better.",
  "The session was organized and easy to follow.",
  "The session met my learning needs.",
  "Overall, I am satisfied with the peer mentoring session.",
];

function getBarColor(avg: number | null) {
  if (avg === null) return "#94a3b8";
  if (avg >= 4.5) return "#16a34a";
  if (avg >= 3.5) return "#2563eb";
  if (avg >= 2.5) return "#eab308";
  return "#dc2626";
}

function isOnTime(value: MentorFeedbackRow["q10"]) {
  return value === true || value === "1" || value === 1;
}

export default function MentorFeedbackDetailModal({
  feedback,
  onClose,
}: {
  feedback: MentorFeedbackRow | null;
  onClose: () => void;
}) {
  return (
    <ModalBase isOpen={!!feedback} onClose={onClose}>
      {feedback && (
        <>
          <div className="flex items-center justify-between px-6 py-4 border-b border-white-border">
            <div>
              <h2 className="text-lg font-extrabold text-up-maroon">
                Session Feedback Details
              </h2>
            </div>

            <button
              onClick={onClose}
              className="text-slate-400 hover:text-red-700 text-xl font-bold transition cursor-pointer"
            >
              ✕
            </button>
          </div>

          <div className="px-6 py-5 overflow-y-auto">
            <div className="mb-5">
              <p className="text-xs font-bold text-text-white-light uppercase tracking-wider">
                Session Details
              </p>

              <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                <div className="rounded-lg border border-white-border bg-white-complement px-3 py-2">
                  <p className="text-xs text-text-white-light font-bold uppercase">
                    Date
                  </p>
                  <p className="font-semibold text-text-primary">
                    {feedback.date_formatted}
                  </p>
                </div>

                <div className="rounded-lg border border-white-border bg-white-complement px-3 py-2">
                  <p className="text-xs text-text-white-light font-bold uppercase">
                    Subject
                  </p>
                  <p className="font-semibold text-text-primary">
                    {feedback.subject}
                  </p>
                </div>

                <div className="rounded-lg border border-white-border bg-white-complement px-3 py-2">
                  <p className="text-xs text-text-white-light font-bold uppercase">
                    Rating
                  </p>
                  <p className="font-semibold text-text-primary">
                    {feedback.avg !== null
                      ? `${feedback.avg.toFixed(1)} / 5 - ${feedback.avgLabel}`
                      : "No score"}
                  </p>
                </div>
              </div>

              <div className="mt-3 rounded-lg bg-white-complement border border-white-border px-3 py-2">
                <p className="text-xs text-text-white-light font-bold uppercase">
                  Topic
                </p>
                <p className="text-sm text-text-primary">{feedback.topic}</p>
              </div>
            </div>

            {feedback.avg !== null && (
              <div className="bg-white border border-slate-200 rounded-xl p-4 mb-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Average Score - Q1 to Q9
                  </span>
                  <span
                    className="text-2xl font-black"
                    style={{ color: getBarColor(feedback.avg) }}
                  >
                    {feedback.avg.toFixed(1)}{" "}
                    <span className="text-sm text-slate-400">/ 5</span>
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="h-2 flex-1 rounded-full bg-slate-200 overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${(feedback.avg / 5) * 100}%`,
                        background: getBarColor(feedback.avg),
                      }}
                    />
                  </div>
                  <span
                    className="text-xs font-bold"
                    style={{ color: getBarColor(feedback.avg) }}
                  >
                    {feedback.avgLabel}
                  </span>
                </div>
              </div>
            )}

            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              Likert Scale (1 = Strongly Disagree, 5 = Strongly Agree)
            </p>

            <div className="divide-y divide-white-border border-y border-white-border">
              {questions.map((question, index) => {
                const key = `q${index + 1}` as keyof MentorFeedbackRow;
                const score = feedback[key] as number | null;

                return (
                  <div
                    key={question}
                    className="grid grid-cols-[28px_1fr_auto] gap-3 py-3 items-center"
                  >
                    <div className="w-6 h-6 rounded-full bg-white-dark text-text-white-light text-xs font-bold flex items-center justify-center">
                      {index + 1}
                    </div>

                    <div className="text-sm text-text-primary">{question}</div>

                    <div className="flex items-center gap-1.5">
                      {score === null ? (
                        <span className="text-xs text-slate-400">-</span>
                      ) : (
                        <>
                          {[1, 2, 3, 4, 5].map((dot) => (
                            <span
                              key={dot}
                              className={`w-2 h-2 rounded-full ${
                                dot <= score
                                  ? "bg-up-maroon"
                                  : "bg-slate-200"
                              }`}
                            />
                          ))}
                          <span className="ml-1 text-xs font-bold text-up-maroon">
                            {score}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}

              <div className="grid grid-cols-[28px_1fr_auto] gap-3 py-3 items-center">
                <div className="w-6 h-6 rounded-full bg-white-dark text-text-white-light text-xs font-bold flex items-center justify-center">
                  10
                </div>

                <div className="text-sm text-text-primary">
                  The peer mentor started the session on time.
                </div>

                {feedback.q10 === null ? (
                  <span className="text-xs text-slate-400">-</span>
                ) : isOnTime(feedback.q10) ? (
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-green-700 bg-green-50 border border-green-200 px-2 py-1 rounded-full">
                    <FaCheck /> Yes
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-red-700 bg-red-50 border border-red-200 px-2 py-1 rounded-full">
                    <FaXmark /> No
                  </span>
                )}
              </div>
            </div>

            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-5 mb-2">
              Additional Remarks
            </p>

            {feedback.has_feedback ? (
              <div className="rounded-xl bg-white-dark border border-slate-200 p-4 text-sm text-slate-700 leading-6 whitespace-pre-wrap">
                {feedback.feedback}
              </div>
            ) : (
              <p className="text-sm text-slate-400 italic">
                No additional remarks provided.
              </p>
            )}
          </div>
        </>
      )}
    </ModalBase>
  );
}