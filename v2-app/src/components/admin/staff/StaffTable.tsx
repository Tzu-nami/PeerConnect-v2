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
    if (sortCol !== col) return <MdUnfoldMore className="text-text-brown-light" />
    return sortDir === 'asc' ? <MdArrowUpward className="text-text-brown" /> : <MdArrowDownward className="text-text-brown" />
}

export default function StaffTable({ staffList, searchQuery, onSearch, onAdd, onView, onEdit, onDelete, sortCol, sortDir, onSort }: StaffTableProps) {
    const sorted = sortData(staffList, sortCol as keyof StaffProfile, sortDir)

    return(
        <div className="rounded-xl shadow-md border border-cream-border mt-5">
            <div className="flex justify-between items-center p-5">
                <div>
                    <h2 className="font-bold text-lg">All Staff</h2>
                    <p className="text-sm text-text-brown-light font-medium">{sorted.length} Staff Member{sorted.length !== 1 ? 's' : ''} found</p>
                </div>

                <div className="flex gap-3">
                    <SearchBar
                        value={searchQuery} onChange={onSearch} placeholder="Search staff..."
                        className="w-56"
                    />
                    <button onClick={onAdd} className="flex gap-3 items-center text-cream text-sm font-semibold px-4 py-2 rounded-lg bg-btn-brown hover:bg-btn-brown-hover shadow-md cursor-pointer">
                        <MdPersonAddAlt1 />
                        Add Staff
                    </button>
                </div>
            </div>

            <div className="border-t border-cream-border">
                <table className="w-full text-left text-sm table-fixed">
                    <thead className="border-b border-cream-border bg-cream-dark">
                    <tr>
                        <th className="px-5 py-3 w-[30%]">
                            <button onClick={() => onSort('lastName')} className={`flex items-center gap-1 text-xs uppercase tracking-wider hover:text-text-brown transition cursor-pointer ${sortCol === 'lastName' ? 'font-extrabold text-text-brown' : 'font-bold text-text-brown-light'}`}>
                                Staff Name <SortIcon col="lastName" sortCol={sortCol} sortDir={sortDir} />
                            </button>
                        </th>
                        <th className="px-5 py-3 w-[25%]">
                            <button onClick={() => onSort('role')} className={`flex items-center gap-1 text-xs uppercase tracking-wider hover:text-text-brown transition cursor-pointer ${sortCol === 'role' ? 'font-extrabold text-text-brown' : 'font-bold text-text-brown-light'}`}>
                                Role <SortIcon col="role" sortCol={sortCol} sortDir={sortDir} />
                            </button>
                        </th>
                        <th className="px-5 py-3 w-[30%]">
                            <button onClick={() => onSort('email')} className={`flex items-center gap-1 text-xs uppercase tracking-wider hover:text-text-brown transition cursor-pointer ${sortCol === 'email' ? 'font-extrabold text-text-brown' : 'font-bold text-text-brown-light'}`}>
                                Email <SortIcon col="email" sortCol={sortCol} sortDir={sortDir} />
                            </button>
                        </th>
                        <th className="text-xs font-bold px-5 py-3 text-text-brown-light uppercase tracking-wider w-[15%] text-center">Actions</th>
                    </tr>
                    </thead>

                    <tbody>
                    {sorted.length === 0 ? (
                        <tr>
                            <td colSpan={4} className="text-center py-12 text-sm text-text-brown-light italic">
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