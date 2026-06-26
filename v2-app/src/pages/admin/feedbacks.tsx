import type { GetServerSideProps } from "next";
import { useMemo, useState } from "react";

// Components
import FeedbackStats from "@/components/admin/feedbacks/FeedbackStats";
import FeedbackTable from "@/components/admin/feedbacks/FeedbackTable";
import FeedbackDetailModal from "@/components/admin/feedbacks/FeedbackDetailModal";
import Pagination from "@/components/ui/Pagination";

// Utilities
import { createClient } from "@/utils/supabase/server";
import { getServerSideUserRole } from "@/utils/getServerSideUserRole";

export type SortKey =
  | "date"
  | "mentor_name"
  | "subject"
  | "topic"
  | "feedback"
  | "rating";

export type SortDirection = "asc" | "desc";

export type FeedbackRow = {
  id: string;
  mentor_name: string;
  subject: string;
  topic: string;
  date_submitted: string | null;
  date_formatted: string;
  feedback: string;
  has_feedback: boolean;
  avg: number | null;
  avgLabel: string;
  q1: number | null;
  q2: number | null;
  q3: number | null;
  q4: number | null;
  q5: number | null;
  q6: number | null;
  q7: number | null;
  q8: number | null;
  q9: number | null;
  q10: boolean | string | number | null;
};

type Props = {
  feedbacks: FeedbackRow[];
  stats: {
    total: number;
    sessions: number;
    avg: string;
  };
};

const ITEMS_PER_PAGE = 8;

function formatDate(value: string | null) {
  if (!value) return "-";

  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function getAverage(row: any) {
  const scores = [
    row.q1,
    row.q2,
    row.q3,
    row.q4,
    row.q5,
    row.q6,
    row.q7,
    row.q8,
    row.q9,
  ]
    .map((score) =>
      score === null || score === undefined ? null : Number(score)
    )
    .filter((score): score is number => score !== null && !Number.isNaN(score));

  if (scores.length === 0) return null;

  return (
    Math.round(
      (scores.reduce((sum, score) => sum + score, 0) / scores.length) * 10
    ) / 10
  );
}

function getRatingLabel(avg: number | null) {
  if (avg === null) return "N/A";
  if (avg >= 4.5) return "Excellent";
  if (avg >= 3.5) return "Good";
  if (avg >= 2.5) return "Average";
  return "Poor";
}

function getSortValue(row: FeedbackRow, key: SortKey) {
  if (key === "date") {
    return row.date_submitted ? new Date(row.date_submitted).getTime() : 0;
  }

  if (key === "rating") {
    return row.avg ?? -1;
  }

  return String(row[key] ?? "").toLowerCase();
}

export default function AdminFeedbacksPage({ feedbacks, stats }: Props) {
  const [searchQuery, setSearchQuery] = useState("");
  const [mentorFilter, setMentorFilter] = useState("all");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [sortCol, setSortCol] = useState<SortKey>("date");
  const [sortDir, setSortDir] = useState<SortDirection>("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedFeedback, setSelectedFeedback] = useState<FeedbackRow | null>(
    null
  );

  const mentorOptions = useMemo(() => {
    return [...new Set(feedbacks.map((fb) => fb.mentor_name).filter(Boolean))].sort();
  }, [feedbacks]);

  const filteredFeedbacks = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return feedbacks
      .filter((fb) => {
        const matchesSearch =
          !query ||
          [
            fb.date_formatted,
            fb.mentor_name,
            fb.subject,
            fb.topic,
            fb.feedback,
            fb.avgLabel,
          ].some((value) => String(value).toLowerCase().includes(query));

        const matchesMentor =
          mentorFilter === "all" || fb.mentor_name === mentorFilter;

        const matchesRating =
          ratingFilter === "all" || fb.avgLabel === ratingFilter;

        return matchesSearch && matchesMentor && matchesRating;
      })
      .sort((a, b) => {
        const aValue = getSortValue(a, sortCol);
        const bValue = getSortValue(b, sortCol);
        const result = aValue > bValue ? 1 : aValue < bValue ? -1 : 0;

        return sortDir === "asc" ? result : -result;
      });
  }, [feedbacks, mentorFilter, ratingFilter, searchQuery, sortCol, sortDir]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredFeedbacks.length / ITEMS_PER_PAGE)
  );

  const paginatedFeedbacks = filteredFeedbacks.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  function handleSort(col: SortKey) {
    if (sortCol === col) {
      setSortDir((direction) => (direction === "asc" ? "desc" : "asc"));
    } else {
      setSortCol(col);
      setSortDir(col === "date" || col === "rating" ? "desc" : "asc");
    }
  }

  function handleSearch(query: string) {
    setSearchQuery(query);
    setCurrentPage(1);
  }

  function handleMentorFilter(value: string) {
    setMentorFilter(value);
    setCurrentPage(1);
  }

  function handleRatingFilter(value: string) {
    setRatingFilter(value);
    setCurrentPage(1);
  }

  function resetFilters() {
    setSearchQuery("");
    setMentorFilter("all");
    setRatingFilter("all");
    setCurrentPage(1);
  }

  return (
    <>
      <div className="border-b border-cream-border">
        <h1 className="text-xl md:text-2xl xl:text-3xl font-extrabold tracking-tight text-up-maroon">
          Student Feedbacks
        </h1>
        <p className="text-xs md:text-sm xl:text-base font-medium text-slate-500 mt-1 mb-3">
          All student feedbacks collected from completed sessions.
        </p>
      </div>

      <FeedbackStats stats={stats} />

      <FeedbackTable
        feedbacks={paginatedFeedbacks}
        totalCount={filteredFeedbacks.length}
        searchQuery={searchQuery}
        onSearch={handleSearch}
        mentorOptions={mentorOptions}
        mentorFilter={mentorFilter}
        onMentorFilter={handleMentorFilter}
        ratingFilter={ratingFilter}
        onRatingFilter={handleRatingFilter}
        onResetFilters={resetFilters}
        sortCol={sortCol}
        sortDir={sortDir}
        onSort={handleSort}
        onView={setSelectedFeedback}
      />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      <FeedbackDetailModal
        feedback={selectedFeedback}
        onClose={() => setSelectedFeedback(null)}
      />
    </>
  );
}

export const getServerSideProps: GetServerSideProps<Props> = async (
  context
) => {
  const supabase = createClient(context);
  const userRole = await getServerSideUserRole(context);

  if (userRole !== "admin") {
    return {
      redirect: {
        destination: userRole ? `/${userRole}/dashboard` : "/login",
        permanent: false,
      },
    };
  }

  const [
    { data: feedbackRows },
    { data: bookingRows },
    { data: mentorRows },
    { data: profileRows },
    { count: completedSessions },
  ] = await Promise.all([
    supabase
      .from("feedback")
      .select("*")
      .order("date_submitted", { ascending: false }),

    supabase
      .from("bookings")
      .select(
        "id, mentor_id, student_id, date, schedule_start, schedule_end, booking_status"
      ),

    supabase.from("mentor_profiles").select("id, user_id"),

    supabase.from("user_profiles").select("id, firstName, lastName"),

    supabase
      .from("bookings")
      .select("id", { count: "exact", head: true })
      .eq("booking_status", "completed"),
  ]);

  const bookingsById = new Map(
    (bookingRows ?? []).map((booking: any) => [String(booking.id), booking])
  );

  const mentorsById = new Map(
    (mentorRows ?? []).map((mentor: any) => [String(mentor.id), mentor])
  );

  const profilesById = new Map(
    (profileRows ?? []).map((profile: any) => [String(profile.id), profile])
  );

  const feedbacks: FeedbackRow[] = (feedbackRows ?? []).map((fb: any) => {
    const booking = fb.booking_id
      ? bookingsById.get(String(fb.booking_id))
      : null;

    const mentor = booking?.mentor_id
      ? mentorsById.get(String(booking.mentor_id))
      : fb.mentor_id
        ? mentorsById.get(String(fb.mentor_id))
        : null;

    const profile = mentor?.user_id
      ? profilesById.get(String(mentor.user_id))
      : null;

    const mentorName = profile
      ? `${profile.lastName ?? ""}, ${profile.firstName ?? ""}`
          .replace(/^,\s*/, "")
          .trim()
      : "-";

    const avg = getAverage(fb);

    return {
      id: String(fb.id),
      mentor_name: mentorName || "-",
      subject: fb.subject || "-",
      topic: fb.topic || "-",
      date_submitted: fb.date_submitted ?? null,
      date_formatted: formatDate(fb.date_submitted ?? null),
      feedback: fb.feedback || "-",
      has_feedback: !!fb.feedback,
      avg,
      avgLabel: getRatingLabel(avg),
      q1: fb.q1 ?? null,
      q2: fb.q2 ?? null,
      q3: fb.q3 ?? null,
      q4: fb.q4 ?? null,
      q5: fb.q5 ?? null,
      q6: fb.q6 ?? null,
      q7: fb.q7 ?? null,
      q8: fb.q8 ?? null,
      q9: fb.q9 ?? null,
      q10: fb.q10 ?? null,
    };
  });

  const averages = feedbacks
    .map((fb) => fb.avg)
    .filter((avg): avg is number => avg !== null);

  const overallAverage =
    averages.length > 0
      ? averages.reduce((sum, avg) => sum + avg, 0) / averages.length
      : 0;

  return {
    props: {
      feedbacks,
      stats: {
        total: feedbacks.length,
        sessions: completedSessions ?? 0,
        avg: overallAverage.toFixed(1),
      },
    },
  };
};