import type { Subject } from "@/types/mentor";
import SearchBar from "@/components/ui/SearchBar";

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

interface Props {
    subjects: Subject[];
    searchQuery: string;
    selectedDay: string;
    selectedSubject: string;
    resultCount: number;
    onSearch: (q: string) => void;
    onDayChange: (d: string) => void;
    onSubjectChange: (s: string) => void;
}

export default function MentorFilterCards({
    subjects, searchQuery, selectedDay, selectedSubject, resultCount, onSearch, onDayChange, onSubjectChange, 
}: Props) {
    return (
        <div>
            <div className="mb-3 pb-1 border-b border-cream-border animate-[slideDown_0.3s_ease]" />
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">

                {/* Filtered results */}
                <span className="text-sm font-medium text-text-brown-light">Showing {resultCount} mentor{resultCount !== 1 ? 's' : ''}    
                </span>

                <div className="flex flex-wrap items-center gap-3">
                    {/* Search bar */}
                    <SearchBar
                        value={searchQuery}
                        onChange={onSearch}
                        placeholder="Search name..."
                        className="w-56"
                    />

                    {/* Day filters */}
                    <div className="flex items-center gap-2 bg-white p-1 rounded-lg border border-cream-border shadow-sm h-[36px]">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-text-brown-light pl-2 pr-1">Day</span>
                        <div className="flex gap-1">
                            <button
                                onClick={() => onDayChange('')}
                                className={`px-3 py-1 text-xs font-bold rounded transition ${
                                    selectedDay === '' ? 'bg-up-maroon text-white shadow-md' : 'bg-white text-slate-600 border border-cream-border hover:bg-gray-100 cursor-pointer'
                                }`}
                                >
                                    All
                            </button>
                            {DAYS.map((day) => (
                                <button
                                    key={day}
                                    onClick={() => onDayChange(day)}
                                    className={`px-3 py-1 text-xs font-bold rounded transition ${
                                    selectedDay === day ? 'bg-up-maroon text-white shadow-md' : 'bg-white text-slate-600 border border-cream-border hover:bg-gray-100 cursor-pointer'
                                }`}
                                >
                                    {day}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Subjects filter */}
                    <div className="relative shadow-sm rounded-lg">
                        <select 
                            value={selectedSubject} 
                            onChange={(e) => onSubjectChange(e.target.value)}
                            className="pr-3 py-1.5 text-xs font-medium text-text-brown border border-cream-border rounded-lg bg-white outline-none focus:ring-1 focus:border-text-brown-light focus:ring-text-brown-light/30 h-[36px] transition-shadow truncate w-45 cursor-pointer">
                                <option value="" className="">All Subjects</option>
                                {subjects.map((s) => (
                                    <option key={s.id} value={s.id}>{s.code}</option>
                                ))}
                        </select>
                    </div>
                </div>
            </div>
        </div>
    );
}