// Components
import StaffTableRow from "@/components/admin/staff/StaffTableRow";
import SearchBar from "@/components/ui/SearchBar";

// Icons
import { MdPersonAddAlt1 } from "react-icons/md";
import { MdArrowUpward, MdArrowDownward, MdUnfoldMore } from "react-icons/md"

// Types
import type { StaffProfile } from "@/types/staff";

// Utilities
import { sortData } from "@/utils/sortUtils";

// Props
interface StaffTableProps {
    staffList: StaffProfile[]
    searchQuery: string
    onSearch: (q: string) => void
    onAdd: () => void
    onView: (staff: StaffProfile) => void
    onEdit: (staff: StaffProfile) => void
    onDelete: (staff: StaffProfile) => void
    sortCol: string
    sortDir: 'asc' | 'desc'
    onSort: (col: string) => void
}

function SortIcon({ col, sortCol, sortDir }: { col: string, sortCol: string, sortDir: 'asc' | 'desc' }) {
    if (sortCol !== col) return <MdUnfoldMore className="text-text-muted" />
    return sortDir === 'asc' ? <MdArrowUpward className="text-up-maroon" /> : <MdArrowDownward className="text-up-maroon" />
}

export default function StaffTable({ staffList, searchQuery, onSearch, onAdd, onView, onEdit, onDelete, sortCol, sortDir, onSort }: StaffTableProps) {
    const sorted = sortData(staffList, sortCol as keyof StaffProfile, sortDir)

    return(
        <div className="rounded-xl  shadow-md border border-white-border mt-5">
            <div className="flex justify-between items-center p-5">
                <div>
                    <h2 className="font-bold text-lg">All Staff</h2>
                    <p className="text-sm text-text-muted font-medium">{sorted.length} Staff Member{sorted.length !== 1 ? 's' : ''} found</p>
                </div>

                <div className="flex gap-3">
                    <SearchBar
                        value={searchQuery} onChange={onSearch} placeholder="Search staff..."
                        className="w-56"
                    />
                    <button onClick={onAdd} className="flex gap-3 items-center text-white text-sm font-semibold px-4 py-2 rounded-lg bg-btn-gray hover:bg-btn-gray-hover shadow-md cursor-pointer">
                        <MdPersonAddAlt1 />
                        Add Staff
                    </button>
                </div>
            </div>

            <div className="border-t border-white-border">
                <table className="w-full text-left text-sm table-fixed">
                    <thead className="border-b border-white-border bg-white-dark">
                    <tr>
                        <th className="px-5 py-3 w-[30%]">
                            <button onClick={() => onSort('lastName')} className={`flex items-center gap-1 text-xs uppercase tracking-wider hover:text-up-maroon transition cursor-pointer ${sortCol === 'lastName' ? 'font-extrabold text-up-maroon' : 'font-bold text-text-muted'}`}>
                                Staff Name <SortIcon col="lastName" sortCol={sortCol} sortDir={sortDir} />
                            </button>
                        </th>
                        <th className="px-5 py-3 w-[25%]">
                            <button onClick={() => onSort('role')} className={`flex items-center gap-1 text-xs uppercase tracking-wider hover:text-up-maroon transition cursor-pointer ${sortCol === 'role' ? 'font-extrabold text-up-maroon' : 'font-bold text-text-muted'}`}>
                                Role <SortIcon col="role" sortCol={sortCol} sortDir={sortDir} />
                            </button>
                        </th>
                        <th className="px-5 py-3 w-[30%]">
                            <button onClick={() => onSort('email')} className={`flex items-center gap-1 text-xs uppercase tracking-wider hover:text-up-maroon transition cursor-pointer ${sortCol === 'email' ? 'font-extrabold text-up-maroon' : 'font-bold text-text-muted'}`}>
                                Email <SortIcon col="email" sortCol={sortCol} sortDir={sortDir} />
                            </button>
                        </th>
                        <th className="text-xs font-bold px-5 py-3 text-text-muted uppercase tracking-wider w-[15%] text-center">Actions</th>
                    </tr>
                    </thead>

                    <tbody>
                    {sorted.length === 0 ? (
                        <tr>
                            <td colSpan={4} className="text-center py-12 text-sm text-text-muted italic">
                                No staff found.
                            </td>
                        </tr>
                    ) : (
                        sorted.map(staff => (
                            <StaffTableRow key={staff.id} staff={staff} onView={onView} onEdit={onEdit} onDelete={onDelete} />
                        ))
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}