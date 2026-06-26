import type { FeedbackRow } from "@/pages/admin/feedbacks";
import { FaCheck, FaStar, FaXmark } from "react-icons/fa6";

function getRatingColor(avg: number | null) {
  if (avg === null) return "text-gray-400 bg-gray-50 border-gray-200";
  if (avg >= 4.5) return "text-green-700 bg-green-50 border-green-200";
  if (avg >= 3.5) return "text-blue-700 bg-blue-50 border-blue-200";
  if (avg >= 2.5) return "text-yellow-700 bg-yellow-50 border-yellow-200";
  return "text-red-700 bg-red-50 border-red-200";
}

function isOnTime(value: FeedbackRow["q10"]) {
  return value === true || value === "1" || value === 1;
}

export default function FeedbackTableRow({
  feedback,
  onView,
}: {
  feedback: FeedbackRow;
  onView: (feedback: FeedbackRow) => void;
}) {
  return (
    <tr
      onClick={() => onView(feedback)}
      className="border-b border-cream-border hover:bg-cream-hover transition cursor-pointer group"
    >
      <td className="px-5 py-6 text-xs font-semibold text-text-brown">
        {feedback.date_formatted}
      </td>

      <td className="px-5 py-6 text-xs font-semibold text-text-brown">
        <span className="truncate block">{feedback.mentor_name}</span>
      </td>

      <td className="px-5 py-6">
        <span className="bg-red-50 text-red-700 px-2 py-0.5 rounded text-[10px] font-bold border border-red-100 whitespace-nowrap">
          {feedback.subject}
        </span>
      </td>

      <td className="px-5 py-6 text-xs text-text-brown-light">
        <span className="truncate block" title={feedback.topic}>
          {feedback.topic}
        </span>
      </td>

      <td className="px-5 py-6 text-xs text-text-brown-light">
        <span className="truncate block" title={feedback.feedback}>
          {feedback.feedback}
        </span>
      </td>

      <td className="px-5 py-6">
        <div className="flex items-center gap-1.5 flex-wrap">
          {feedback.avg !== null ? (
            <span
              className={`inline-flex items-center gap-1 border px-2 py-1 rounded-full text-[10px] font-bold whitespace-nowrap ${getRatingColor(
                feedback.avg
              )}`}
            >
              <FaStar className="text-[9px]" />
              {feedback.avg.toFixed(1)} / 5 - {feedback.avgLabel}
            </span>
          ) : (
            <span className="text-xs text-gray-300 italic">No score</span>
          )}

          {feedback.q10 !== null && (
            <span
              className={`inline-flex items-center gap-1 border px-2 py-1 rounded-full text-[10px] font-bold whitespace-nowrap ${
                isOnTime(feedback.q10)
                  ? "text-green-700 bg-green-50 border-green-200"
                  : "text-red-700 bg-red-50 border-red-200"
              }`}
            >
              {isOnTime(feedback.q10) ? <FaCheck /> : <FaXmark />}
              {isOnTime(feedback.q10) ? "On time" : "Late"}
            </span>
          )}
        </div>
      </td>
    </tr>
  );
}