import CrudModal from "@/components/ui/CrudModal"
import { ROLE_LABELS } from "@/constants/roleLabels"
import { MdImage } from "react-icons/md"
import { StaffProfile } from "@/types/staff"

interface ViewStaffModalProps {
    isOpen: boolean
    onClose: () => void
    staff: StaffProfile | null
}

const valueClass = "w-full px-3 py-2 text-sm rounded-lg border border-cream-border bg-cream-dark text-slate-700"

export default function ViewStaffModal({ isOpen, onClose, staff }: ViewStaffModalProps) {
    if (!staff) return null

    return (
        <CrudModal
            open={isOpen}
            title="Staff Profile"
            subtitle="Viewing staff information."
            onClose={onClose}
            maxWidth="max-w-4xl"
            footer={
                <button onClick={onClose}
                        className="w-full px-4 py-2 text-sm font-semibold text-slate-600 bg-white border border-cream-border rounded-lg hover:bg-cream-dark cursor-pointer transition">
                    Close
                </button>
            }
        >
            <div className="grid grid-cols-2 gap-6">
                <div className="flex flex-col gap-4">
                    <p className="text-xs font-bold text-text-brown-light uppercase tracking-wider flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-up-maroon text-white text-xs flex items-center justify-center">1</span>
                        Staff Information
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                        <Field label="First Name"><p className={valueClass}>{staff.firstName}</p></Field>
                        <Field label="Last Name"><p className={valueClass}>{staff.lastName}</p></Field>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <Field label="M.I."><p className={valueClass}>{staff.middleInitial || '—'}</p></Field>
                        <Field label="Email"><p className={valueClass}>{staff.email}</p></Field>
                    </div>
                    <Field label="Role / Position"><p className={valueClass}>{ROLE_LABELS[staff.role]}</p></Field>
                </div>
                <div className="flex flex-col gap-4">
                    <p className="text-xs font-bold text-text-brown-light uppercase tracking-wider flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-up-maroon text-white text-xs flex items-center justify-center">2</span>
                        Profile Picture
                    </p>
                    <div className="w-full aspect-square rounded-xl border-2 border-dashed border-cream-border bg-cream-dark flex items-center justify-center overflow-hidden">
                        {staff.avatar ? <img src={staff.avatar} alt="Preview" className="w-full h-full object-cover" /> : <MdImage className="text-4xl text-slate-300" />}
                    </div>
                </div>
            </div>
        </CrudModal>
    )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-text-brown-light uppercase tracking-wider">{label}</label>
            {children}
        </div>
    )
}