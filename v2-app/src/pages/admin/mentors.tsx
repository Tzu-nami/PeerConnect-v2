import { useState, useMemo } from 'react';
import { useRouter } from 'next/router';
import type { GetServerSideProps } from 'next';
import { createClient as createServerClient } from '@/utils/supabase/server';

// UI
import StatCard from '@/components/ui/StatCard';
import Pagination from '@/components/ui/Pagination';
import MentorTable from '@/components/admin/mentors/MentorTable';
import MentorModal from '@/components/landing/mentors/MentorModal';
import { FaChalkboardUser, FaCircleCheck, FaHourglass, FaTrophy } from 'react-icons/fa6';
import { toast } from 'sonner';

// Modals
import CreateMentorModal from '@/components/admin/mentors/CreateMentorModal';
import EditMentorModal from '@/components/admin/mentors/EditMentorModal';
import CreateCourseModal from '@/components/admin/courses/CreateCourseModal';
import DeleteMentorModal from '@/components/admin/mentors/DeleteMentorModal';

// Data fetch
import { getAdminMentorsData } from '@/utils/services/mentorService';
import type { AdminMentor, MentorStat } from '@/types/admin';

const PAGE_SIZE = 8;

interface Props {
  initialMentors: AdminMentor[];
  subjects: { id: string; code: string; name: string }[];
  stats: MentorStat;
  isAuthenticated: boolean;
  userRole?: string;
}

export default function AdminMentorsPage({ initialMentors, subjects, stats }: Props) {
  const router = useRouter();

  // Table
  const [search, setSearch] = useState('');
  const [sortCol, setSortCol] = useState('name');
  const [sortDir, setSortDir] = useState<'asc'|'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);

  // Modal
  const [viewMentor, setViewMentor]     = useState<AdminMentor | null>(null);
  const [editMentor, setEditMentor]     = useState<AdminMentor | null>(null);
  const [deleteMentor, setDeleteMentor] = useState<AdminMentor | null>(null);
  const [showCreate, setShowCreate]     = useState(false);
  const [showSubject, setShowSubject]   = useState(false);

  // Filters
  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return initialMentors
      .filter((m) =>
        !q ||
        `${m.firstName} ${m.lastName}`.toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q) ||
        m.student_num.includes(q) ||
        m.degreeProgram.toLowerCase().includes(q) ||
        m.subjects?.some((sub) => 
          sub.code.toLowerCase().includes(q)
        )
      )
      .sort((a, b) => {
        const va = sortCol === 'name' ? `${a.lastName}${a.firstName}` : (a as any)[sortCol] ?? '';
        const vb = sortCol === 'name' ? `${b.lastName}${b.firstName}` : (b as any)[sortCol] ?? '';
        return sortDir === 'asc' ? va.localeCompare(vb) : vb.localeCompare(va);
      });
  }, [initialMentors, search, sortCol, sortDir]);

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
      {/* Header and stat cards */}
      <div className="border-cream-border">
        <div>
          <h1 className="text-xl md:text-2xl xl:text-3xl font-extrabold tracking-tight text-up-maroon">Mentor Management</h1>
          <p className="text-xs md:text-sm xl:text-base font-medium text-slate-500 mt-1 mb-3">LRC Registry of Peer Mentors</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full mt-5">
        <StatCard 
          label="Total Mentors" 
          value={stats.total} 
          icon={<FaChalkboardUser />} 
          borderColor="border-green-600"
          iconColor="text-green-600"
        />
        <StatCard 
          label="Accepted This Week" 
          value={stats.acceptedThisWeek} 
          icon={<FaCircleCheck />}
          borderColor="border-blue-600"
          iconColor="text-blue-600"
        />
        <StatCard 
          label="Pending This Week" 
          value={stats.pendingThisWeek} 
          icon={<FaHourglass />}
          borderColor="border-yellow-500"
          iconColor="text-yellow-500" 
        />
        <StatCard 
          label="Most Active" 
          value={stats.mostActive} 
          icon={<FaTrophy />}
          borderColor="border-red-600"
          iconColor="text-red-600"
        />
      </div>

      {/* Table */}
      <MentorTable 
          mentors={paginated}
          totalCount={filtered.length}
          searchQuery={search}
          onSearch={(q) => { setSearch(q); setCurrentPage(1); }}
          onAddSubject={() => setShowSubject(true)}
          onAddMentor={() => setShowCreate(true)}
          onView={(mentor) => setViewMentor(mentor)}
          onEdit={(mentor) => setEditMentor(mentor)}
          onDelete={(mentor) => setDeleteMentor(mentor)}
          sortCol={sortCol}
          sortDir={sortDir}
          onSort={handleSort}
      />
      
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />

      {/* Modals */}
      <MentorModal 
        mentor={viewMentor} 
        onClose={() => setViewMentor(null)} 
        hideFooter={true} 
      />

      <CreateMentorModal 
        isOpen={showCreate} 
        onClose={() => setShowCreate(false)} 
        onSuccess={() => {
          handleRefresh()
          setShowCreate(false);
          toast.success("Mentor registered successfully.");
        }} 
        subjects={subjects} 
      />

      <EditMentorModal 
        isOpen={!!editMentor} 
        mentor={editMentor} 
        onClose={() => setEditMentor(null)} 
        onSuccess={() => {
          handleRefresh()
          setEditMentor(null);
          toast.success("Mentor updated successfully.");
        }}  
        subjects={subjects} 
      />

      <CreateCourseModal 
        isOpen={showSubject} 
        onClose={() => setShowSubject(false)} 
        onSuccess={() => {
          handleRefresh()
          setShowSubject(false);
          toast.success("Subject added successfully.");
        }} 
      />

      <DeleteMentorModal 
        mentor={deleteMentor} 
        onClose={() => setDeleteMentor(null)} 
        onSuccess={() => {
          handleRefresh()
          setDeleteMentor(null);
          toast.success("Mentor deleted successfully.");
        }} 
      />
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const supabase = createServerClient(context);
  
  // Must be admin
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { redirect: { destination: '/login', permanent: false } };

  const { data: profile } = await supabase.from('user_profiles').select('role').eq('id', user.id).single();
  if (profile?.role !== 'admin') return { redirect: { destination: '/login', permanent: false } };

  const { mentors, subjects, stats } = await getAdminMentorsData(supabase);

  return { 
    props: { 
      initialMentors: mentors, 
      subjects, 
      stats, 
      isAuthenticated: true, 
      userRole: 'admin' 
    } 
  };
};