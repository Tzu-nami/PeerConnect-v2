// Components
import ModalBase from "@/components/ui/ModalBase"

// Constants
import { ROLE_LABELS } from "@/constants/roleLabels"

// Icons
import { MdImage } from "react-icons/md"

// Types
import { StaffProfile } from "@/types/staff"

// Props
interface ViewStaffModalProps {
    isOpen: boolean
    onClose: () => void
    staff: StaffProfile | null
}

export default function ViewStaffModal({ isOpen, onClose, staff }: ViewStaffModalProps) {
    if(!staff) return null

    return (
        <ModalBase isOpen={isOpen} onClose={onClose}>
            {/* Modal title */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-cream-border">
                <div>
                    <h2 className="text-lg font-extrabold text-up-maroon">Staff Profile</h2>
                    <p className="text-sm text-slate-500 mt-0.5">Viewing staff information.</p>
                </div>
                <button onClick={onClose} className="text-slate-400 hover:text-red-700 text-xl font-bold transition cursor-pointer">✕</button>
            </div>

            {/* Body */}
            <div className="px-6 py-5 grid grid-cols-2 gap-6">
                {/* Left - staff information */}
                <div className="flex flex-col gap-4">
                    <p className="text-xs font-bold text-text-brown-light uppercase tracking-wider flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-up-maroon text-white text-xs flex items-center justify-center">1</span>
                        Staff Information
                    </p>

                    <div className="grid grid-cols-2 gap-3">
                        <Field label="First Name">
                            <p className={valueClass}>{staff.firstName}</p>
                        </Field>
                        <Field label="Last Name">
                            <p className={valueClass}>{staff.lastName}</p>
                        </Field>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <Field label="M.I.">
                            <p className={valueClass}>{staff.middleInitial || '—'}</p>
                        </Field>
                        <Field label="Email">
                            <p className={valueClass}>{staff.email}</p>
                        </Field>
                    </div>

                    <Field label="Role / Position">
                        <p className={valueClass}>{ROLE_LABELS[staff.role]}</p>
                    </Field>
                </div>

                {/* Right — avatar */}
                <div className="flex flex-col gap-4">
                    <p className="text-xs font-bold text-text-brown-light uppercase tracking-wider flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-up-maroon text-white text-xs flex items-center justify-center">2</span>
                        Profile Picture
                    </p>

                    <div className="w-full aspect-square rounded-xl border-2 border-dashed border-cream-border bg-cream-dark flex items-center justify-center overflow-hidden">
                        {staff.avatar
                            ? <img src={staff.avatar} alt="Preview" className="w-full h-full object-cover" />
                            : <MdImage className="text-4xl text-slate-300" />
                        }
                    </div>
                </div>
            </div>

            {/* User action */}
            <div className="flex gap-3 px-6 py-4 border-t border-cream-border">
                <button onClick={onClose} className="flex-1 px-4 py-2 text-sm font-semibold text-slate-600 bg-white border border-cream-border rounded-lg hover:bg-cream-dark cursor-pointer">
                    Close
                </button>
            </div>
        </ModalBase>
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

const valueClass = "w-full px-3 py-2 text-sm rounded-lg border border-cream-border bg-cream-dark text-slate-700"