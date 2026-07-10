import type { GetServerSideProps } from "next";
import { useMemo, useState } from "react";
import {
  FaCircleCheck,
  FaHourglassHalf,
  FaListCheck,
  FaStopwatch,
} from "react-icons/fa6";
import { useRouter } from 'next/router';

import MentorSessionDetailModal from "@/components/mentor/sessions/MentorSessionDetailModal";
import MentorSessionsTable from "@/components/mentor/sessions/MentorSessionsTable";
import MentorSessionsStatsModal from "@/components/mentor/sessions/MentorSessionsStatsModal";
import Pagination from "@/components/ui/Pagination";
import StatCard from "@/components/ui/StatCard";
import { createClient } from "@/utils/supabase/server";
import { getServerSideUserRole } from "@/utils/getServerSideUserRole";
import EditSessionModal from '@/components/admin/sessions/EditSessionModal';
import CancelSessionModal from '@/components/admin/sessions/CancelSessionModal';
import UpdateSessionStatusModal, {StatusAction} from "@/components/mentor/sessions/UpdateSessionStatusModal";
import { toast } from "sonner";

export type SortDirection = "asc" | "desc";
export type MentorSessionSortKey =
  | "date"
  | "student"
  | "subject"
  | "mode"
  | "status";

export type MentorSessionRow = {
  id: string;
  groupIds: string[];
  group_ids: string[];
  start: string;
  end: string;
  mentor: string;
  student: string;
  studentNames: string;
  email: string;
  emails: string;
  subject: string;
  subjectName: string;
  topic: string;
  date: string;
  rawDate: string;
  rawTime: string;
  time: string;
  durationText: string;
  durationHours: number;
  mode: string;
  yearLevel: string;
  degreeProgram: string;
  status: string;
  isOpen: boolean;
  isAny: boolean;
};

type Props = {
  sessions: MentorSessionRow[];
  stats: {
    total: number;
    accepted: number;
    pending: number;
    completed: number;
    totalHours: string;
  };
};

type ActiveStatModal =
  | "total"
  | "accepted"
  | "pending"
  | "completed"
  | "hours"
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

function cleanMode(mode: string) {
  return mode
    .replace(/\s*\([^)]*\)\s*/g, " ")
    .replace(/\s*(Tutorial|Session|Sessions)\s*/gi, " ")
    .trim();
}

function getSortValue(row: MentorSessionRow, key: MentorSessionSortKey) {
  if (key === "date") {
    return `${row.rawDate} ${row.rawTime}`;
  }

  return String(row[key] ?? "").toLowerCase();
}

function groupBookings(bookings: any[]) {
  const groups = new Map<string, any[]>();

  bookings.forEach((booking) => {
    const mode = String(booking.tutorial_modes?.mode ?? "").toLowerCase();
    const isGroup = mode.includes("group");

    const key = isGroup
      ? [
          booking.date,
          booking.schedule_start,
          booking.schedule_end,
          booking.subject_id,
          String(booking.topic ?? "").trim(),
        ].join("|")
      : String(booking.id);

    const existing = groups.get(key) ?? [];
    existing.push(booking);
    groups.set(key, existing);
  });

  return [...groups.values()];
}



export default function MentorSessionsPage({ sessions, stats }: Props) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilters, setStatusFilters] = useState<string[]>([]);
  const [sortCol, setSortCol] = useState<MentorSessionSortKey>("date");
  const [sortDir, setSortDir] = useState<SortDirection>("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedSession, setSelectedSession] =
    useState<MentorSessionRow | null>(null);
  const [activeStatModal, setActiveStatModal] =
    useState<ActiveStatModal>(null);
  const [editSession, setEditSession] = useState<MentorSessionRow | null>(null);
  const [cancelSession, setCancelSession] = useState<MentorSessionRow | null>(null);
  const [statusModalConfig, setStatusModalConfig] = useState<{ session: MentorSessionRow, action: StatusAction } | null>(null);

  const availableStatuses = useMemo(() => {
    return [...new Set(sessions.map((session) => session.status))].filter(
      Boolean
    );
  }, [sessions]);

  const filteredSessions = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return sessions
      .filter((session) => {
        const matchesSearch =
          !query ||
          [
            session.student,
            session.studentNames,
            session.email,
            session.emails,
            session.subject,
            session.subjectName,
            session.topic,
            session.date,
            session.time,
            session.mode,
            session.status,
          ].some((value) => String(value).toLowerCase().includes(query));

        const matchesStatus =
          statusFilters.length === 0 ||
          statusFilters.includes(session.status);

        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
        const aValue = getSortValue(a, sortCol);
        const bValue = getSortValue(b, sortCol);
        const result = aValue > bValue ? 1 : aValue < bValue ? -1 : 0;

        return sortDir === "asc" ? result : -result;
      });
  }, [sessions, searchQuery, statusFilters, sortCol, sortDir]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredSessions.length / ITEMS_PER_PAGE)
  );

  const paginatedSessions = filteredSessions.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  function handleSort(col: MentorSessionSortKey) {
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

  const handleRefresh = () => {
    router.replace(router.asPath);
  };

  return (
    <>
      <div className="border-b border-white-border">
        <h1 className="text-xl md:text-2xl xl:text-3xl font-extrabold tracking-tight text-up-maroon">
          Tutorial Sessions
        </h1>
        <p className="text-xs md:text-sm xl:text-base font-medium text-slate-500 mt-1 mb-3">
          All student-selected mentor sessions.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-4 w-full mt-5 mb-6">
        <StatCard
          onClick={() => setActiveStatModal("total")}
          label="All Sessions"
          value={stats.total}
          icon={<FaListCheck />}
          borderColor="border-l-slate-500"
          iconColor="text-slate-500"
        />
        <StatCard
          onClick={() => setActiveStatModal("accepted")}
          label="Accepted"
          value={stats.accepted}
          icon={<FaCircleCheck />}
          borderColor="border-l-green-600"
          iconColor="text-green-600"
        />
        <StatCard
          onClick={() => setActiveStatModal("pending")}
          label="Pending"
          value={stats.pending}
          icon={<FaHourglassHalf />}
          borderColor="border-l-yellow-500"
          iconColor="text-yellow-500"
        />
        <StatCard
          onClick={() => setActiveStatModal("completed")}
          label="Completed"
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
      </div>

      <MentorSessionsTable
        sessions={paginatedSessions}
        totalCount={filteredSessions.length}
        searchQuery={searchQuery}
        onSearch={handleSearch}
        statusFilters={statusFilters}
        onStatusChange={handleStatusChange}
        availableStatuses={availableStatuses}
        sortCol={sortCol}
        sortDir={sortDir}
        onSort={handleSort}
        onView={setSelectedSession}
        onEdit={(session) => setEditSession(session)}
        onCancel={(session) => setCancelSession(session)}
        onAccept={(s) => setStatusModalConfig({ session: s, action: s.isOpen ? 'claim' : 'accepted' })}
        onReject={(s) => setStatusModalConfig({ session: s, action: 'rejected' })}
        onComplete={(s) => setStatusModalConfig({ session: s, action: 'completed' })}
        onNoShow={(s) => setStatusModalConfig({ session: s, action: 'no_show' })}
      />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      <MentorSessionDetailModal
        session={selectedSession}
        onClose={() => setSelectedSession(null)}
      />

      <MentorSessionsStatsModal
        isOpen={activeStatModal === "total"}
        title="All Sessions"
        subtitle={`${stats.total} session${stats.total !== 1 ? "s" : ""}`}
        sessions={sessions}
        onClose={() => setActiveStatModal(null)}
        onSelect={(session) => {
        setActiveStatModal(null);
        setSelectedSession(session);
        }}
      />

      <MentorSessionsStatsModal
        isOpen={activeStatModal === "accepted"}
        title="Accepted Sessions"
        subtitle={`${stats.accepted} accepted session${stats.accepted !== 1 ? "s" : ""}`}
        sessions={sessions.filter((session) => session.status === "accepted")}
        onClose={() => setActiveStatModal(null)}
        onSelect={(session) => {
        setActiveStatModal(null);
        setSelectedSession(session);
      }}
      />

      <MentorSessionsStatsModal
        isOpen={activeStatModal === "pending"}
        title="Pending Sessions"
        subtitle={`${stats.pending} pending session${stats.pending !== 1 ? "s" : ""}`}
        sessions={sessions.filter((session) => session.status === "pending")}
        onClose={() => setActiveStatModal(null)}
        onSelect={(session) => {
        setActiveStatModal(null);
        setSelectedSession(session);
        }}
      />

      <MentorSessionsStatsModal
        isOpen={activeStatModal === "completed"}
        title="Completed Sessions"
        subtitle={`${stats.completed} completed session${stats.completed !== 1 ? "s" : ""}`}
        sessions={sessions.filter((session) => session.status === "completed")}
        onClose={() => setActiveStatModal(null)}
        onSelect={(session) => {
        setActiveStatModal(null);
        setSelectedSession(session);
        }}
      />

      <MentorSessionsStatsModal
        isOpen={activeStatModal === "hours"}
        title="Total Hours"
        subtitle={`${stats.totalHours} completed hour${stats.totalHours !== "1.00" ? "s" : ""}`}
        sessions={sessions.filter((session) => session.status === "completed")}
        showHours
        onClose={() => setActiveStatModal(null)}
        onSelect={(session) => {
        setActiveStatModal(null);
        setSelectedSession(session);
        }}
      />

      <EditSessionModal 
        isOpen={!!editSession} 
        session={editSession} 
        onClose={() => setEditSession(null)} 
        onSuccess={() => { handleRefresh(); setEditSession(null); toast.success("Hours updated succefully."); }} 
      />

      <CancelSessionModal 
        isOpen={!!cancelSession} 
        session={cancelSession} 
        onClose={() => setCancelSession(null)} 
        onSuccess={() => { handleRefresh(); setCancelSession(null); toast.success("Session has been cancelled."); }} 
      />

      <UpdateSessionStatusModal
        isOpen={!!statusModalConfig}
        session={statusModalConfig?.session || null}
        action={statusModalConfig?.action || null}
        onClose={() => setStatusModalConfig(null)}
        onSuccess={(actionType) => {
          handleRefresh();
          setStatusModalConfig(null);
          const messages = { claim: 'claimed', accepted: 'accepted', rejected: 'rejected', completed: 'completed', no_show: 'marked as a no show' };
          toast.success(`Session successfully ${messages[actionType]}!`);
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

  if (userRole !== "mentor") {
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

  const { data: mentorProfile } = await supabase
    .from("mentor_profiles")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (!mentorProfile) {
    return {
      props: {
        sessions: [],
        stats: {
          total: 0,
          accepted: 0,
          pending: 0,
          completed: 0,
          totalHours: "0.00",
        },
      },
    };
  }

  const { data: assignedRows } = await supabase
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
      subject_id,
      is_any,
      student_profiles!student_id (
        student_num,
        year_levels ( name ),
        degree_programs ( name ),
        user_profiles ( firstName, lastName, email )
      ),
      subjects ( code, name ),
      tutorial_modes ( mode )
    `
    )
    .eq("mentor_id", mentorProfile.id);

  const { data: mentorSubjects } = await supabase
    .from("mentor_subjects")
    .select("subject_id")
    .eq("mentor_id", mentorProfile.id);

  const subjectIds = (mentorSubjects ?? [])
    .map((row: any) => row.subject_id)
    .filter(Boolean);

  let openRows: any[] = [];

  if (subjectIds.length > 0) {
    const { data } = await supabase
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
        subject_id,
        student_profiles!student_id (
          student_num,
          year_levels ( name ),
          degree_programs ( name ),
          user_profiles ( firstName, lastName, email )
        ),
        subjects ( code, name ),
        tutorial_modes ( mode )
      `
      )
      .is("mentor_id", null)
      .eq("booking_status", "pending")
      .in("subject_id", subjectIds);

    openRows = data ?? [];
  }

  const groupedBookings = groupBookings([...(assignedRows ?? []), ...openRows]);

  const sessions: MentorSessionRow[] = groupedBookings.map((group) => {
    // Filter out cancelled members in group sessions
    const activeMembers = group.filter((b: any) => b.booking_status !== 'cancelled');
    const displayGroup = activeMembers.length > 0 ? activeMembers : group;
    const firstBooking = displayGroup[0];
    const durationHours = getDurationHours(
      firstBooking.schedule_start,
      firstBooking.schedule_end
    );

    const startDate = new Date(firstBooking.schedule_start);
    const endDate = new Date(firstBooking.schedule_end);
    const startStr = `${String(startDate.getHours()).padStart(2, '0')}:${String(startDate.getMinutes()).padStart(2, '0')}`;
    const endStr = `${String(endDate.getHours()).padStart(2, '0')}:${String(endDate.getMinutes()).padStart(2, '0')}`;

    const studentProfiles = displayGroup
      .map((booking: any) => booking.student_profiles)
      .filter(Boolean);

    const studentNames = studentProfiles
      .map((student: any) => {
        const userProfile = student.user_profiles;
        return `${userProfile?.firstName ?? ""} ${
          userProfile?.lastName ?? ""
        }`.trim();
      })
      .filter(Boolean)
      .join(", ");

    const emails = studentProfiles
      .map((student: any) => student.user_profiles?.email ?? "")
      .filter(Boolean)
      .join(", ");

    const startTime = formatTime(firstBooking.schedule_start);
    const endTime = formatTime(firstBooking.schedule_end);

    return {
      id: String(firstBooking.id),
      groupIds: group.map((booking: any) => String(booking.id)),
      group_ids: group.map((booking: any) => String(booking.id)),
      start: startStr,
      end: endStr,
      mentor: 'You',
      student:
        displayGroup.length > 1
          ? `${displayGroup.length} Students (Group)`
          : studentNames || "Unknown",
      studentNames: studentNames || "Unknown",
      email: displayGroup.length > 1 ? "Multiple Emails" : emails || "-",
      emails: emails || "-",
      subject: firstBooking.subjects?.code ?? "-",
      subjectName: firstBooking.subjects?.name ?? "-",
      topic: firstBooking.topic ?? "-",
      date: formatDate(firstBooking.date ?? null),
      rawDate: firstBooking.date ?? "",
      rawTime: firstBooking.schedule_start
        ? new Date(firstBooking.schedule_start).toTimeString().slice(0, 5)
        : "",
      time: `${startTime} - ${endTime}`,
      durationText: `${startTime} - ${endTime} (${formatDuration(
        durationHours
      )})`,
      durationHours,
      mode: firstBooking.tutorial_modes?.mode
        ? cleanMode(firstBooking.tutorial_modes.mode)
        : "-",
      yearLevel: studentProfiles
        .map((s: any) => s?.year_levels?.name ?? "N/A")
        .join(", "),
      degreeProgram: studentProfiles
        .map((s: any) => s?.degree_programs?.name ?? "N/A")
        .join(", "),
      status: firstBooking.booking_status ?? "-",
      isOpen: firstBooking.mentor_id === null,
      isAny: firstBooking.is_any ?? false,
    };
  });

  sessions.sort((a, b) => {
    const aValue = `${a.rawDate} ${a.rawTime}`;
    const bValue = `${b.rawDate} ${b.rawTime}`;
    return bValue.localeCompare(aValue);
  });

  const completedSessions = sessions.filter(
    (session) => session.status === "completed"
  );

  const totalHours = completedSessions.reduce(
    (sum, session) => sum + session.durationHours,
    0
  );

  return {
    props: {
      sessions,
      stats: {
        total: sessions.length,
        accepted: sessions.filter((session) => session.status === "accepted")
          .length,
        pending: sessions.filter((session) => session.status === "pending")
          .length,
        completed: completedSessions.length,
        totalHours: totalHours.toFixed(2),
      },
    },
  };
};