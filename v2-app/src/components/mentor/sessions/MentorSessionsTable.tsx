import { useState } from "react";
import { MdArrowDownward, MdArrowUpward, MdKeyboardArrowDown, MdUnfoldMore } from "react-icons/md";

import SearchBar from "@/components/ui/SearchBar";
import MentorSessionsTableRow from "./MentorSessionsTableRow";
import type { MentorSessionRow, MentorSessionSortKey, SortDirection } from "@/pages/mentor/sessions";
import {Semester} from "@/types/semester";
import SemesterFilter from "@/components/admin/SemesterFilter";
import EmptyState from "@/components/ui/charts/EmptyState";

type Props = {
  sessions: MentorSessionRow[];
  totalCount: number;
  searchQuery: string;
  onSearch: (query: string) => void;
  statusFilters: string[];
  onStatusChange: (statuses: string[]) => void;
  availableStatuses: string[];
  sortCol: MentorSessionSortKey;
  sortDir: SortDirection;
  onSort: (col: MentorSessionSortKey) => void;
  onView: (session: MentorSessionRow) => void;
  onEdit: (session: MentorSessionRow) => void;
  onCancel: (session: MentorSessionRow) => void;
  onAccept: (session: MentorSessionRow) => void;
  onReject: (session: MentorSessionRow) => void;
  onComplete: (session: MentorSessionRow) => void;
  onNoShow: (session: MentorSessionRow) => void;
    semesters: Semester[];
    selectedSemesterId: string | null;
    onSemesterChange: (id: string) => void;
};

const getFilterLabel = (status: string) => {
  if (status === 'no_show') return 'No Show';
  if (status === 'rejected') return 'Unavailable';
  return status.charAt(0).toUpperCase() + status.slice(1);
};

function SortIcon({
  col,
  sortCol,
  sortDir,
}: {
  col: MentorSessionSortKey;
  sortCol: MentorSessionSortKey;
  sortDir: SortDirection;
}) {
  if (sortCol !== col) return <MdUnfoldMore className="text-text-muted" />;

  return sortDir === "asc" ? (
    <MdArrowUpward className="text-text-primary" />
  ) : (
    <MdArrowDownward className="text-text-primary" />
  );
}

export default function MentorSessionsTable({
  sessions,
  totalCount,
  searchQuery,
  onSearch,
  statusFilters,
  onStatusChange,
  availableStatuses,
  sortCol,
  sortDir,
  onSort,
  onView,
  onEdit,
  onCancel,
  onAccept,
  onReject,
  onComplete,
  onNoShow,
    semesters,
    selectedSemesterId,
    onSemesterChange
}: Props) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  function toggleStatus(status: string) {
    if (statusFilters.includes(status)) {
      onStatusChange(statusFilters.filter((item) => item !== status));
    } else {
      onStatusChange([...statusFilters, status]);
    }
  }

  return (
    <div className="rounded-xl shadow-md border border-white-border mt-5 bg-white">
      <div className="flex flex-wrap gap-4 justify-between items-center p-5">
        <div>
          <h2 className="font-bold text-lg text-text-primary">All Sessions</h2>
          <p className="text-sm text-text-muted font-medium">
            {totalCount} Session{totalCount !== 1 ? "s" : ""} found
          </p>
        </div>

        <div className="flex gap-3 items-center flex-wrap">
          <SearchBar
            value={searchQuery}
            onChange={onSearch}
            placeholder="Search sessions..."
            className="w-56"
          />

            <SemesterFilter
                semesters={semesters}
                selected={selectedSemesterId}
                onChange={onSemesterChange}
            />

          <div className="relative">
            <button
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="px-4 py-2 text-xs font-medium text-text-primary border border-white-border rounded-lg bg-white outline-none focus:ring-1 focus:border-text-muted focus:ring-text-muted/30 transition-shadow h-[36px] min-w-[150px] flex items-center justify-between gap-3 shadow-sm cursor-pointer"
            >
              <span>
                {statusFilters.length === 0
                  ? 'All Statuses'
                  : statusFilters.length === 1
                    ? getFilterLabel(statusFilters[0])
                    : `${statusFilters.length} Selected`}
              </span>
              <MdKeyboardArrowDown
                className={`text-xl text-slate-400 transition-transform ${
                  isDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {isDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsDropdownOpen(false)}
                />

                <div className="absolute right-0 mt-2 w-48 bg-white border border-white-border rounded-xl shadow-xl z-50 py-2 overflow-hidden">
                  {availableStatuses.map((status) => (
                    <label
                      key={status}
                      className="flex items-center gap-3 px-4 py-2.5 hover:bg-white cursor-pointer transition"
                    >
                      <input
                        type="checkbox"
                        checked={statusFilters.includes(status)}
                        onChange={() => toggleStatus(status)}
                        className="w-4 h-4 text-up-maroon border-white-border rounded focus:ring-up-maroon/30 cursor-pointer"
                      />
                      <span className="text-sm font-bold text-slate-700">
                        {getFilterLabel(status)}
                      </span>
                    </label>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="border-t border-white-border overflow-x-auto">
        <table className="w-full text-left text-sm table-fixed min-w-[900px]">
          <thead className="border-b border-white-border bg-white-dark">
            <tr>
              <th className="px-5 py-3 w-[20%]">
                <button
                  onClick={() => onSort("date")}
                  className={`flex items-center gap-1 text-xs uppercase tracking-wider hover:text-text-primary transition cursor-pointer ${
                    sortCol === "date"
                      ? "font-extrabold text-text-primary"
                      : "font-bold text-text-muted"
                  }`}
                >
                  Date & Time
                  <SortIcon col="date" sortCol={sortCol} sortDir={sortDir} />
                </button>
              </th>

              <th className="px-5 py-3 w-[20%]">
                <button
                  onClick={() => onSort("student")}
                  className={`flex items-center gap-1 text-xs uppercase tracking-wider hover:text-text-primary transition cursor-pointer ${
                    sortCol === "student"
                      ? "font-extrabold text-text-primary"
                      : "font-bold text-text-muted"
                  }`}
                >
                  Student
                  <SortIcon
                    col="student"
                    sortCol={sortCol}
                    sortDir={sortDir}
                  />
                </button>
              </th>

              <th className="px-5 py-3 w-[20%]">
                <button
                  onClick={() => onSort("subject")}
                  className={`flex items-center gap-1 text-xs uppercase tracking-wider hover:text-text-primary transition cursor-pointer ${
                    sortCol === "subject"
                      ? "font-extrabold text-text-primary"
                      : "font-bold text-text-muted"
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

              <th className="px-5 py-3 w-[15%]">
                <button
                  onClick={() => onSort("mode")}
                  className={`flex items-center gap-1 text-xs uppercase tracking-wider hover:text-text-primary transition cursor-pointer ${
                    sortCol === "mode"
                      ? "font-extrabold text-text-primary"
                      : "font-bold text-text-muted"
                  }`}
                >
                  Mode
                  <SortIcon col="mode" sortCol={sortCol} sortDir={sortDir} />
                </button>
              </th>

              <th className="px-5 py-3 w-[15%] text-center">
                <button
                  onClick={() => onSort("status")}
                  className={`flex items-center justify-center gap-1 text-xs uppercase tracking-wider hover:text-text-primary transition cursor-pointer mx-auto ${
                    sortCol === "status"
                      ? "font-extrabold text-text-primary"
                      : "font-bold text-text-muted"
                  }`}
                >
                  Status
                  <SortIcon col="status" sortCol={sortCol} sortDir={sortDir} />
                </button>
              </th>

              <th className="px-5 py-3 w-[10%] text-xs font-bold text-text-muted uppercase tracking-wider text-center">
                Actions
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
            ) : sessions.length > 0 ? (
                sessions.map((session) => (
                    <MentorSessionsTableRow
                        key={session.id}
                        session={session}
                        onView={onView}
                        onEdit={onEdit}
                        onCancel={onCancel}
                        onAccept={onAccept}
                        onReject={onReject}
                        onComplete={onComplete}
                        onNoShow={onNoShow}
                    />
                ))
            ) : (
                <tr>
                    <td colSpan={5} className="text-center py-12 text-sm text-text-muted italic">
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