import CourseTableRow from './CourseTableRow';
import SearchBar from '@/components/ui/SearchBar';

// Icons
import { MdLibraryAdd, MdArrowUpward, MdArrowDownward, MdUnfoldMore } from "react-icons/md";

import type { AdminCourse } from '@/types/admin';

interface CourseTableProps {
    subjects: AdminCourse[];
    totalCount: number;
    searchQuery: string;
    onSearch: (q: string) => void;
    onAddSubject: () => void;
    onView: (s: AdminCourse) => void;
    onEdit: (s: AdminCourse) => void;
    onDelete: (s: AdminCourse) => void;
    sortCol: string;
    sortDir: 'asc' | 'desc';
    onSort: (col: string) => void;
}

function SortIcon({ col, sortCol, sortDir }: { col: string, sortCol: string, sortDir: 'asc' | 'desc' }) {
    if (sortCol !== col) return <MdUnfoldMore className="text-text-brown-light" />;
    return sortDir === 'asc' ? <MdArrowUpward className="text-text-brown" /> : <MdArrowDownward className="text-text-brown" />;
}

export default function CourseTable({ 
    subjects, totalCount, searchQuery, onSearch, onAddSubject, onView, onEdit, onDelete, sortCol, sortDir, onSort 
}: CourseTableProps) {
    return (
        <div className="rounded-xl shadow-md border border-cream-border mt-5 bg-cream">
            {/* Header and search */}
            <div className="flex flex-wrap gap-4 justify-between items-center p-5">
                <div>
                    <h2 className="font-bold text-lg text-text-brown">Subject List</h2>
                    <p className="text-sm text-text-brown-light font-medium">
                        {totalCount} Subject{totalCount !==1 ? 's' : ''} found
                    </p>
                </div>

                <div className="flex gap-2 items-center flex-wrap">
                    <SearchBar 
                        value={searchQuery} 
                        onChange={onSearch} 
                        placeholder="Search subjects..." 
                        className="w-56"
                    />
                    <button onClick={onAddSubject} 
                        className="flex gap-2 items-center text-cream text-sm font-semibold px-4 py-2 rounded-lg bg-btn-brown hover:bg-btn-brown-hover shadow-md cursor-pointer transition">
                        <MdLibraryAdd />
                        Add Subject
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="border-t border-cream-border overflow-x-auto">
                <table className="w-full text-left text-sm table-fixed min-w-[800px]">
                    <thead className="border-b border-cream-border bg-cream-dark">
                        <tr>
                            <th className="px-5 py-3">
                                <button onClick={() => onSort('code')} className={`flex items-center gap-1 text-xs uppercase tracking-wider hover:text-text-brown transition cursor-pointer ${sortCol === 'code' ? 'font-extrabold text-text-brown' : 'font-bold text-text-brown-light'}`}>
                                    Subject Code <SortIcon col="code" sortCol={sortCol} sortDir={sortDir} />
                                </button>
                            </th>
                            <th className="px-5 py-3 w-[35%]">
                                <button onClick={() => onSort('name')} className={`flex items-center gap-1 text-xs uppercase tracking-wider hover:text-text-brown transition cursor-pointer ${sortCol === 'name' ? 'font-extrabold text-text-brown' : 'font-bold text-text-brown-light'}`}>
                                    Subject Name <SortIcon col="name" sortCol={sortCol} sortDir={sortDir} />
                                </button>
                            </th>
                            <th className="px-5 py-3 w-[30%]">
                                <button onClick={() => onSort('mentorCount')} className={`flex items-center gap-1 text-xs uppercase tracking-wider hover:text-text-brown transition cursor-pointer ${sortCol === 'mentorCount' ? 'font-extrabold text-text-brown' : 'font-bold text-text-brown-light'}`}>
                                    No. of Mentors <SortIcon col="mentorCount" sortCol={sortCol} sortDir={sortDir} />
                                </button>
                            </th>
                            <th className="px-5 py-3 w-[10%] text-xs font-bold text-text-brown-light uppercase tracking-wider text-center">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {subjects.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="text-center py-12 text-sm text-text-brown-light italic">No subjects found.</td>
                            </tr>
                        ) : (
                            subjects.map((sub) => (
                                <CourseTableRow 
                                    key={sub.id} 
                                    subject={sub} 
                                    onView={onView} 
                                    onEdit={onEdit} 
                                    onDelete={onDelete} 
                                />
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}