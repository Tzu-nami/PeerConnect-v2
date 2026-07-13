import MentorTableRow from "@/components/admin/mentors/MentorTableRow";
import SearchBar from "@/components/ui/SearchBar";

// Icons
import { MdPersonAddAlt1, MdLibraryAdd, MdArrowUpward, MdArrowDownward, MdUnfoldMore } from "react-icons/md";

import type { AdminMentor } from "@/types/admin";

interface MentorTableProps {
    mentors: AdminMentor[];
    totalCount: number;
    searchQuery: string;
    onSearch: (q: string) => void;
    onAddMentor: () => void;
    onAddSubject: () => void;
    onView: (mentor: AdminMentor) => void;
    onEdit: (mentor: AdminMentor) => void;
    onDelete: (mentor: AdminMentor) => void;
    sortCol: string;
    sortDir: 'asc' | 'desc';
    onSort: (col: string) => void;
}

function SortIcon({ col, sortCol, sortDir }: { col: string, sortCol: string, sortDir: 'asc' | 'desc' }) {
    if (sortCol !== col) return <MdUnfoldMore className="text-text-white-light" />;
    return sortDir === 'asc' ? <MdArrowUpward className="text-text-primary" /> : <MdArrowDownward className="text-text-primary" />;
}

export default function MentorTable({
    mentors, totalCount, searchQuery, onSearch, onAddMentor, onAddSubject, onView, onEdit, onDelete, sortCol, sortDir, onSort
}: MentorTableProps) {
    return (
        <div className="rounded-xl shadow-md border border-white-border mt-5 bg-white">
            {/* Header and search */}
            <div className="flex flex-wrap gap-4 justify-between items-center p-5">
                <div>
                    <h2 className="font-bold text-lg text-text-primary">Mentor List</h2>
                    <p className="text-sm text-text-white-light font-medium">
                        {totalCount} Mentor{totalCount !== 1 ? 's' : ''} found
                    </p>
                </div>

                <div className="flex flex-wrap gap-3 items-center">
                    <SearchBar 
                        value={searchQuery} 
                        onChange={onSearch} 
                        placeholder="Search mentors..." 
                        className="w-56"
                    />
                    <button onClick={onAddSubject} 
                        className="flex gap-2 items-center text-white text-sm font-semibold px-4 py-2 rounded-lg bg-btn-brown hover:bg-btn-brown-hover shadow-md cursor-pointer transition">
                        <MdLibraryAdd />
                        Add Subject
                    </button>
                    <button onClick={onAddMentor} 
                        className="flex gap-2 items-center text-white text-sm font-semibold px-4 py-2 rounded-lg bg-btn-brown hover:bg-btn-brown-hover shadow-md cursor-pointer transition">
                        <MdPersonAddAlt1 />
                        Add Mentor
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="border-t border-white-border overflow-x-auto">
                <table className="w-full text-left text-sm table-fixed min-w-[800px]">
                    <thead className="border-b border-white-border bg-white-dark">
                        <tr>
                            <th className="px-5 py-3 w-[25%]">
                                <button onClick={() => onSort('name')} className={`flex items-center gap-1 text-xs uppercase tracking-wider hover:text-text-primary transition cursor-pointer ${sortCol === 'name' ? 'font-extrabold text-text-primary' : 'font-bold text-text-white-light'}`}>
                                    Mentor Name <SortIcon col="name" sortCol={sortCol} sortDir={sortDir} />
                                </button>
                            </th>
                            <th className="px-5 py-3 w-[15%]">
                                <button onClick={() => onSort('student_num')} className={`flex items-center gap-1 text-xs uppercase tracking-wider hover:text-text-primary transition cursor-pointer ${sortCol === 'student_num' ? 'font-extrabold text-text-primary' : 'font-bold text-text-white-light'}`}>
                                    Student No. <SortIcon col="student_num" sortCol={sortCol} sortDir={sortDir} />
                                </button>
                            </th>
                            <th className="px-5 py-3 w-[25%]">
                                <button onClick={() => onSort('email')} className={`flex items-center gap-1 text-xs uppercase tracking-wider hover:text-text-primary transition cursor-pointer ${sortCol === 'email' ? 'font-extrabold text-text-primary' : 'font-bold text-text-white-light'}`}>
                                    UP Mail <SortIcon col="email" sortCol={sortCol} sortDir={sortDir} />
                                </button>
                            </th>
                            <th className="px-5 py-3 w-[25%] text-xs font-bold text-text-white-light uppercase tracking-wider">
                                Subjects
                            </th>
                            <th className="px-5 py-3 w-[10%] text-xs font-bold text-text-white-light uppercase tracking-wider text-center">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {mentors.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="text-center py-12 text-sm text-text-white-light italic">
                                    No mentors match your search.
                                </td>
                            </tr>
                        ) : (
                            mentors.map((mentor) => (
                                <MentorTableRow 
                                    key={mentor.id} 
                                    mentor={mentor} 
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