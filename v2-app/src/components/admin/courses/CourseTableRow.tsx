import { MdEdit, MdDelete } from "react-icons/md";
import type { AdminCourse } from '@/types/admin';

interface CourseTableRowProps {
    subject: AdminCourse;
    onView: (s: AdminCourse) => void;
    onEdit: (s: AdminCourse) => void;
    onDelete: (s: AdminCourse) => void;
}

export default function CourseTableRow({ subject, onView, onEdit, onDelete }: CourseTableRowProps) {
    return (
        <tr onClick={() => onView(subject)} className="border-t border-cream-border hover:bg-cream-hover transition cursor-pointer group">
            {/* Info */}
            <td className="px-5 py-4 align-middle">
                <p className="font-bold text-text-brown text-sm truncate" title={subject.code}>
                    {subject.code}
                </p>
            </td>
            <td className="px-5 py-4 align-middle text-sm text-text-brown-light truncate" title={subject.name}>
                {subject.name}
            </td>
            <td className="px-5 py-4 align-middle text-sm text-text-brown-light truncate" title={subject.mentors.map(s => s.name).join('\n')}>
                {subject.mentorCount} {subject.mentorCount === 1 ? 'Mentor' : 'Mentors'}
            </td>
            <td className="px-5 py-4 align-middle text-sm text-center relative">
                <span className="w-2 h-2 rounded-full bg-text-brown-light inline-block group-hover:opacity-0 transition-all duration-150 ease-in-out" />
                <div className="absolute inset-0 flex items-center justify-center gap-2 text-lg opacity-0 group-hover:opacity-100 transition-all duration-200 ease-in-out">

                    <button title="Edit Subject" onClick={(e) => { e.stopPropagation(); onEdit(subject) }} 
                        className="p-1.5 rounded-lg text-blue-600 hover:text-blue-700 bg-blue-100 hover:bg-blue-200 hover:scale-110 transition cursor-pointer" >
                            <MdEdit />
                    </button>
                    <button title="Delete" onClick={(e) => { e.stopPropagation(); onDelete(subject) }}
                            className="p-1.5 rounded-lg text-red-600 hover:text-red-700 bg-red-100 hover:bg-red-200 hover:scale-110 transition cursor-pointer">
                        <MdDelete />
                    </button>
                </div>
            </td>
        </tr>
    );
}