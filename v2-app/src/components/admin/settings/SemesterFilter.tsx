// Constants
import { TERM_LABELS } from '@/constants/termLabels'

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
        <select
            value={selected ?? ""}
            onChange={(e) => onChange(e.target.value)}
            className="px-3 py-2 text-sm rounded-sm min-w-[300px] border border-white-border bg-white  focus:outline-none focus:ring focus:ring-text-primary disabled:opacity-50 disabled:cursor-not-allowed">
            {!selected && <option value="" disabled>Select Semester</option>}
            {semesters.map((sem) => (
                <option key={sem.id} value={sem.id}>
                    {formatSemesterLabel(sem)}{sem.is_current ? " (Current)" : ""}
                </option>
            ))}
        </select>
    );
}