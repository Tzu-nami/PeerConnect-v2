import CrudModal from "@/components/ui/CrudModal";
import { FaUserSlash } from "react-icons/fa6";
import type { AdminCourse } from "@/types/admin";

interface ViewCourseModalProps {
    isOpen: boolean;
    onClose: () => void;
    subject: AdminCourse | null;
}

const valueClass = "w-full px-3 py-2 text-sm rounded-lg border border-cream-border bg-cream-dark text-slate-700"

export default function ViewCourseModal({ isOpen, onClose, subject }: ViewCourseModalProps) {
    if (!subject) return null;

    return (
        <div>
            <CrudModal
                open={isOpen} onClose={onClose} maxWidth="max-w-md"
                title={subject.code}
                subtitle={subject.name}
            >
                <div className="space-y-3">
                    <p className="text-xs font-bold text-text-brown-light uppercase tracking-wider flex items-center gap-2">
                        Registered Peer Mentors
                    </p>

                    {/* Mentors teaching */}
                    {subject.mentors.length > 0 ? (
                        subject.mentors.map((mentor, i) => (
                            <div key={i} className={`${valueClass} flex items-center gap-4`}>
                                {mentor.avatar ? (
                                    <img src={mentor.avatar} alt={mentor.name} className="w-12 h-12 rounded-full object-cover shadow-sm bg-gray-100 border border-gray-200" />
                                ) : (
                                    <div className="w-12 h-12 rounded-full bg-up-maroon text-white flex items-center justify-center text-xs font-bold shadow-sm">{mentor.name.charAt(0)}</div>
                                )}
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold text-text-brown tracking-wider truncate">{mentor.name}</p>
                                    <p className="text-xs text-text-brown-light tracking-wider truncate">{mentor.email} — {mentor.yearLevel} {mentor.degreeProgram}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-8">
                            <div className="w-12 h-12 text-text-brown-light flex items-center justify-center mx-auto mb-3">
                                <FaUserSlash className="text-4xl" />
                            </div>
                            <p className="text-sm font-medium text-text-brown-light">No mentors registered.</p>
                        </div>
                    )}
                </div>
            </CrudModal>
        </div>
    )
}