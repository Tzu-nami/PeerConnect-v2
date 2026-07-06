import type { GetServerSideProps } from "next";
import { useMemo, useState } from "react";
import {
  FaBan,
  FaCircleCheck,
  FaHourglassHalf,
  FaListCheck,
  FaStopwatch,
} from "react-icons/fa6";

import StudentHistoryTable from "@/components/student/history/StudentHistoryTable";
import StudentHistoryDetailModal from "@/components/student/history/StudentHistoryDetailModal";
import StudentHistoryStatsModal from "@/components/student/history/StudentHistoryStatsModal";
import Pagination from "@/components/ui/Pagination";
import StatCard from "@/components/ui/StatCard";
import { createClient } from "@/utils/supabase/server";
import { getServerSideUserRole } from "@/utils/getServerSideUserRole";

export type SortDirection = "asc" | "desc";
export type StudentHistorySortKey =
  | "date"
  | "subject"
  | "mentor"
  | "mode"
  | "status";

export type StudentHistoryRow = {
  id: string;
  subject: string;
  subjectName: string;
  topic: string;
  mentor: string;
  date: string;
  rawDate: string;
  rawTime: string;
  time: string;
  mode: string;
  status: string;
  durationHours: number;
  durationText: string;
};

type Props = {
  bookings: StudentHistoryRow[];
  stats: {
    total: number;
    pending: number;
    completed: number;
    cancelled: number;
    totalHours: string;
  };
};

type ActiveStatModal =
  | "total"
  | "pending"
  | "completed"
  | "hours"
  | "cancelled"
  | null;

const ITEMS_PER_PAGE = 8;

function formatDate(value: string | null) {
  if (!value) return "-";

  const [year, month, day] = value.split("-").map(Number);
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(year, month - 1, day));
}

function formatTime(value: string | null) {
  if (!value) return "-";

  const date = new Date(value);
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function getDurationHours(startValue: string | null, endValue: string | null) {
  if (!startValue || !endValue) return 0;

  const start = new Date(startValue);
  const end = new Date(endValue);
  const diffMinutes = Math.max(0, (end.getTime() - start.getTime()) / 60000);

  return diffMinutes / 60;
}

function formatDuration(hours: number) {
  if (hours === 0) return "-";
  if (hours === 1) return "1 hr";

  return `${Number(hours.toFixed(2))} hrs`;
}

function getSortValue(row: StudentHistoryRow, key: StudentHistorySortKey) {
  if (key === "date") {
    return `${row.rawDate} ${row.rawTime}`;
  }

  return String(row[key] ?? "").toLowerCase();
}

export default function StudentHistoryPage({ bookings, stats }: Props) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilters, setStatusFilters] = useState<string[]>([]);
  const [sortCol, setSortCol] = useState<StudentHistorySortKey>("date");
  const [sortDir, setSortDir] = useState<SortDirection>("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedBooking, setSelectedBooking] =
    useState<StudentHistoryRow | null>(null);
  const [activeStatModal, setActiveStatModal] =
  useState<ActiveStatModal>(null);

  const availableStatuses = useMemo(() => {
    return [...new Set(bookings.map((booking) => booking.status))].filter(
      Boolean
    );
  }, [bookings]);

  const filteredBookings = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return bookings
      .filter((booking) => {
        const matchesSearch =
          !query ||
          [
            booking.subject,
            booking.subjectName,
            booking.topic,
            booking.mentor,
            booking.date,
            booking.time,
            booking.mode,
            booking.status,
          ].some((value) => String(value).toLowerCase().includes(query));

        const matchesStatus =
          statusFilters.length === 0 ||
          statusFilters.includes(booking.status);

        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
        const aValue = getSortValue(a, sortCol);
        const bValue = getSortValue(b, sortCol);
        const result = aValue > bValue ? 1 : aValue < bValue ? -1 : 0;

        return sortDir === "asc" ? result : -result;
      });
  }, [bookings, searchQuery, statusFilters, sortCol, sortDir]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredBookings.length / ITEMS_PER_PAGE)
  );

  const paginatedBookings = filteredBookings.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  function handleSort(col: StudentHistorySortKey) {
    if (sortCol === col) {
      setSortDir((direction) => (direction === "asc" ? "desc" : "asc"));
    } else {
      setSortCol(col);
      setSortDir(col === "date" ? "desc" : "asc");
    }
  }

  function handleSearch(query: string) {
    setSearchQuery(query);
    setCurrentPage(1);
  }

  function handleStatusChange(statuses: string[]) {
    setStatusFilters(statuses);
    setCurrentPage(1);
  }

  return (
    <>
      <div className="border-b border-cream-border">
        <h1 className="text-xl md:text-2xl xl:text-3xl font-extrabold tracking-tight text-up-maroon">
          Booking History
        </h1>
        <p className="text-xs md:text-sm xl:text-base font-medium text-slate-500 mt-1 mb-3">
          View your past and current bookings.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-4 w-full mt-5 mb-6">
      <StatCard
        onClick={() => setActiveStatModal("total")}
        label="Total Requests"
        value={stats.total}
        icon={<FaListCheck />}
        borderColor="border-l-slate-500"
        iconColor="text-slate-500"
      />
        <StatCard
          onClick={() => setActiveStatModal("pending")}
          label="Pending Requests"
          value={stats.pending}
          icon={<FaHourglassHalf />}
          borderColor="border-l-yellow-500"
          iconColor="text-yellow-500"
        />
        <StatCard
          onClick={() => setActiveStatModal("completed")}
          label="Completed Sessions"
          value={stats.completed}
          icon={<FaCircleCheck />}
          borderColor="border-l-blue-600"
          iconColor="text-blue-600"
        />
        <StatCard
          onClick={() => setActiveStatModal("hours")}
          label="Total Hours"
          value={stats.totalHours}
          icon={<FaStopwatch />}
          borderColor="border-l-purple-600"
          iconColor="text-purple-600"
        />
        <StatCard
          onClick={() => setActiveStatModal("cancelled")} 
          label="Cancelled Requests"
          value={stats.cancelled}
          icon={<FaBan />}
          borderColor="border-l-red-500"
          iconColor="text-red-500"
        />
      </div>

      <StudentHistoryTable
        bookings={paginatedBookings}
        totalCount={filteredBookings.length}
        searchQuery={searchQuery}
        onSearch={handleSearch}
        statusFilters={statusFilters}
        onStatusChange={handleStatusChange}
        availableStatuses={availableStatuses}
        sortCol={sortCol}
        sortDir={sortDir}
        onSort={handleSort}
        onView={setSelectedBooking}
      />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      <StudentHistoryDetailModal
        booking={selectedBooking}
        onClose={() => setSelectedBooking(null)}
      />

      <StudentHistoryStatsModal
        isOpen={activeStatModal === "total"}
        title="Total Requests"
        subtitle={`${stats.total} booking request${stats.total !== 1 ? "s" : ""}`}
        bookings={bookings}
        onClose={() => setActiveStatModal(null)}
        onSelect={(booking) => {
        setActiveStatModal(null);
        setSelectedBooking(booking);
        }}
      />

      <StudentHistoryStatsModal
        isOpen={activeStatModal === "pending"}
        title="Pending Requests"
        subtitle={`${stats.pending} pending request${stats.pending !== 1 ? "s" : ""}`}
        bookings={bookings.filter((booking) => booking.status === "pending")}
        onClose={() => setActiveStatModal(null)}
        onSelect={(booking) => {
        setActiveStatModal(null);
        setSelectedBooking(booking);
        }}
      />

      <StudentHistoryStatsModal
        isOpen={activeStatModal === "completed"}
        title="Completed Sessions"
        subtitle={`${stats.completed} completed session${stats.completed !== 1 ? "s" : ""}`}
        bookings={bookings.filter((booking) => booking.status === "completed")}
        onClose={() => setActiveStatModal(null)}
        onSelect={(booking) => {
        setActiveStatModal(null);
        setSelectedBooking(booking);
        }}
      />

      <StudentHistoryStatsModal
        isOpen={activeStatModal === "cancelled"}
        title="Cancelled Requests"
        subtitle={`${stats.cancelled} cancelled request${stats.cancelled !== 1 ? "s" : ""}`}
        bookings={bookings.filter((booking) => booking.status === "cancelled")}
        onClose={() => setActiveStatModal(null)}
        onSelect={(booking) => {
        setActiveStatModal(null);
        setSelectedBooking(booking);
        }}
      />

      <StudentHistoryStatsModal
        isOpen={activeStatModal === "hours"}
        title="Total Hours"
        subtitle={`${stats.totalHours} completed hour${stats.totalHours !== "1.00" ? "s" : ""}`}
        bookings={bookings.filter((booking) => booking.status === "completed")}
        showHours
        onClose={() => setActiveStatModal(null)}
        onSelect={(booking) => {
        setActiveStatModal(null);
        setSelectedBooking(booking);
        }}
      />

    </>
  );
}

export const getServerSideProps: GetServerSideProps<Props> = async (
  context
) => {
  const supabase = createClient(context);
  const userRole = await getServerSideUserRole(context);

  if (userRole !== "student") {
    return {
      redirect: {
        destination: userRole ? `/${userRole}/dashboard` : "/login",
        permanent: false,
      },
    };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  const { data: studentProfile } = await supabase
    .from("student_profiles")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (!studentProfile) {
    return {
      props: {
        bookings: [],
        stats: {
          total: 0,
          pending: 0,
          completed: 0,
          cancelled: 0,
          totalHours: "0.00",
        },
      },
    };
  }

  const { data: bookingRows } = await supabase
    .from("bookings")
    .select(
      `
      id,
      topic,
      booking_status,
      date,
      schedule_start,
      schedule_end,
      mentor_id,
      subjects ( code, name ),
      mentor_profiles!mentor_id (
        user_profiles ( firstName, lastName )
      ),
      tutorial_modes ( mode )
    `
    )
    .eq("student_id", studentProfile.id)
    .order("date", { ascending: false });

  const bookings: StudentHistoryRow[] = (bookingRows ?? []).map(
    (booking: any) => {
      const startTime = formatTime(booking.schedule_start);
      const endTime = formatTime(booking.schedule_end);
      const durationHours = getDurationHours(
        booking.schedule_start,
        booking.schedule_end
      );

      const mentorUser = booking.mentor_profiles?.user_profiles;
      const mentorName = booking.mentor_id
        ? `${mentorUser?.firstName ?? ""} ${mentorUser?.lastName ?? ""}`.trim() ||
          "TBD"
        : "ANY";

      return {
        id: String(booking.id),
        subject: booking.subjects?.code ?? "-",
        subjectName: booking.subjects?.name ?? "-",
        topic: booking.topic ?? "-",
        mentor: mentorName,
        date: formatDate(booking.date ?? null),
        rawDate: booking.date ?? "",
        rawTime: booking.schedule_start
          ? new Date(booking.schedule_start).toTimeString().slice(0, 5)
          : "",
        time: `${startTime} - ${endTime}`,
        mode: booking.tutorial_modes?.mode ?? "-",
        status: booking.booking_status ?? "-",
        durationHours,
        durationText: formatDuration(durationHours),
      };
    }
  );

  const completedBookings = bookings.filter(
    (booking) => booking.status === "completed"
  );

  const totalHours = completedBookings.reduce(
    (sum, booking) => sum + booking.durationHours,
    0
  );

  return {
    props: {
      bookings,
      stats: {
        total: bookings.length,
        pending: bookings.filter((booking) => booking.status === "pending")
          .length,
        completed: completedBookings.length,
        cancelled: bookings.filter((booking) => booking.status === "cancelled")
          .length,
        totalHours: totalHours.toFixed(2),
      },
    },
  };
};