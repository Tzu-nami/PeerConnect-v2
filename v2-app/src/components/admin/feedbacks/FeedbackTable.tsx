import SearchBar from "@/components/ui/SearchBar";
import FeedbackTableRow from "@/components/admin/feedbacks/FeedbackTableRow";
import type { FeedbackRow, SortDirection, SortKey } from "@/pages/admin/feedbacks";
import { MdArrowDownward, MdArrowUpward, MdUnfoldMore } from "react-icons/md";
import {Semester} from "@/types/semester";
import SemesterFilter from "@/components/admin/SemesterFilter";
import EmptyState from "@/components/ui/charts/EmptyState";

type FeedbackTableProps = {
  feedbacks: FeedbackRow[];
  totalCount: number;
  searchQuery: string;
  onSearch: (query: string) => void;
  mentorOptions: string[];
  mentorFilter: string;
  onMentorFilter: (value: string) => void;
  ratingFilter: string;
  onRatingFilter: (value: string) => void;
  onResetFilters: () => void;
  sortCol: SortKey;
  sortDir: SortDirection;
  onSort: (col: SortKey) => void;
  onView: (feedback: FeedbackRow) => void;
    semesters: Semester[];
    selectedSemesterId: string | null;
    onSemesterChange: (id: string) => void;
};

const ratingOptions = ["Excellent", "Good", "Average", "Poor", "N/A"];

function SortIcon({
  col,
  sortCol,
  sortDir,
}: {
  col: SortKey;
  sortCol: SortKey;
  sortDir: SortDirection;
}) {
  if (sortCol !== col) {
    return <MdUnfoldMore className="text-text-brown-light" />;
  }

  return sortDir === "asc" ? (
    <MdArrowUpward className="text-text-brown" />
  ) : (
    <MdArrowDownward className="text-text-brown" />
  );
}

export default function FeedbackTable({
  feedbacks,
  totalCount,
  searchQuery,
  onSearch,
  mentorOptions,
  mentorFilter,
  onMentorFilter,
  ratingFilter,
  onRatingFilter,
  onResetFilters,
  sortCol,
  sortDir,
  onSort,
  onView,
  semesters,
  selectedSemesterId,
  onSemesterChange
}: FeedbackTableProps) {
  const headerClass =
    "flex items-center gap-1 text-xs uppercase tracking-wider hover:text-text-brown transition cursor-pointer";

  function sortableHeader(label: string, col: SortKey) {
    return (
      <button
        onClick={() => onSort(col)}
        className={`${headerClass} ${
          sortCol === col
            ? "font-extrabold text-text-brown"
            : "font-bold text-text-brown-light"
        }`}
      >
        {label}
        <SortIcon col={col} sortCol={sortCol} sortDir={sortDir} />
      </button>
    );
  }

  return (
    <div className="rounded-xl shadow-md border border-cream-border mt-5">
      <div className="flex flex-col xl:flex-row xl:justify-between xl:items-center gap-4 p-5">
        <div>
          <h2 className="font-bold text-lg">Anonymous Student Feedbacks</h2>
          <p className="text-sm text-text-brown-light font-medium">
            {totalCount} Feedback{totalCount !== 1 ? "s" : ""} found
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <SearchBar
            value={searchQuery}
            onChange={onSearch}
            placeholder="Search feedback..."
            className="w-56"
          />

            <SemesterFilter
                semesters={semesters}
                selected={selectedSemesterId}
                onChange={onSemesterChange}
            />

          <select
            value={mentorFilter}
            onChange={(event) => onMentorFilter(event.target.value)}
            className="h-[36px] rounded-lg border-cream-border text-xs text-text-brown focus:border-text-brown-light focus:ring-text-brown-light/30"
          >
            <option value="all">All Mentors</option>
            {mentorOptions.map((mentor) => (
              <option key={mentor} value={mentor}>
                {mentor}
              </option>
            ))}
          </select>

          <select
            value={ratingFilter}
            onChange={(event) => onRatingFilter(event.target.value)}
            className="h-[36px] rounded-lg border-cream-border text-xs text-text-brown focus:border-text-brown-light focus:ring-text-brown-light/30"
          >
            <option value="all">All Ratings</option>
            {ratingOptions.map((rating) => (
              <option key={rating} value={rating}>
                {rating}
              </option>
            ))}
          </select>

          <button
            onClick={onResetFilters}
            className="h-[36px] px-3 rounded-lg border border-cream-border text-xs font-bold text-text-brown-light hover:bg-cream-dark transition-colors cursor-pointer"
          >
            Reset
          </button>
        </div>
      </div>

      <div className="border-t border-cream-border overflow-auto">
        <table className="w-full min-w-[980px] text-left text-sm table-fixed">
          <thead className="border-b border-cream-border bg-cream-dark">
            <tr>
              <th className="px-5 py-3 w-[15%]">
                {sortableHeader("Date", "date")}
              </th>
              <th className="px-5 py-3 w-[16%]">
                {sortableHeader("Mentor", "mentor_name")}
              </th>
              <th className="px-5 py-3 w-[12%]">
                {sortableHeader("Subject", "subject")}
              </th>
              <th className="px-5 py-3 w-[17%]">
                {sortableHeader("Topic", "topic")}
              </th>
              <th className="px-5 py-3 w-[22%]">
                {sortableHeader("Feedback", "feedback")}
              </th>
              <th className="px-5 py-3 w-[18%]">
                {sortableHeader("Rating", "rating")}
              </th>
            </tr>
          </thead>

            <tbody>
            {!selectedSemesterId ? (
                <tr>
                    <td colSpan={6}>
                        <EmptyState />
                    </td>
                </tr>
            ) : feedbacks.length > 0 ? (
                feedbacks.map((feedback) => (
                    <FeedbackTableRow key={feedback.id} feedback={feedback} onView={onView} />
                ))
            ) : (
                <tr>
                    <td colSpan={6} className="text-center py-12 text-sm text-text-brown-light italic">
                        <p className="text-sm font-semibold text-slate-500">No sessions match your filters.</p>
                    </td>
                </tr>
            )}
            </tbody>
        </table>
      </div>
    </div>
  );
}