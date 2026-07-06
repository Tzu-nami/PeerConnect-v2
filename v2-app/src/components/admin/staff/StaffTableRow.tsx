// Constants
import { ROLE_LABELS } from "@/constants/roleLabels"

// Icons
import { MdEdit } from "react-icons/md"
import { MdDelete } from "react-icons/md"

// Types
import { StaffProfile } from "@/types/staff"

// Props
interface StaffTableRowProps {
    staff: StaffProfile
    onView: (staff: StaffProfile) => void
    onEdit: (staff: StaffProfile) => void
    onDelete: (staff: StaffProfile) => void
}

export default function StaffTableRow({ staff, onView, onEdit, onDelete }: StaffTableRowProps) {
    const role = ROLE_LABELS[staff.role]
    const mi = staff.middleInitial
    const fullName = `${staff.lastName}, ${staff.firstName} ${mi ? `${mi}.` : ''}`

    return(
        <tr onClick={() => onView(staff)} className="border-t border-white-border hover:bg-white-hover transition cursor-pointer group">
            <td className="px-5 py-6 text-sm font-bold text-text-primary">{fullName}</td>
            <td className="px-5 py-6 text-sm text-text-muted">{role}</td>
            <td className="px-5 py-6 text-sm text-text-muted">{staff.email}</td>
            <td className="px-5 py-4 text-sm text-center relative">
                {/* Idle dot */}
                <span className="w-2 h-2 rounded-full bg-text-muted inline-block group-hover:opacity-0 transition-all duration-150 ease-in-out" />

                {/* Action buttons */}
                <div className="absolute inset-0 flex items-center justify-center gap-2 text-lg opacity-0 group-hover:opacity-100 transition-all duration-200 ease-in-out">
                    <button title="Edit Profile" onClick={(e) => {e.stopPropagation(); onEdit(staff)}}
                            className="p-1.5 rounded-lg text-blue-600 hover:text-blue-700 bg-blue-100 hover:bg-blue-200 hover:scale-110 transition cursor-pointer">
                        <MdEdit />
                    </button>
                    <button title="Delete" onClick={(e) => {e.stopPropagation(); onDelete(staff)}}
                            className="p-1.5 rounded-lg text-red-600 hover:text-red-700 bg-red-100 hover:bg-red-200 hover:scale-110 transition cursor-pointer">
                        <MdDelete />
                    </button>
                </div>
            </td>
        </tr>
    )

}