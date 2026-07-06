import { FaStar } from "react-icons/fa6";

import type { MentorFeedbackRow } from "@/pages/mentor/feedbacks";

type Props = {
  feedback: MentorFeedbackRow;
  onView: (feedback: MentorFeedbackRow) => void;
};

function getRatingClass(avg: number | null) {
  if (avg === null) return "bg-slate-100 text-slate-500 border-slate-200";
  if (avg >= 4.5) return "bg-green-50 text-green-700 border-green-200";
  if (avg >= 3.5) return "bg-blue-50 text-blue-700 border-blue-200";
  if (avg >= 2.5) return "bg-yellow-50 text-yellow-700 border-yellow-200";

  return "bg-red-50 text-red-700 border-red-200";
}

export default function MentorFeedbackTableRow({ feedback, onView }: Props) {
  return (
    <tr
      onClick={() => onView(feedback)}
      className="border-t border-cream-border hover:bg-cream-hover transition cursor-pointer"
    >
      <td className="px-5 py-4 align-middle">
        <p className="font-bold text-sm text-text-brown truncate">
          {feedback.date_formatted}
        </p>
      </td>

      <td className="px-5 py-4 align-middle">
        <span className="inline-flex rounded-md border border-red-100 bg-red-50 px-2 py-1 text-xs font-bold text-red-700">
          {feedback.subject}
        </span>
      </td>

      <td className="px-5 py-4 align-middle">
        <p
          className="text-sm font-semibold text-text-brown truncate"
          title={feedback.topic}
        >
          {feedback.topic}
        </p>
      </td>

      <td className="px-5 py-4 align-middle">
        <p
          className="text-sm text-text-brown-light truncate"
          title={feedback.feedback}
        >
          {feedback.feedback}
        </p>
      </td>

      <td className="px-5 py-4 align-middle text-center">
        <span
          className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-bold ${getRatingClass(
            feedback.avg
          )}`}
        >
          <FaStar />
          {feedback.avg === null ? "N/A" : `${feedback.avg} - ${feedback.avgLabel}`}
        </span>
      </td>
    </tr>
  );
}