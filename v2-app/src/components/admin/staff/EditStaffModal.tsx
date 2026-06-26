import {useEffect, useState} from "react";

// Constants
import {ROLE_LABELS} from "@/constants/roleLabels";

// Components
import ModalBase from "@/components/ui/ModalBase";

// Types
import {StaffProfile} from "@/types/staff";
import {createClient} from "@/utils/supabase/client";
import {MdImage} from "react-icons/md";


// Props
interface EditStaffModalProps {
    isOpen: boolean
    onClose: () => void
    onSuccess: () => void
    staff: StaffProfile | null
}

// Default state of the form (empty)
const INITIAL_FORM = {
    firstName: '',
    lastName: '',
    middleInitial: '',
    email: '',
    role: '',
}

export default function EditStaffModal({ isOpen, onClose, staff, onSuccess }: EditStaffModalProps) {
    const [form, setForm] = useState(INITIAL_FORM)
    const [avatarFile, setAvatarFile] = useState<File | null>(null)
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // Pre-fill form with current staff information
    useEffect(() => {
        if (staff) {
            setForm({
                firstName: staff.firstName,
                lastName: staff.lastName,
                middleInitial: staff.middleInitial || '',
                email: staff.email,
                role: staff.role,
            })
            setAvatarPreview(staff.avatar || null)
        }
    }, [staff])

    // Handler for all input changes
    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }

    // Handler for avatar uploads
    function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0]
        if (!file) return
        setAvatarFile(file)
        setAvatarPreview(URL.createObjectURL(file))
    }

    // Resets the modal to its default state
    function handleClose() {
        setAvatarFile(null)
        setAvatarPreview(null)
        setError(null)
        onClose()
    }

    // Handler for submitting the form
    async function handleSubmit() {
        // Checks if all text fields have input
        if (!form.firstName || !form.lastName || !form.email || !form.role) {
            setError('Please fill in all required fields.')
            return
        }

        // Checks email input format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(form.email)) {
            setError('Please enter a valid email address.')
            return
        }

        setLoading(true)
        setError(null)

        const supabase = createClient()
        let avatarUrl: string | null = null

        // Run when the user uploads an image
        if (avatarFile) {
            const { data: { user }, error: userError } = await supabase.auth.getUser()
            if (userError || !user) {
                setError('Could not get current user. Please log in again.')
                setLoading(false)
                return
            }

            // File path of avatar image
            const fileName = `staffs/${user.id}/${Date.now()}-${avatarFile.name}`

            // Upload actual file to the 'avatars' bucket
            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(fileName, avatarFile)

            // Sets error message during avatar upload
            if (uploadError) {
                setError(uploadError.message)
                setLoading(false)
                return
            }

            // Constructs the public URL for the image
            const { data: urlData } = supabase.storage
                .from('avatars')
                .getPublicUrl(fileName)

            avatarUrl = urlData.publicUrl
        }

        const cleanedForm = {
            ...form,
            middleInitial: form.middleInitial.replace('.', '').toUpperCase()
        }

        // Update the row instead of insert
        const { error: updateError } = await supabase
            .from('staff_profiles')
            .update({
                ...cleanedForm,
                ...(avatarUrl && { avatar: avatarUrl }),
                updated_at: new Date().toISOString(),
            })
            .eq('id', staff!.id)

        setLoading(false)

        if (updateError) {
            setError(updateError.message)
            return
        }

        handleClose()
        onSuccess()
    }

    if(!staff) return null

    return(
        <ModalBase isOpen={isOpen} onClose={handleClose}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-cream-border">
                {/* Modal title */}
                <div>
                    <h2 className="text-lg font-extrabold text-up-maroon">Edit Staff Member</h2>
                    <p className="text-sm text-slate-500 mt-0.5">Update their information and profile picture.</p>
                </div>

                {/* Exit modal */}
                <button onClick={handleClose} className="text-slate-400 hover:text-red-700 text-xl font-bold transition cursor-pointer">✕</button>
            </div>

            {/* Body */}
            <div className="px-6 py-5 grid grid-cols-2 gap-6 overflow-y-auto">
                <div className="flex flex-col gap-4">
                    {/* Left - staff information input */}
                    <p className="text-xs font-bold text-text-brown-light uppercase tracking-wider flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-up-maroon text-white text-xs flex items-center justify-center">1</span>
                        Staff Information
                    </p>

                    <div className="grid grid-cols-2 gap-3">
                        <Field label="First Name">
                            <input name="firstName" value={form.firstName} onChange={handleChange} className={inputClass} />
                        </Field>
                        <Field label="Last Name">
                            <input name="lastName" value={form.lastName} onChange={handleChange} className={inputClass} />
                        </Field>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <Field label="M.I.">
                            <input name="middleInitial" value={form.middleInitial} onChange={handleChange} maxLength={2} className={inputClass} />
                        </Field>
                        <Field label="Email">
                            <input name="email" type="email" value={form.email} onChange={handleChange} className={inputClass} />
                        </Field>
                    </div>

                    <Field label="Role / Position">
                        <select name="role" value={form.role} onChange={handleChange} className={inputClass}>
                            <option value="" disabled hidden>Select role</option>
                            {Object.entries(ROLE_LABELS).map(([value, label]) => (
                                <option key={value} value={value}>{label as string}</option>
                            ))}
                        </select>
                    </Field>
                </div>

                {/* Right - Profile picture upload */}
                <div className="flex flex-col gap-4">
                    <p className="text-xs font-bold text-text-brown-light uppercase tracking-wider flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-up-maroon text-white text-xs flex items-center justify-center">2</span>
                        Profile Picture
                    </p>

                    <div className="w-full aspect-square rounded-xl border-2 border-dashed border-cream-border bg-cream-dark flex items-center justify-center overflow-hidden">
                        {avatarPreview
                            ? <img src={avatarPreview} alt="preview" className="w-full h-full object-cover" />
                            : <MdImage className="text-4xl text-slate-300" />
                        }
                    </div>

                    <label className="flex items-center justify-center px-4 py-2 text-sm font-semibold text-cream bg-btn-brown hover:bg-btn-brown-hover rounded-lg shadow-md cursor-pointer">
                        Choose File
                        <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
                    </label>
                </div>
            </div>

            {/* Error display */}
            {error && (
                <div className="mx-6 mb-5 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2">
                    {error}
                </div>
            )}

            {/* User action */}
            <div className="flex gap-3 px-6 py-4 border-t border-cream-border">
                <button onClick={handleClose} className="flex-1 px-4 py-2 text-sm font-semibold text-slate-600 bg-white border border-cream-border rounded-lg hover:bg-cream-dark cursor-pointer">
                    Cancel
                </button>
                <button onClick={handleSubmit} disabled={loading} className="flex-1 px-4 py-2 text-sm font-semibold text-cream bg-btn-brown hover:bg-btn-brown-hover rounded-lg shadow-md disabled:opacity-50 cursor-pointer">
                    {loading ? 'Updating...' : 'Update Staff Member'}
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

const inputClass = "w-full px-3 py-2 text-sm rounded-lg border border-cream-border bg-white text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-up-maroon/30 focus:border-up-maroon transition"