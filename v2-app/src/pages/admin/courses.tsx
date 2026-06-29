import { useState, useMemo } from "react";
import { useRouter } from "next/router";
import type { GetServerSideProps } from 'next';
import { createClient as createServerClient } from '@/utils/supabase/server';

// UI
import Pagination from '@/components/ui/Pagination';
import CourseTable from '@/components/admin/courses/CourseTable';
import { toast } from 'sonner';

// Modals
import CreateCourseModal from "@/components/admin/courses/CreateCourseModal";
import EditCourseModal from "@/components/admin/courses/EditCourseModal";
import DeleteCourseModal from "@/components/admin/courses/DeleteCourseModal";
import ViewCourseModal from "@/components/admin/courses/ViewCourseModal";

// Data fetch
import { getAdminCourseData } from "@/utils/services/courseService";
import { AdminCourse } from "@/types/admin";

const PAGE_SIZE = 8;

interface CourseProps {
    initialSubjects: AdminCourse[];
}

export default function AdminCoursesPage({ initialSubjects }: CourseProps) {
    const router = useRouter();

    // Table
    const [search, setSearch] = useState('');
    const [sortCol, setSortCol] = useState('code');
    const [sortDir, setSortDir] = useState<'asc'|'desc'>('asc');
    const [currentPage, setCurrentPage] = useState(1);

    // Modal
    const [showCreate, setShowCreate] = useState(false);
    const [editSubject, setEditSubject] = useState<AdminCourse | null>(null);
    const [deleteSubject, setDeleteSubject] = useState<AdminCourse | null>(null);
    const [viewSubject, setViewSubject] = useState<AdminCourse | null>(null);

    // Filters
    const filtered = useMemo(() => {
        const q = search.toLowerCase();
        return initialSubjects
        .filter((s) => !q || s.code.toLowerCase().includes(q) || s.name.toLowerCase().includes(q))
        .sort((a, b) => {
            let va: any = a[sortCol as keyof AdminCourse];
            let vb: any = b[sortCol as keyof AdminCourse];
            if (typeof va === 'string') va = va.toLowerCase();
            if (typeof vb === 'string') vb = vb.toLowerCase();

            if (va < vb) return sortDir === 'asc' ? -1 : 1;
            if (va > vb) return sortDir === 'asc' ? 1 : -1;
            return 0;
        });
    }, [initialSubjects, search, sortCol, sortDir]);

    // Pagination
    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

    const handleSort = (col: string) => {
        if (sortCol === col) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
        else { setSortCol(col); setSortDir('asc'); }
        setCurrentPage(1);
    };

    const handleRefresh = () => {
        router.replace(router.asPath);
    }

    return (
        <div>
            {/* Header */}
            <div className="border-cream-border">
                <div>
                    <h1 className="text-xl md:text-2xl xl:text-3xl font-extrabold tracking-tight text-up-maroon">Course Management</h1>
                    <p className="text-xs md:text-sm xl:text-base font-medium text-slate-500 mt-1 mb-3">LRC Registry of Subjects</p>
                </div>
            </div>

            {/* Table */}
            <CourseTable 
                subjects={paginated}
                totalCount={filtered.length}
                searchQuery={search}
                onSearch={(q) => { setSearch(q); setCurrentPage(1); }}
                onAddSubject={() => setShowCreate(true)}
                onView={(sub) => setViewSubject(sub)}
                onEdit={(sub) => setEditSubject(sub)}
                onDelete={(sub) => setDeleteSubject(sub)}
                sortCol={sortCol}
                sortDir={sortDir}
                onSort={handleSort}
            />
            
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />

            {/* Modals */}
            <CreateCourseModal 
                isOpen={showCreate} 
                onClose={() => setShowCreate(false)} 
                onSuccess={() => { handleRefresh(); setShowCreate(false); toast.success("Subject added successfully."); }} 
            />

            <EditCourseModal
                isOpen={!!editSubject} 
                subject={editSubject} 
                onClose={() => setEditSubject(null)} 
                onSuccess={() => { 
                    handleRefresh(); 
                    setEditSubject(null); 
                    toast.success("Subject updated successfully."); 
                }} 
            />

            <DeleteCourseModal 
                isOpen={!!deleteSubject}
                subject={deleteSubject} 
                onClose={() => setDeleteSubject(null)} 
                onSuccess={() => { 
                    handleRefresh(); 
                    setDeleteSubject(null); 
                    toast.success("Subject removed successfully."); 
                }} 
            />

            <ViewCourseModal 
                isOpen={!!viewSubject}
                subject={viewSubject}
                onClose={() => setViewSubject(null)}
            />
        </div>
    );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const supabase = createServerClient(context as any);
    
    // Must be admin
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { redirect: { destination: '/login', permanent: false } };

    const { data: profile } = await supabase.from('user_profiles').select('role').eq('id', user.id).single();
    if (profile?.role !== 'admin') return { redirect: { destination: '/login', permanent: false } };
    
    const { subjects } = await getAdminCourseData(supabase)

    return { 
        props: { 
        initialSubjects : subjects
        } 
    };
};