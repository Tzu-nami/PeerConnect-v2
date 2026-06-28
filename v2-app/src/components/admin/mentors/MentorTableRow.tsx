import { MdEdit, MdDelete } from "react-icons/md";
import type { AdminMentor } from "@/types/admin";

interface MentorTableRowProps {
    mentor: AdminMentor;
    onView: (mentor: AdminMentor) => void;
    onEdit: (mentor: AdminMentor) => void;
    onDelete: (mentor: AdminMentor) => void;
}

export default function MentorTableRow({ mentor, onView, onEdit, onDelete }: MentorTableRowProps) {
    return (
        <tr onClick={() => onView(mentor)} className="border-t border-cream-border hover:bg-cream-hover transition cursor-pointer group">
            {/* Info */}
            <td className="px-5 py-4 align-middle">
                <p className="font-bold text-text-brown text-sm truncate">
                    {mentor.lastName.toUpperCase()}, {mentor.firstName} {mentor.middleInitial}
                </p>
                <p className="text-[10px] text-text-brown-light mt-0.5 truncate">
                    {mentor.yearLevel} — {mentor.degreeProgram}
                </p>
            </td>
            
            {/* Student Num */}
            <td className="px-5 py-4 align-middle text-sm text-text-brown-light">
                {mentor.student_num}
            </td>
            
            {/* Email */}
            <td className="px-5 py-4 align-middle text-sm text-text-brown-light truncate">
                {mentor.email}
            </td>
            
            {/* Subjects */}
            <td className="px-5 py-4 align-middle">
                <div className="flex items-center flex-wrap gap-1">
                    {mentor.subjects.slice(0, 3).map(s => (
                        <span key={s.id} className="bg-red-50 text-red-700 px-2 py-0.5 rounded text-[10px] font-bold border border-red-100 w-17 truncate text-center">
                            {s.code}
                        </span>
                    ))}
                    {mentor.subjects.length > 3 && (
                        <span className="bg-cream text-text-brown px-2 py-0.5 rounded text-[10px] font-bold border border-cream-border" title={mentor.subjects.slice(3).map(s => s.code).join(', ')}>
                            +{mentor.subjects.length - 3}
                        </span>
                    )}
                </div>
            </td>
            
            {/* Actions */}
            <td className="px-5 py-4 align-middle text-sm text-center relative">
                <span className="w-2 h-2 rounded-full bg-text-brown-light inline-block group-hover:opacity-0 transition-all duration-150 ease-in-out" />
                <div className="absolute inset-0 flex items-center justify-center gap-2 text-lg opacity-0 group-hover:opacity-100 transition-all duration-200 ease-in-out">
                    <button title="Edit Profile" onClick={(e) => { e.stopPropagation(); onEdit(mentor) }}
                            className="p-1.5 rounded-lg text-blue-600 hover:text-blue-700 bg-blue-100 hover:bg-blue-200 hover:scale-110 transition cursor-pointer">
                        <MdEdit />
                    </button>
                    <button title="Delete" onClick={(e) => { e.stopPropagation(); onDelete(mentor) }}
                            className="p-1.5 rounded-lg text-red-600 hover:text-red-700 bg-red-100 hover:bg-red-200 hover:scale-110 transition cursor-pointer">
                        <MdDelete />
                    </button>
                </div>
            </td>
        </tr>
    );
}