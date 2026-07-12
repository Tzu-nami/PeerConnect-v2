import { useState, useMemo } from 'react';
import { useRouter } from 'next/router';
import type { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { createClient as createServerClient } from '@/utils/supabase/server';

// UI
import StatCard from '@/components/ui/StatCard';
import Pagination from '@/components/ui/Pagination';
import SessionTable from '@/components/admin/sessions/SessionTable';
import { FaListCheck, FaCircleCheck, FaHourglassHalf, FaStopwatch } from 'react-icons/fa6';
import { toast } from 'sonner';

// Modals
import SessionStatsModal from '@/components/admin/sessions/SessionStatsModal';
import SessionDetailModal from '@/components/admin/sessions/ViewSessionModal';
import EditSessionModal from '@/components/admin/sessions/EditSessionModal';
import CancelSessionModal from '@/components/admin/sessions/CancelSessionModal';

// Data fetch
import { getRecentSemesters, getAdminSessionsData } from '@/utils/services/sessionService';
import type { AdminSession, SessionCounts } from '@/types/admin';
import {Semester} from "@/types/semester";

const PAGE_SIZE = 10;

interface SessionProps {
    initialSessions: AdminSession[];
    counts: SessionCounts;
    semesters: Semester[]
    selectedSemesterId: string | null;
}

export default function AdminSessionsPage({ initialSessions, counts, semesters, selectedSemesterId }: SessionProps) {
  const router = useRouter();

    const handleSemesterChange = (semesterId: string) => {
        router.push({ pathname: router.pathname, query: { semester: semesterId } });
    };

  // Table
  const [search, setSearch] = useState('');
  const [statusFilters, setStatusFilters] = useState<string[]>([]);
  const [sortCol, setSortCol] = useState('date');
  const [sortDir, setSortDir] = useState<'asc'|'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);

  // Modal
  const [activeStatModal, setActiveStatModal] = useState<'all' | 'accepted' | 'pending' | 'hours' | null>(null);
  const [viewSession, setViewSession] = useState<AdminSession | null>(null);
  const [editSession, setEditSession] = useState<AdminSession | null>(null);
  const [cancelSession, setCancelSession] = useState<AdminSession | null>(null);

  // Status filter
  const availableStatuses = useMemo(() => {
    return Array.from(new Set(initialSessions.map(s => s.status)));
  }, [initialSessions]);

  // Filters and sort
  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    
    return initialSessions
      .filter((s) => {
        const matchesSearch = !q || [s.student, s.mentor, s.subject, s.topic, s.date].join(' ').toLowerCase().includes(q);
        const matchesStatus = statusFilters.length === 0 || statusFilters.includes(s.status);
        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
        let valA = a[sortCol as keyof AdminSession] ?? '';
        let valB = b[sortCol as keyof AdminSession] ?? '';

        // Convert dates
        if (sortCol === 'date') {
          valA = new Date(a.date).getTime();
          valB = new Date(b.date).getTime();
        }
        if (typeof valA === 'string') valA = valA.toLowerCase();
        if (typeof valB === 'string') valB = valB.toLowerCase();
        if (valA < valB) return sortDir === 'asc' ? -1 : 1;
        if (valA > valB) return sortDir === 'asc' ? 1 : -1;
        return 0;
      });
  }, [initialSessions, search, statusFilters, sortCol, sortDir]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated  = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const handleSort = (col: string) => {
    if (sortCol === col) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortCol(col); setSortDir('asc'); }
    setCurrentPage(1);
  };

  const handleRefresh = () => {
    router.replace(router.asPath);
  };

    return (
        <div>
            {/* Header */}
            <div className="border-cream-border">
                <div>
                    <h1 className="text-xl md:text-2xl xl:text-3xl font-extrabold tracking-tight text-up-maroon">
                        Session Management
                    </h1>
                    <p className="text-xs md:text-sm xl:text-base font-medium text-slate-500 mt-1 mb-3">
                        LRC Registry of all tutorial sessions across all mentors
                    </p>
                </div>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full mt-5 mb-6">
                <StatCard onClick={() => setActiveStatModal('all')} label="All Sessions" value={counts.total} icon={<FaListCheck />} borderColor="border-slate-400" iconColor="text-slate-500" />
                <StatCard onClick={() => setActiveStatModal('accepted')} label="Accepted" value={counts.accepted} icon={<FaCircleCheck />} borderColor="border-green-600" iconColor="text-green-600" />
                <StatCard onClick={() => setActiveStatModal('pending')} label="Pending" value={counts.pending} icon={<FaHourglassHalf />} borderColor="border-yellow-500" iconColor="text-yellow-500" />
                <StatCard onClick={() => setActiveStatModal('hours')} label="Total Hours" value={counts.totalHours} icon={<FaStopwatch />} borderColor="border-purple-600" iconColor="text-purple-600" />
            </div>

            {/* Table */}
            <>
                <SessionTable
                    sessions={paginated}
                    totalCount={filtered.length}
                    searchQuery={search}
                    onSearch={(q) => { setSearch(q); setCurrentPage(1); }}
                    statusFilters={statusFilters}
                    onStatusChange={(newStatuses) => { setStatusFilters(newStatuses); setCurrentPage(1); }}
                    availableStatuses={availableStatuses}
                    sortCol={sortCol}
                    sortDir={sortDir}
                    onSort={handleSort}
                    onView={(session) => setViewSession(session)}
                    onEdit={(session) => setEditSession(session)}
                    onCancel={(session) => setCancelSession(session)}
                    semesters={semesters}
                    selectedSemesterId={selectedSemesterId}
                    onSemesterChange={handleSemesterChange}
                />

                <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />

                {/* Modals */}
                <SessionStatsModal
                    isOpen={activeStatModal === 'all'}
                    onClose={() => setActiveStatModal(null)}
                    title="All Sessions"
                    subtitle={`${counts.total} sessions`}
                    sessions={initialSessions}
                />

                <SessionStatsModal
                    isOpen={activeStatModal === 'accepted'}
                    onClose={() => setActiveStatModal(null)}
                    title="Accepted Sessions"
                    subtitle={`${counts.accepted} sessions`}
                    sessions={initialSessions.filter(s => s.status === 'accepted')}
                />

                <SessionStatsModal
                    isOpen={activeStatModal === 'pending'}
                    onClose={() => setActiveStatModal(null)}
                    title="Pending Sessions"
                    subtitle={`${counts.pending} sessions`}
                    sessions={initialSessions.filter(s => s.status === 'pending')}
                />

                <SessionStatsModal
                    isOpen={activeStatModal === 'hours'}
                    onClose={() => setActiveStatModal(null)}
                    title="Total Session Hours"
                    subtitle="Completed sessions only"
                    sessions={initialSessions.filter(s => s.status === 'completed')}
                    showHours={true}
                />

                <SessionDetailModal
                    isOpen={!!viewSession}
                    session={viewSession}
                    onClose={() => setViewSession(null)}
                />

                <EditSessionModal
                    isOpen={!!editSession}
                    session={editSession}
                    onClose={() => setEditSession(null)}
                    onSuccess={() => { handleRefresh(); setEditSession(null); toast.success("Hours updated successfully."); }}
                />

                <CancelSessionModal
                    isOpen={!!cancelSession}
                    session={cancelSession}
                    onClose={() => setCancelSession(null)}
                    onSuccess={() => { handleRefresh(); setCancelSession(null); toast.success("Session has been cancelled."); }}
                />
            </>
        </div>
    );
}

export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext) => {
    const supabase = createServerClient(context);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { redirect: { destination: '/login', permanent: false } };

    const { data: profile } = await supabase.from('user_profiles').select('role').eq('id', user.id).single();
    if (profile?.role !== 'admin') return { redirect: { destination: '/login', permanent: false } };

    const semesters = await getRecentSemesters(supabase);
    const currentSemester = semesters.find(s => s.is_current);
    const selectedSemesterId = (context.query.semester as string) ?? currentSemester?.id ?? null;

    const { sessions, counts } = await getAdminSessionsData(supabase, selectedSemesterId);

    return {
        props: {
            initialSessions: sessions, counts, semesters, selectedSemesterId
        }
    }
};