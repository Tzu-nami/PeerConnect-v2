import { useState } from "react";
import { MdArrowDownward, MdArrowUpward, MdKeyboardArrowDown, MdUnfoldMore } from "react-icons/md";
import SearchBar from "@/components/ui/SearchBar";
import StudentHistoryTableRow from "./StudentHistoryTableRow";
import type { SortDirection, StudentHistoryRow, StudentHistorySortKey } from "@/pages/student/history";
import {Semester} from "@/types/semester";
import SemesterFilter from "@/components/admin/SemesterFilter"
import EmptyState from "@/components/ui/charts/EmptyState";

type Props = {
  bookings: StudentHistoryRow[];
  totalCount: number;
  searchQuery: string;
  onSearch: (query: string) => void;
  statusFilters: string[];
  onStatusChange: (statuses: string[]) => void;
  availableStatuses: string[];
  sortCol: StudentHistorySortKey;
  sortDir: SortDirection;
  onSort: (col: StudentHistorySortKey) => void;
  onView: (booking: StudentHistoryRow) => void;
    semesters: Semester[];
    selectedSemesterId: string | null;
    onSemesterChange: (id: string) => void;
};

function formatStatus(status: string) {
  return status === "no_show"
    ? "No Show"
    : status.charAt(0).toUpperCase() + status.slice(1).replace("_", " ");
}

function SortIcon({
  col,
  sortCol,
  sortDir,
}: {
  col: StudentHistorySortKey;
  sortCol: StudentHistorySortKey;
  sortDir: SortDirection;
}) {
  if (sortCol !== col) return <MdUnfoldMore className="text-text-brown-light" />;

  return sortDir === "asc" ? (
    <MdArrowUpward className="text-text-brown" />
  ) : (
    <MdArrowDownward className="text-text-brown" />
  );
}

export default function StudentHistoryTable({
  bookings,
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
    <div className="rounded-xl shadow-md border border-cream-border mt-5 bg-cream">
      <div className="flex flex-wrap gap-4 justify-between items-center p-5">
        <div>
          <h2 className="font-bold text-lg text-text-brown">All Bookings</h2>
          <p className="text-sm text-text-brown-light font-medium">
            {totalCount} Session{totalCount !== 1 ? "s" : ""} found
          </p>
        </div>

        <div className="flex gap-3 items-center flex-wrap">
          <SearchBar
            value={searchQuery}
            onChange={onSearch}
            placeholder="Search bookings..."
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
              className="px-4 py-2 text-xs font-medium text-text-brown border border-cream-border rounded-lg bg-white outline-none focus:ring-1 focus:border-text-brown-light focus:ring-text-brown-light/30 transition-shadow h-[36px] min-w-[150px] flex items-center justify-between gap-3 shadow-sm cursor-pointer"
            >
              <span>
                {statusFilters.length === 0
                  ? "All Statuses"
                  : statusFilters.length === 1
                    ? formatStatus(statusFilters[0])
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

                <div className="absolute right-0 mt-2 w-48 bg-white border border-cream-border rounded-xl shadow-xl z-50 py-2 overflow-hidden">
                  {availableStatuses.map((status) => (
                    <label
                      key={status}
                      className="flex items-center gap-3 px-4 py-2.5 hover:bg-cream cursor-pointer transition"
                    >
                      <input
                        type="checkbox"
                        checked={statusFilters.includes(status)}
                        onChange={() => toggleStatus(status)}
                        className="w-4 h-4 text-up-maroon border-cream-border rounded focus:ring-up-maroon/30 cursor-pointer"
                      />
                      <span className="text-sm font-bold text-slate-700">
                        {formatStatus(status)}
                      </span>
                    </label>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="border-t border-cream-border overflow-x-auto">
        <table className="w-full text-left text-sm table-fixed min-w-[850px]">
          <thead className="border-b border-cream-border bg-cream-dark">
            <tr>
              <th className="px-5 py-3 w-[17%]">
                <button
                  onClick={() => onSort("date")}
                  className={`flex items-center gap-1 text-xs uppercase tracking-wider hover:text-text-brown transition cursor-pointer ${
                    sortCol === "date"
                      ? "font-extrabold text-text-brown"
                      : "font-bold text-text-brown-light"
                  }`}
                >
                  Date & Time
                  <SortIcon col="date" sortCol={sortCol} sortDir={sortDir} />
                </button>
              </th>

              <th className="px-5 py-3 w-[18%]">
                <button
                  onClick={() => onSort("subject")}
                  className={`flex items-center gap-1 text-xs uppercase tracking-wider hover:text-text-brown transition cursor-pointer ${
                    sortCol === "subject"
                      ? "font-extrabold text-text-brown"
                      : "font-bold text-text-brown-light"
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

              <th className="px-5 py-3 w-[20%]">
                <button
                  onClick={() => onSort("mentor")}
                  className={`flex items-center gap-1 text-xs uppercase tracking-wider hover:text-text-brown transition cursor-pointer ${
                    sortCol === "mentor"
                      ? "font-extrabold text-text-brown"
                      : "font-bold text-text-brown-light"
                  }`}
                >
                  Mentor
                  <SortIcon col="mentor" sortCol={sortCol} sortDir={sortDir} />
                </button>
              </th>

              <th className="px-5 py-3 w-[15%]">
                <button
                  onClick={() => onSort("mode")}
                  className={`flex items-center gap-1 text-xs uppercase tracking-wider hover:text-text-brown transition cursor-pointer ${
                    sortCol === "mode"
                      ? "font-extrabold text-text-brown"
                      : "font-bold text-text-brown-light"
                  }`}
                >
                  Mode
                  <SortIcon col="mode" sortCol={sortCol} sortDir={sortDir} />
                </button>
              </th>

              <th className="px-5 py-3 w-[15%] text-center">
                <button
                  onClick={() => onSort("status")}
                  className={`flex items-center justify-center gap-1 text-xs uppercase tracking-wider hover:text-text-brown transition cursor-pointer mx-auto ${
                    sortCol === "status"
                      ? "font-extrabold text-text-brown"
                      : "font-bold text-text-brown-light"
                  }`}
                >
                  Status
                  <SortIcon col="status" sortCol={sortCol} sortDir={sortDir} />
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
            ) : bookings.length > 0 ? (
                bookings.map((booking) => (
                    <StudentHistoryTableRow
                        key={booking.id}
                        booking={booking}
                        onView={onView}
                    />
                ))
            ) : (
                <tr>
                    <td
                        colSpan={5}
                        className="text-center py-12 text-sm text-text-brown-light italic"
                    >
                        <p className="text-sm font-semibold text-slate-500">
                            No bookings match your filters.
                        </p>
                    </td>
                </tr>
            )}
            </tbody>
        </table>
      </div>
    </div>
  );
}