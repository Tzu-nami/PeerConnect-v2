import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/router';
import type { Mentor, Subject } from '@/types/mentor';
import MentorFilters from './MentorFilters';
import MentorCard from './MentorCard';
import MentorModal from './MentorModal';
import MentorFilterCards from '@/components/student/MentorFilterCards';
import Pagination from '@/components/ui/Pagination';
import { FaChalkboardUser } from 'react-icons/fa6';

const PAGE_SIZE = 8;

interface Props {
    mentors: Mentor[];
    subjects: Subject[];
    isAuthenticated: boolean;
    userRole?: string;
}

export default function MentorDirectory({ mentors, subjects, isAuthenticated, userRole }: Props) {
    const [searchQuery, setSearchQuery]         = useState('');
    const [selectedDay, setSelectedDay]         = useState('');
    const [selectedSubject, setSelectedSubject] = useState('');
    const [currentPage, setCurrentPage]         = useState(1);
    const [selectedMentor, setSelectedMentor]   = useState<Mentor | null>(null);

    const router = useRouter();

    // Pre-filter mentors by subject from URL query (e.g. GlobalSearch)
    useEffect(() => {
        const subjectId = router.query.subjectId

        if (subjectId && typeof subjectId === 'string') {
            setSelectedSubject(subjectId)
        }
    }, [router.query])

    // Filter logic
    const filteredMentors = useMemo(() => {
        return mentors.filter((m) => {
        const q = searchQuery.toLowerCase();
        const matchesSearch =
            !q ||
            m.firstName.toLowerCase().includes(q) ||
            m.lastName.toLowerCase().includes(q) ||
            m.email.toLowerCase().includes(q);

        const matchesDay =
            !selectedDay ||
            m.days.includes(selectedDay);

        const matchesSubject =
            !selectedSubject ||
            m.subjects.some((s) => String(s.id) === String(selectedSubject));

        return matchesSearch && matchesDay && matchesSubject;
        });
    }, [mentors, searchQuery, selectedDay, selectedSubject]);

    const totalPages = Math.max(1, Math.ceil(filteredMentors.length / PAGE_SIZE));

    // Pagination logic
    const paginatedMentors = useMemo(() => {
        const start = (currentPage - 1) * PAGE_SIZE;
        return filteredMentors.slice(start, start + PAGE_SIZE);
    }, [filteredMentors, currentPage]);

    const handleSearch = (q: string) => { setSearchQuery(q); setCurrentPage(1); };
    const handleDay = (d: string) => { setSelectedDay(d); setCurrentPage(1); };
    const handleSubject = (s: string) => { setSelectedSubject(s); setCurrentPage(1); };

    // Change layout
    const showDashboardFilters = isAuthenticated && (userRole === 'student' || userRole === 'mentor');

    return (
        <div>
        {showDashboardFilters ? (
            <MentorFilterCards
            subjects={subjects}
            searchQuery={searchQuery}
            selectedDay={selectedDay}
            selectedSubject={selectedSubject}
            resultCount={filteredMentors.length}
            onSearch={handleSearch}
            onDayChange={handleDay}
            onSubjectChange={handleSubject}
            />
        ) : (
            <MentorFilters
            subjects={subjects}
            searchQuery={searchQuery}
            selectedDay={selectedDay}
            selectedSubject={selectedSubject}
            resultCount={filteredMentors.length}
            onSearch={handleSearch}
            onDayChange={handleDay}
            onSubjectChange={handleSubject}
            />
        )}

        {/* Empty state */}
        {filteredMentors.length === 0 && (
            <div className="bg-white rounded-xl border border-white-border py-20 text-center shadow-sm flex flex-col items-center justify-center">
                <FaChalkboardUser className="text-4xl text-gray-300 mb-4" />
                <p className="font-medium text-gray-500">No mentors found.</p>
                <p className="text-xs mt-1 text-gray-400">Try adjusting your search or filter.</p>
            </div>
        )}

        {/* Mentor grid */}
        {filteredMentors.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 justify-items-center animate-fade-up"
            style={{ animationDelay: '250ms' }}>
            {paginatedMentors.map((mentor) => (
                <MentorCard
                key={mentor.id}
                mentor={mentor}
                onClick={() => setSelectedMentor(mentor)}
                />
            ))}
            </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
            <Pagination 
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
            />
        )}

        {/* Modal */}
        <MentorModal
            mentor={selectedMentor}
            onClose={() => setSelectedMentor(null)}
            isAuthenticated={isAuthenticated}
            userRole={userRole}
            hideFooter={userRole === 'admin'}
        />
        </div>
    );
}