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
    return <MdUnfoldMore className="text-text-white-light" />;
  }

  return sortDir === "asc" ? (
    <MdArrowUpward className="text-text-primary" />
  ) : (
    <MdArrowDownward className="text-text-primary" />
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
    "flex items-center gap-1 text-xs uppercase tracking-wider hover:text-text-primary transition cursor-pointer";

  function sortableHeader(label: string, col: SortKey) {
    return (
      <button
        onClick={() => onSort(col)}
        className={`${headerClass} ${
          sortCol === col
            ? "font-extrabold text-text-primary"
            : "font-bold text-text-white-light"
        }`}
      >
        {label}
        <SortIcon col={col} sortCol={sortCol} sortDir={sortDir} />
      </button>
    );
  }

  return (
    <div className="rounded-xl shadow-md border border-white-border mt-5 bg-white">
      <div className="flex flex-col xl:flex-row xl:justify-between xl:items-center gap-4 p-5">
        <div>
          <h2 className="font-bold text-lg">Student Feedbacks</h2>
          <p className="text-sm text-text-white-light font-medium">
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
            className="px-4 py-2 text-xs font-medium text-text-primary border border-white-border rounded-lg bg-white outline-none focus:ring-1 focus:border-text-brown-light focus:ring-text-brown-light/30 transition-shadow h-[36px] w-[160px] shadow-sm cursor-pointer truncate"
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
            className="px-4 py-2 text-xs font-medium text-text-primary border border-white-border rounded-lg bg-white outline-none focus:ring-1 focus:border-text-brown-light focus:ring-text-brown-light/30 transition-shadow h-[36px] w-[110px] shadow-sm cursor-pointer"
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
            className="h-[36px] px-3 rounded-lg border border-white-border text-xs font-bold text-text-white-light hover:bg-white-dark transition-colors cursor-pointer"
          >
            Reset
          </button>
        </div>
      </div>

      <div className="border-t border-white-border overflow-auto">
        <table className="w-full min-w-[980px] text-left text-sm table-fixed">
          <thead className="border-b border-white-border bg-white-dark">
            <tr>
              <th className="px-5 py-3 w-[13%]">
                {sortableHeader("Date", "date")}
              </th>
              <th className="px-5 py-3 w-[14%]">
                {sortableHeader("Mentor", "mentor_name")}
              </th>
              <th className="px-5 py-3 w-[10%]">
                {sortableHeader("Subject", "subject")}
              </th>
              <th className="px-5 py-3 w-[17%]">
                {sortableHeader("Topic", "topic")}
              </th>
              <th className="px-5 py-3 w-[20%]">
                {sortableHeader("Feedback", "feedback")}
              </th>
              <th className="px-5 py-3 w-[18%]">
                {sortableHeader("Rating", "rating")}
              </th>
              <th className="px-5 py-3 w-[8%]">
                {sortableHeader("Time", "time")}
              </th>
            </tr>
          </thead>

            <tbody>
            {!selectedSemesterId ? (
                <tr>
                    <td colSpan={7}>
                        <EmptyState />
                    </td>
                </tr>
            ) : feedbacks.length > 0 ? (
                feedbacks.map((feedback) => (
                    <FeedbackTableRow key={feedback.id} feedback={feedback} onView={onView} />
                ))
            ) : (
                <tr>
                    <td colSpan={7} className="text-center py-12 text-sm text-text-white-light italic">
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