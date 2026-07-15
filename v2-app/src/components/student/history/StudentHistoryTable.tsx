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
  if (sortCol !== col) return <MdUnfoldMore className="text-text-white-light" />;

  return sortDir === "asc" ? (
    <MdArrowUpward className="text-text-primary" />
  ) : (
    <MdArrowDownward className="text-text-primary" />
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
    <div className="rounded-xl shadow-md border border-white-border mt-5 bg-white grid grid-cols-1">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center p-4 sm:p-5">
        <div>
          <h2 className="font-bold text-lg text-text-primary">All Bookings</h2>
          <p className="text-sm text-text-white-light font-medium">
            {totalCount} Session{totalCount !== 1 ? "s" : ""} found
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center w-full md:w-auto">
          <SearchBar
            value={searchQuery}
            onChange={onSearch}
            placeholder="Search bookings..."
            className="w-56"
          />

          <div className="w-full sm:w-auto">
            <SemesterFilter
                semesters={semesters}
                selected={selectedSemesterId}
                onChange={onSemesterChange}
            />
          </div>

          <div className="relative w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="px-4 py-2 text-xs font-medium text-text-primary border border-white-border rounded-lg bg-white outline-none focus:ring-1 focus:border-text-brown-light focus:ring-text-brown-light/30 transition-shadow h-[36px] min-w-[150px] flex items-center justify-between gap-3 shadow-sm cursor-pointer"
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

                <div className="absolute md:right-0 mt-2 w-48 bg-white border border-white-border rounded-xl shadow-xl z-50 py-2 overflow-hidden">
                  {availableStatuses.map((status) => (
                    <label
                      key={status}
                      className="flex items-center gap-3 px-4 py-2.5 hover:bg-white-hover hover:rounded-lg cursor-pointer transition"
                    >
                      <input
                        type="checkbox"
                        checked={statusFilters.includes(status)}
                        onChange={() => toggleStatus(status)}
                        className="w-4 h-4 text-up-maroon border-white-border rounded focus:ring-up-maroon/30 cursor-pointer"
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

      <div className="border-t border-white-border overflow-x-auto">
        <table className="w-full text-left text-sm table-fixed min-w-[850px]">
          <thead className="border-b border-white-border bg-white-dark">
            <tr>
              <th className="px-5 py-3 w-[17%]">
                <button
                  onClick={() => onSort("date")}
                  className={`flex items-center gap-1 text-xs uppercase tracking-wider hover:text-text-primary transition cursor-pointer ${
                    sortCol === "date"
                      ? "font-extrabold text-text-primary"
                      : "font-bold text-text-white-light"
                  }`}
                >
                  Date & Time
                  <SortIcon col="date" sortCol={sortCol} sortDir={sortDir} />
                </button>
              </th>

              <th className="px-5 py-3 w-[18%]">
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

              <th className="px-5 py-3 w-[20%]">
                <button
                  onClick={() => onSort("mentor")}
                  className={`flex items-center gap-1 text-xs uppercase tracking-wider hover:text-text-primary transition cursor-pointer ${
                    sortCol === "mentor"
                      ? "font-extrabold text-text-primary"
                      : "font-bold text-text-white-light"
                  }`}
                >
                  Mentor
                  <SortIcon col="mentor" sortCol={sortCol} sortDir={sortDir} />
                </button>
              </th>

              <th className="px-5 py-3 w-[15%]">
                <button
                  onClick={() => onSort("room")}
                  className={`flex items-center gap-1 text-xs uppercase tracking-wider hover:text-text-primary transition cursor-pointer ${
                    sortCol === "room"
                      ? "font-extrabold text-text-primary"
                      : "font-bold text-text-white-light"
                  }`}
                >
                  Room
                  <SortIcon col="room" sortCol={sortCol} sortDir={sortDir} />
                </button>
              </th>

              <th className="px-5 py-3 w-[15%] text-center">
                <button
                  onClick={() => onSort("status")}
                  className={`flex items-center justify-center gap-1 text-xs uppercase tracking-wider hover:text-text-primary transition cursor-pointer mx-auto ${
                    sortCol === "status"
                      ? "font-extrabold text-text-primary"
                      : "font-bold text-text-white-light"
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
                        className="text-center py-12 text-sm text-text-white-light italic"
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