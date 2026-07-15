// Constants
import { TERM_LABELS } from '@/constants/termLabels'

// Icons
import { MdKeyboardArrowDown } from 'react-icons/md'

// Types
import { Semester } from "@/types/semester"

interface SemesterFilterProps {
    semesters: Semester[];
    selected: string | null;
    onChange: (semesterId: string) => void;
}

function formatSemesterLabel(sem: Semester) {
    const termLabel = TERM_LABELS[sem.term] ?? sem.term;
    return `${termLabel} (${sem.ay_start} - ${sem.ay_start + 1})`;
}

export default function SemesterFilter({ semesters, selected, onChange }: SemesterFilterProps) {
    return (
        <div className="relative">
            <select
                value={selected ?? ""}
                onChange={(e) => onChange(e.target.value)}
                className="px-4 py-2 pr-9 text-xs font-medium text-text-primary border border-white-border rounded-lg bg-white outline-none focus:ring-1 focus:border-text-brown-light focus:ring-text-brown-light/30 transition-shadow h-[36px] min-w-[280px] shadow-sm cursor-pointer"
            >
                {!selected && <option value="" disabled>Select Semester</option>}
                {semesters.map(sem => (
                    <option key={sem.id} value={sem.id}>
                        {formatSemesterLabel(sem)}{sem.is_current ? " (Current)" : ""}
                    </option>
                ))}
            </select>
        </div>
    );
}