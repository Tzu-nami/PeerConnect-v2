import type { Mentor } from "@/types/mentor";

interface Props {
    mentor: Mentor;
    onClick: () => void;
}

export default function MentorCard({ mentor, onClick }: Props) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 justify-items-center animate-fade-up [animation-delay:250ms]">
            <div className="mentor-card group flex flex-col w-full" onClick={onClick}>
                {/* Header */}
                <div className="p-3 flex gap-3 border-b border-gray-100 bg-white overflow-hidden">
                    <div className="w-20 h-20 flex-shrink-0 rounded-2xl overflow-hidden bg-gray-100 border border-gray-200 shadow-inner">
                        <img src={mentor.avatar} alt={mentor.lastName} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 flex flex-col justify-center min-w-0 overflow-hidden">
                        <p className="font-black text-slate-800 text-lg leading-none uppercase tracking-tighter truncate w-full"
                            title={mentor.lastName}>
                                {mentor.lastName}
                        </p>
                        <p className="font-bold text-slate-600 text-sm leading-tight mt-1 truncate w-full"
                            title={`${mentor.firstName}${mentor.middleInitial ? ` ${mentor.middleInitial}` : ''}`}>
                                {mentor.firstName}{mentor.middleInitial ? ` ${mentor.middleInitial}` : ''}
                        </p>
                        <p className="font-bold text-slate-400 text-xs leading-tight mt-1 truncate w-full"
                            title={mentor.email}>
                                {mentor.email}
                        </p>
                        {mentor.yearLevel && mentor.degreeProgram && (
                            <p className="text-gray-400 text-[10px] mt-2 leading-tight line-clamp-2 break-words">
                                {mentor.yearLevel}<br />{mentor.degreeProgram}
                            </p>
                        )}
                    </div>
                </div>

                {/* Subjects */}
                <div className="px-4 pt-3 pb-2 flex-1">
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                        Subjects
                    </p>
                    <div className="flex gap-1 flex-wrap">
                        {mentor.subjects.slice(0,3).map((s) => (
                            <span key={s.id} 
                                className="bg-red-50 text-red-700 border border-red-100 px-2 py-0.5 rounded text-[10px] font-bold whitespace-nowrap"
                                >
                                    {s.code}
                            </span>
                        ))}
                        {mentor.subjects.length > 3 && (
                            <span 
                                className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[10px] font-bold border border-slate-200 whitespace-nowrap"
                                title={mentor.subjects.slice(3).map((s) => s.code).join('\n')}>
                                    +{mentor.subjects.length - 3}
                            </span>
                        )}
                    </div>
                </div>

                {/* Availabilities */}
                <div className="px-4 pb-4 pt-2 mt-auto flex justify-between items-end border-t border-gray-50 bg-white group-hover:bg-gray-50/50 transition-colors">
                    <div className="flex-1 pr-2 min-w-0">
                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Available Days</p>
                        <div className="flex flex-wrap gap-1.5">
                            {mentor.days.length === 0 ? (
                                <span className="text-[10px] text-gray-400 italic">None</span>
                            ) : (
                                mentor.days.map((day) => (
                                    <span
                                        key={day}
                                        title={day}
                                        className="day-pill">
                                            {day === 'Thu' ? 'Th' : day.charAt(0)}
                                    </span>
                                ))
                            )}
                        </div>
                    </div>
                    <span className="text-[11px] font-bold text-slate-400 group-hover:text-sidebar-green transition-colors flex items-center gap-1 tracking-widest whitespace-nowrap">
                        View
                        <i className="fa-solid fa-chevron-right text-[9px] transition-transform group-hover:translate-x-1"></i>
                    </span>
                </div>
            </div>
        </div>
    );
}