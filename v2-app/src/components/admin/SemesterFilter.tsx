// components/admin/SemesterFilter.tsx
import { useState } from 'react';
import { MdKeyboardArrowDown } from 'react-icons/md';
import {Semester} from "@/types/semester";
import { TERM_LABELS } from '@/constants/termLabels';


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
    const [isOpen, setIsOpen] = useState(false);

    const selectedSemester = semesters.find(s => s.id === selected);
    const label = selectedSemester ? formatSemesterLabel(selectedSemester) : 'Select Semester';

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="px-4 py-2 text-xs font-medium text-text-primary border border-white-border rounded-lg bg-white outline-none focus:ring-1 focus:border-text-brown-light focus:ring-text-brown-light/30 transition-shadow h-[36px] min-w-[280px] flex items-center justify-between gap-3 shadow-sm cursor-pointer">
                <span>{label}</span>
                <MdKeyboardArrowDown className={`text-xl text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
                    <div className="absolute right-0 mt-2 w-[280px] bg-white border border-white-border rounded-xl shadow-xl z-50 py-2 overflow-hidden">
                        {semesters.map(sem => (
                            <button
                                key={sem.id}
                                onClick={() => { onChange(sem.id); setIsOpen(false); }}
                                className={`w-full text-left px-4 py-2.5 hover:bg-white transition text-sm font-bold flex items-center justify-between ${sem.id === selected ? 'text-up-maroon' : 'text-slate-700'}`}
                            >
                                <span>{formatSemesterLabel(sem)}</span>
                                {sem.is_current && <span className="text-xs font-normal text-text-white-light">Current</span>}
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}