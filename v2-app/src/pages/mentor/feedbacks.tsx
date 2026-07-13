import type { GetServerSideProps } from "next";
import { useMemo, useState } from "react";

import MentorFeedbackDetailModal from "@/components/mentor/feedbacks/MentorFeedbackDetailModal";
import MentorFeedbackTable from "@/components/mentor/feedbacks/MentorFeedbackTable";
import Pagination from "@/components/ui/Pagination";
import { getRatingLabel } from "@/utils/getRatingLabel";
import { getServerSideUserRole } from "@/utils/getServerSideUserRole";
import { createClient } from "@/utils/supabase/server";
import { getRecentSemesters } from '@/utils/services/sessionService';
import {Semester} from "@/types/semester";
import { useRouter } from "next/router";

export type SortDirection = "asc" | "desc";
export type MentorFeedbackSortKey =
  | "date"
  | "subject"
  | "topic"
  | "feedback"
  | "rating";

export type MentorFeedbackRow = {
  id: string;
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
  feedbacks: MentorFeedbackRow[];
    semesters: Semester[];
    selectedSemesterId: string | null;
};

const ITEMS_PER_PAGE = 8;

function formatDate(value: string | null) {
  if (!value) return "-";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
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

function getSortValue(row: MentorFeedbackRow, key: MentorFeedbackSortKey) {
  if (key === "date") {
    return row.date_submitted ? new Date(row.date_submitted).getTime() : 0;
  }

  if (key === "rating") {
    return row.avg ?? -1;
  }

  return String(row[key] ?? "").toLowerCase();
}

export default function MentorFeedbacksPage({ feedbacks, semesters, selectedSemesterId }: Props) {
  const [searchQuery, setSearchQuery] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("all");
  const [sortCol, setSortCol] = useState<MentorFeedbackSortKey>("date");
  const [sortDir, setSortDir] = useState<SortDirection>("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedFeedback, setSelectedFeedback] = useState<MentorFeedbackRow | null>(null);

    const router = useRouter()

  const subjectOptions = useMemo(() => {
    return [...new Set(feedbacks.map((fb) => fb.subject).filter(Boolean))].sort();
  }, [feedbacks]);

    const handleSemesterChange = (semesterId: string) => {
        router.push({ pathname: router.pathname, query: { semester: semesterId } });
    };

  const filteredFeedbacks = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return feedbacks
      .filter((fb) => {
        const matchesSearch =
          !query ||
          [
            fb.date_formatted,
            fb.subject,
            fb.topic,
            fb.feedback,
            fb.avgLabel,
          ].some((value) => String(value).toLowerCase().includes(query));

        const matchesSubject =
          subjectFilter === "all" || fb.subject === subjectFilter;

        return matchesSearch && matchesSubject;
      })
      .sort((a, b) => {
        const aValue = getSortValue(a, sortCol);
        const bValue = getSortValue(b, sortCol);
        const result = aValue > bValue ? 1 : aValue < bValue ? -1 : 0;

        return sortDir === "asc" ? result : -result;
      });
  }, [feedbacks, searchQuery, subjectFilter, sortCol, sortDir]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredFeedbacks.length / ITEMS_PER_PAGE)
  );

  const paginatedFeedbacks = filteredFeedbacks.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  function handleSort(col: MentorFeedbackSortKey) {
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

  function handleSubjectFilter(value: string) {
    setSubjectFilter(value);
    setCurrentPage(1);
  }

  function resetFilters() {
    setSearchQuery("");
    setSubjectFilter("all");
    setCurrentPage(1);
  }

  return (
    <>
      <div className="border-b border-white-border">
        <h1 className="text-xl md:text-2xl xl:text-3xl font-extrabold tracking-tight text-up-maroon">
          Student Feedbacks
        </h1>
        <p className="text-xs md:text-sm xl:text-base font-medium text-slate-500 mt-1 mb-3">
          All student feedbacks collected from your sessions.
        </p>
      </div>

        <MentorFeedbackTable
            feedbacks={paginatedFeedbacks}
            totalCount={filteredFeedbacks.length}
            searchQuery={searchQuery}
            onSearch={handleSearch}
            subjectOptions={subjectOptions}
            subjectFilter={subjectFilter}
            onSubjectFilter={handleSubjectFilter}
            onResetFilters={resetFilters}
            sortCol={sortCol}
            sortDir={sortDir}
            onSort={handleSort}
            onView={setSelectedFeedback}
            semesters={semesters}
            selectedSemesterId={selectedSemesterId}
            onSemesterChange={handleSemesterChange}
        />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      <MentorFeedbackDetailModal
        feedback={selectedFeedback}
        onClose={() => setSelectedFeedback(null)}
      />
    </>
  );
}

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
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

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

    const semesters = await getRecentSemesters(supabase);
    const currentSemester = semesters.find(s => s.is_current);
    const selectedSemesterId = (context.query.semester as string) ?? currentSemester?.id ?? null;

  const { data: mentorProfile } = await supabase
    .from("mentor_profiles")
    .select("id")
    .eq("user_id", user.id)
    .single();

    if (!mentorProfile) {
        return { props: { feedbacks: [], semesters, selectedSemesterId } };
    }

const { data: bookingRows } = await supabase
  .from("bookings")
  .select(`
    id,
    topic,
    subjects (
      code,
      name
    )
  `)
  .eq("mentor_id", mentorProfile.id)
  .eq("semester_id", selectedSemesterId);

  const bookingIds = (bookingRows ?? []).map((booking: any) => booking.id);
  const bookingsById = new Map(
  (bookingRows ?? []).map((booking: any) => [String(booking.id), booking])
);

    if (bookingIds.length === 0) {
        return { props: { feedbacks: [], semesters, selectedSemesterId } };
    }

  const { data: feedbackRows } = await supabase
    .from("feedback")
    .select("*")
    .in("booking_id", bookingIds)
    .order("date_submitted", { ascending: false });

const feedbacks: MentorFeedbackRow[] = (feedbackRows ?? []).map((fb: any) => {
  const avg = getAverage(fb);
  const booking = fb.booking_id
    ? bookingsById.get(String(fb.booking_id))
    : null;

  return {
    id: String(fb.id),
    subject: fb.subject || booking?.subjects?.code || "-",
    topic: fb.topic || booking?.topic || "-",
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

  return {
    props: {
      feedbacks,
        semesters,
        selectedSemesterId,
    },
  };
};