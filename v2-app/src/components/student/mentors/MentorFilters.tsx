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

export default function MentorFilters({
    subjects, searchQuery, selectedDay, selectedSubject, resultCount, onSearch, onDayChange, onSubjectChange, 
}: Props) {
    return (
        <div className="mb-3 pb-4 border-b border-gray-200 flex flex-wrap items-center justify-between gap-4 animate-[slideDown_0.3s_ease]">
            <div className="flex flex-wrap items-center gap-3">

                {/* Search bar */}
                <SearchBar
                    value={searchQuery}
                    onChange={onSearch}
                    placeholder="Search name..."
                />

                {/* Day filters */}
                <div className="flex items-center gap-2 bg-gray-50 p-1 rounded-lg border border-gray-200 shadow-sm">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 pl-2 pr-1">Day</span>
                    <div className="flex gap-1">
                        <button
                            onClick={() => onDayChange('')}
                            className={`px-3 py-1.5 text-xs font-bold rounded transition ${
                                selectedDay === '' ? 'bg-up-maroon text-white shadow-md' : 'bg-white text-slate-600 border border-gray-200 hover:bg-gray-100'
                            }`}
                            >
                                All
                        </button>
                        {DAYS.map((day) => (
                            <button
                                key={day}
                                onClick={() => onDayChange(day)}
                                className={`px-3 py-1.5 text-xs font-bold rounded transition ${
                                selectedDay === day ? 'bg-up-maroon text-white shadow-md' : 'bg-white text-slate-600 border border-gray-200 hover:bg-gray-100'
                            }`}
                            >
                                {day}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Subjects filter */}
                <div className="relative shadow-sm">
                    <i className="fa-solid fa-filter absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs"></i>
                    <select 
                        value={selectedSubject} 
                        onChange={(e) => onSubjectChange(e.target.value)}
                        className="appearance-none border border-gray-200 rounded-lg pl-8 pr-8 py-1.5 text-xs font-medium text-slate-700 outline-none cursor-pointer focus:ring-1 focus:border-up-maroon focus:ring-up-maroon bg-white h-[34px]">
                            <option value="">All Subjects</option>
                            {subjects.map((s) => (
                                <option key={s.id} value={s.id}>{s.code}</option>
                            ))}
                    </select>
                </div>
            </div>

            {/* Filtered results */}
            <span className="text-sm font-medium text-slate-500">Showing {resultCount} mentor{resultCount !== 1 ? 's' : ''}    
            </span>
        </div>
    );
}