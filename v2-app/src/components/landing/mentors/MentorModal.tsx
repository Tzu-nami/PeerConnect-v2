import type { Mentor } from "@/types/mentor";
import MentorAvailGrid from "./MentorAvailGrid";
import ModalBase from "@/components/ui/ModalBase";
import Link from "next/link";

interface Props {
    mentor: Mentor | null;
    onClose: () => void;
    isAuthenticated: boolean;
}

export default function MentorModal({ mentor, onClose, isAuthenticated }: Props) {
    if (!mentor) return null;

    const fullName = `${mentor.lastName}, ${mentor.firstName} ${mentor.middleInitial || ''}`.trim();

    return (
        <ModalBase isOpen={!!mentor} onClose={onClose}>

            {/* Header */}
            <div className="flex-shrink-0 flex items-start gap-5 p-6 bg-sidebar-green">
                <div className="w-36 h-36 rounded-2xl overflow-hidden flex-shrink-0 border-2 border-white/20 shadow-lg bg-gray-200">
                    <img src={mentor.avatar} alt={mentor.lastName} className="w-full h-full object-cover bg-white" />
                </div>
                <div className="flex-1 min-w-0 pt-1">
                    <p className="text-white font-black text-2xl leading-tight tracking-tight truncate" title={fullName}>
                        {fullName}
                    </p>
                    {mentor.yearLevel && mentor.degreeProgram && (
                        <p className="text-white/60 text-xs mt-1">
                        {mentor.yearLevel} — {mentor.degreeProgram}
                        </p>
                    )}
                    {mentor.college && (
                        <p className="text-white/60 text-xs mt-1">{mentor.college}</p>
                    )}
                    <p className="text-white/60 text-xs mt-1">{mentor.email}</p>
                </div>
                <button onClick={onClose} className="text-white/50 hover:text-white transition flex-shrink-0 mt-1">
                    <i className="fa-solid fa-xmark text-xl"></i>
                </button>
            </div>

            <div className="overflow-y-auto flex-1 p-6 space-y-6 bg-white">
                
                {/* Subjects */}
                <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">
                        Teachable Subjects
                    </p>
                    {mentor.subjects.length === 0 ? (
                        <p className="text-xs text-gray-400">No subjects listed.</p>
                    ) : (
                        <div className="flex flex-wrap gap-2">
                            {mentor.subjects.map((s) => (
                                <span key={s.id} className="bg-red-50 text-red-700 border border-red-100 text-xs px-3 py-1 rounded font-bold">
                                    {s.code}
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                {/* Availability */}
                <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        Weekly Availability
                    </p>
                    <MentorAvailGrid schedule={mentor.schedule} />
                </div>
            </div>

            {/* Footer */}
            <div className="flex-shrink-0 px-6 py-4 bg-white border-t border-gray-100">
                {isAuthenticated ? (
                    <Link
                        href={mentor.bookingUrl || '/bookings'}
                        className="block w-full text-center bg-sidebar-green hover:bg-book-hover text-white text-sm font-bold py-3 rounded-xl transition shadow-sm"
                    >
                        <i className="fa-solid fa-calendar-check mr-2"></i>
                            Book a Session
                    </Link>
                ) : (
                    <Link
                        href="/login" 
                        className="block w-full text-center bg-sidebar-green hover:bg-book-hover text-white text-sm font-bold py-3 rounded-xl transition shadow-sm"
                    >
                        <i className="fa-solid fa-right-to-bracket mr-2"></i>
                            Log in to Book a Session
                    </Link>
                )}
            </div>
        </ModalBase>
    );
}