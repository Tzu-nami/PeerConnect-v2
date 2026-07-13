import { MdArrowDownward, MdArrowUpward, MdKeyboardArrowDown, MdUnfoldMore } from "react-icons/md";

import SearchBar from "@/components/ui/SearchBar";
import MentorFeedbackTableRow from "./MentorFeedbackTableRow";
import type { MentorFeedbackRow, MentorFeedbackSortKey, SortDirection } from "@/pages/mentor/feedbacks";
import {Semester} from "@/types/semester";
import SemesterFilter from "@/components/admin/SemesterFilter";
import EmptyState from "@/components/ui/charts/EmptyState";

type Props = {
  feedbacks: MentorFeedbackRow[];
  totalCount: number;
  searchQuery: string;
  onSearch: (query: string) => void;
  subjectOptions: string[];
  subjectFilter: string;
  onSubjectFilter: (subject: string) => void;
  onResetFilters: () => void;
  sortCol: MentorFeedbackSortKey;
  sortDir: SortDirection;
  onSort: (col: MentorFeedbackSortKey) => void;
  onView: (feedback: MentorFeedbackRow) => void;
    semesters: Semester[];
    selectedSemesterId: string | null;
    onSemesterChange: (id: string) => void;
};

function SortIcon({
  col,
  sortCol,
  sortDir,
}: {
  col: MentorFeedbackSortKey;
  sortCol: MentorFeedbackSortKey;
  sortDir: SortDirection;
}) {
  if (sortCol !== col) return <MdUnfoldMore className="text-text-white-light" />;

  return sortDir === "asc" ? (
    <MdArrowUpward className="text-text-primary" />
  ) : (
    <MdArrowDownward className="text-text-primary" />
  );
}

export default function MentorFeedbackTable({
  feedbacks,
  totalCount,
  searchQuery,
  onSearch,
  subjectOptions,
  subjectFilter,
  onSubjectFilter,
  onResetFilters,
  sortCol,
  sortDir,
  onSort,
  onView,
    semesters,
    selectedSemesterId,
    onSemesterChange
}: Props) {
  return (
    <div className="rounded-xl shadow-md border border-white-border mt-5 bg-white">
      <div className="flex flex-wrap gap-4 justify-between items-center p-5">
        <div>
          <h2 className="font-bold text-lg text-text-primary">All Feedbacks</h2>
          <p className="text-sm text-text-white-light font-medium">
            {totalCount} Feedback{totalCount !== 1 ? "s" : ""} found
          </p>
        </div>

        <div className="flex gap-3 items-center flex-wrap">
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

          <div className="relative">
            <select
              value={subjectFilter}
              onChange={(event) => onSubjectFilter(event.target.value)}
              className="appearance-none px-4 py-2 pr-10 text-xs font-medium text-text-primary border border-white-border rounded-lg bg-white outline-none focus:ring-1 focus:border-text-brown-light focus:ring-text-brown-light/30 transition-shadow h-[36px] min-w-[150px] shadow-sm cursor-pointer"
            >
              <option value="all">All Subjects</option>
              {subjectOptions.map((subject) => (
                <option key={subject} value={subject}>
                  {subject}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={onResetFilters}
            className="px-4 py-2 text-xs font-bold text-text-white-light border border-white-border rounded-lg bg-white hover:bg-white-hover transition h-[36px] shadow-sm cursor-pointer"
          >
            Reset
          </button>
        </div>
      </div>

      <div className="border-t border-white-border overflow-x-auto">
        <table className="w-full text-left text-sm table-fixed min-w-[760px]">
          <thead className="border-b border-white-border bg-white">
            <tr>
              <th className="px-5 py-3 w-[14%]">
                <button
                  onClick={() => onSort("date")}
                  className={`flex items-center gap-1 text-xs uppercase tracking-wider hover:text-text-primary transition cursor-pointer ${
                    sortCol === "date"
                      ? "font-extrabold text-text-primary"
                      : "font-bold text-text-white-light"
                  }`}
                >
                  Date
                  <SortIcon col="date" sortCol={sortCol} sortDir={sortDir} />
                </button>
              </th>

              <th className="px-5 py-3 w-[14%]">
                <button
                  onClick={() => onSort("subject")}
                  className={`flex items-center gap-1 text-xs uppercase tracking-wider hover:text-text-primary transition cursor-pointer ${
                    sortCol === "subject"
                      ? "font-extrabold text-text-primary"
                      : "font-bold text-text-white-light"
                  }`}
                >
                  Subject
                  <SortIcon
                    col="subject"
                    sortCol={sortCol}
                    sortDir={sortDir}
                  />
                </button>
              </th>

              <th className="px-5 py-3 w-[22%]">
                <button
                  onClick={() => onSort("topic")}
                  className={`flex items-center gap-1 text-xs uppercase tracking-wider hover:text-text-primary transition cursor-pointer ${
                    sortCol === "topic"
                      ? "font-extrabold text-text-primary"
                      : "font-bold text-text-white-light"
                  }`}
                >
                  Topic
                  <SortIcon col="topic" sortCol={sortCol} sortDir={sortDir} />
                </button>
              </th>

              <th className="px-5 py-3 w-[30%] text-xs font-bold text-text-white-light uppercase tracking-wider">
                Feedback
              </th>

              <th className="px-5 py-3 w-[20%] text-center">
                <button
                  onClick={() => onSort("rating")}
                  className={`flex items-center justify-center gap-1 text-xs uppercase tracking-wider hover:text-text-primary transition cursor-pointer mx-auto ${
                    sortCol === "rating"
                      ? "font-extrabold text-text-primary"
                      : "font-bold text-text-white-light"
                  }`}
                >
                  Rating
                  <SortIcon col="rating" sortCol={sortCol} sortDir={sortDir} />
                </button>
              </th>
            </tr>
          </thead>



          <tbody>
          {!selectedSemesterId ? (
              <tr>
                  <td colSpan={5}>
                      <EmptyState />
                  </td>
              </tr>
          ) : feedbacks.length > 0 ? (
              feedbacks.map((feedback) => (
                  <MentorFeedbackTableRow key={feedback.id} feedback={feedback} onView={onView} />
              ))
          ) : (
              <tr>
                  <td colSpan={5} className="text-center py-12 text-sm text-text-white-light italic">
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