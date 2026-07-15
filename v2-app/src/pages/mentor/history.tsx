import type { GetServerSideProps } from "next";
import { useMemo, useState } from "react";
import {
  FaBan,
  FaCircleCheck,
  FaHourglassHalf,
  FaListCheck,
  FaStopwatch,
} from "react-icons/fa6";

import MentorHistoryTable from "@/components/mentor/history/MentorHistoryTable";
import MentorHistoryDetailModal from "@/components/mentor/history/MentorHistoryDetailModal";
import MentorHistoryStatsModal from "@/components/mentor/history/MentorHistoryStatsModal";
import Pagination from "@/components/ui/Pagination";
import StatCard from "@/components/ui/StatCard";
import { createClient } from "@/utils/supabase/server";
import { getServerSideUserRole } from "@/utils/getServerSideUserRole";
import { getRecentSemesters } from '@/utils/services/sessionService';
import {Semester} from "@/types/semester";
import { useRouter } from "next/router";

export type SortDirection = "asc" | "desc";
export type MentorHistorySortKey =
  | "date"
  | "subject"
  | "mentor"
  | "room"
  | "status";

export type MentorHistoryRow = {
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
  group_ids: string[];
  student: string;
  studentNames: string;
  room?: string;
};

type Props = {
  bookings: MentorHistoryRow[];
  stats: {
    total: number;
    pending: number;
    completed: number;
    cancelled: number;
    totalHours: string;
  };
    semesters: Semester[];
    selectedSemesterId: string | null;
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
  if (hours === 0) return "N/A";

  const totalMinutes = Math.round(hours * 60);
  const hrs = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;

  let durationString = "";
  if (hrs > 0) durationString += `${hrs} hr${hrs !== 1 ? 's' : ''}`;
  if (mins > 0) durationString += `${hrs > 0 ? ' ' : ''}${mins} min${mins !== 1 ? 's' : ''}`;

  return durationString || "0 mins";
}

function cleanMode(mode: string) {
  return mode
    .replace(/\s*\([^)]*\)\s*/g, " ")
    .replace(/\s*(Tutorial|Session|Sessions)\s*/gi, " ")
    .trim();
}

function getSortValue(row: MentorHistoryRow, key: MentorHistorySortKey) {
  if (key === "date") {
    return `${row.rawDate} ${row.rawTime}`;
  }

  return String(row[key] ?? "").toLowerCase();
}

export default function MentorHistoryPage({ bookings, stats, semesters, selectedSemesterId }: Props) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilters, setStatusFilters] = useState<string[]>([]);
  const [sortCol, setSortCol] = useState<MentorHistorySortKey>("date");
  const [sortDir, setSortDir] = useState<SortDirection>("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedBooking, setSelectedBooking] =
    useState<MentorHistoryRow | null>(null);
  const [activeStatModal, setActiveStatModal] =
    useState<ActiveStatModal>(null);

    const router = useRouter()

  const availableStatuses = useMemo(() => {
    return [...new Set(bookings.map((booking) => booking.status))].filter(
      Boolean
    );
  }, [bookings]);

    const handleSemesterChange = (semesterId: string) => {
        router.push({ pathname: router.pathname, query: { semester: semesterId } });
    };

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

  function handleSort(col: MentorHistorySortKey) {
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
      <div className="border-b border-white-border">
        <h1 className="text-xl md:text-2xl xl:text-3xl font-extrabold tracking-tight text-up-maroon">
          Booking History
        </h1>
        <p className="text-xs md:text-sm xl:text-base font-medium text-slate-500 mt-1 mb-3">
          View your past and current bookings.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-4 w-full mt-5 mb-6">
        <StatCard
          onClick={() => handleStatusChange([])}
          label="Total Requests"
          value={stats.total}
          icon={<FaListCheck />}
          borderColor="border-l-slate-500"
          iconColor="text-slate-500"
        />
        <StatCard
          onClick={() => handleStatusChange(["pending"])}
          label="Pending Requests"
          value={stats.pending}
          icon={<FaHourglassHalf />}
          borderColor="border-l-yellow-500"
          iconColor="text-yellow-500"
        />
        <StatCard
          onClick={() => handleStatusChange(["completed"])}
          label="Completed Sessions"
          value={stats.completed}
          icon={<FaCircleCheck />}
          borderColor="border-l-blue-600"
          iconColor="text-blue-600"
        />

        <StatCard
          onClick={() => handleStatusChange(["cancelled"])}
          label="Cancelled Requests"
          value={stats.cancelled}
          icon={<FaBan />}
          borderColor="border-l-red-500"
          iconColor="text-red-500"
        />

        <StatCard
          onClick={() => setActiveStatModal("hours")}
          label="Total Hours"
          value={stats.totalHours}
          icon={<FaStopwatch />}
          borderColor="border-l-purple-600"
          iconColor="text-purple-600"
        />
      </div>

      <MentorHistoryTable
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
        semesters={semesters}
        selectedSemesterId={selectedSemesterId}
        onSemesterChange={handleSemesterChange}
      />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      <MentorHistoryDetailModal
        booking={selectedBooking}
        onClose={() => setSelectedBooking(null)}
      />


      <MentorHistoryStatsModal
        isOpen={activeStatModal === "hours"}
        title="Total Hours"
        subtitle={`${stats.totalHours} of completed sessions`}
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

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
    const supabase = createClient(context);
    const userRole = await getServerSideUserRole(context);

    if (userRole !== "mentor") {
        return { redirect: { destination: userRole ? `/${userRole}/dashboard` : "/login", permanent: false } };
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { redirect: { destination: "/login", permanent: false } };

    const { data: studentProfile } = await supabase
        .from("student_profiles")
        .select("id")
        .eq("user_id", user.id)
        .single();

    const semesters = await getRecentSemesters(supabase);
    const currentSemester = semesters.find(s => s.is_current);
    const selectedSemesterId = (context.query.semester as string) ?? currentSemester?.id ?? null;

    const emptyStats = { total: 0, pending: 0, completed: 0, cancelled: 0, totalHours: "0.00" };

    if (!studentProfile || !selectedSemesterId) {
        return { props: { bookings: [], stats: emptyStats, semesters, selectedSemesterId } };
    }

    const { data: bookingRows } = await supabase
        .from("bookings")
        .select(`
      id, topic, booking_status, date, schedule_start, schedule_end, mentor_id, subject_id, group_id, room,
      subjects ( code, name ),
      mentor_profiles!mentor_id ( user_profiles ( firstName, lastName ) ),
      student_profiles!student_id ( user_profiles ( firstName, lastName ) ), 
      tutorial_modes ( mode )
    `)
        .eq("student_id", studentProfile.id)
        .eq("semester_id", selectedSemesterId)
        .order("date", { ascending: false });

  const bookings: MentorHistoryRow[] = await Promise.all(
    (bookingRows ?? []).map(async (booking: any) => {
      let group_ids = [String(booking.id)];
      const currentUser = booking.student_profiles?.user_profiles;
      const currentName = currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : "Unknown Student";
      let allNames = [currentName];
      if (booking.group_id) {
        const { data: grouped } = await supabase
          .from("bookings")
          .select(`
            id,
            student_profiles!student_id (
              user_profiles ( firstName, lastName )
            )
          `)
          .eq("group_id", booking.group_id);

        if (grouped && grouped.length > 0) {
          group_ids = grouped.map((p) => String(p.id));
          allNames = grouped.map((p: any) => {
            const u = p.student_profiles?.user_profiles;
            return u ? `${u.firstName} ${u.lastName}` : "Unknown Student";
          });
        }
      }

      const startTime = formatTime(booking.schedule_start);
      const endTime = formatTime(booking.schedule_end);
      const durationHours = getDurationHours(booking.schedule_start, booking.schedule_end);

      const mentorUser = booking.mentor_profiles?.user_profiles;
      const mentorName = booking.mentor_id
        ? `${mentorUser?.lastName ?? ""}, ${mentorUser?.firstName ?? ""}`
            .replace(/^,\s*/, "")
            .trim() || "TBD"
        : "ANY";

      return {
        id: String(booking.id),
        subject: booking.subjects?.code ?? "-",
        subjectName: booking.subjects?.name ?? "-",
        topic: booking.topic ?? "-",
        mentor: mentorName,
        student: group_ids.length > 1 ? `${group_ids.length} Students (Group)` : currentName,
        studentNames: allNames.join(', '),
        date: formatDate(booking.date ?? null),
        rawDate: booking.date ?? "",
        rawTime: booking.schedule_start
          ? new Date(booking.schedule_start).toTimeString().slice(0, 5)
          : "",
        time: `${startTime} - ${endTime}`,
        mode: booking.tutorial_modes?.mode
        ? cleanMode(booking.tutorial_modes.mode)
        : "-",
        status: booking.booking_status ?? "-",
        durationHours,
        durationText: `${startTime} - ${endTime} (${formatDuration(durationHours)})`,
        group_ids,
        room: ['cancelled', 'rejected', 'no_show'].includes(booking.booking_status) ? 'N/A' : booking.room,
      };
    })
  );

  const completedBookings = bookings.filter(
    (booking) => booking.status === "completed"
  );

  const totalRawHours = completedBookings.reduce(
    (sum, booking) => sum + booking.durationHours,
    0
  );

  const totalMins = Math.round(totalRawHours * 60);
  const statHrs = Math.floor(totalMins / 60);
  const statMins = totalMins % 60;

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
        totalHours: `${statHrs}h ${statMins}m`,
      },
        semesters,
        selectedSemesterId,
    },
  };
};