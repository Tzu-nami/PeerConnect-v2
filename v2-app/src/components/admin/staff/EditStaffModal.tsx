import { useEffect, useState, useRef } from "react"

// Components
import CrudModal from "@/components/ui/CrudModal"
import ConfirmModal from "@/components/ui/ConfirmModal"

// Constants
import { ROLE_LABELS } from "@/constants/roleLabels"

// Icons
import { FaUserEdit } from "react-icons/fa"
import { MdImage } from "react-icons/md"

// Types
import { StaffProfile } from "@/types/staff"

// Utilities
import { createClient } from "@/utils/supabase/client"

interface EditStaffModalProps {
    isOpen: boolean
    onClose: () => void
    onSuccess: () => void
    staff: StaffProfile | null
}

const INITIAL_FORM = { firstName: '', lastName: '', middleInitial: '', email: '', role: '' }
const inputClass = "w-full px-3 py-2 text-sm rounded-lg border border-white-border bg-white text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-up-maroon/30 focus:border-up-maroon transition"

export default function EditStaffModal({ isOpen, onClose, staff, onSuccess }: EditStaffModalProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [form, setForm] = useState(INITIAL_FORM)
    const [avatarFile, setAvatarFile] = useState<File | null>(null)
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [loading, setLoading] = useState(false)
    const [confirmOpen, setConfirmOpen] = useState(false)

    // Set form values using the current data
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

    // Handles form changes
    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
        setErrors(prev => ({ ...prev, [e.target.name]: '' }))
    }

    // Handles avatar change
    function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0]
        if (!file) return
        setAvatarFile(file)
        setAvatarPreview(URL.createObjectURL(file))
    }

    // Handles closing the form
    function handleClose() {
        setAvatarFile(null)
        setErrors({})
        onClose()
    }

    // Handles validating form inputs
    async function handleValidate() {
        const errs: Record<string, string> = {}
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(form.email)) errs.email = 'Please enter a valid email address.'
        setErrors(errs)
        if (Object.keys(errs).length === 0) setConfirmOpen(true)
    }

    // Handles submitting the form
    async function handleSubmit() {
        setLoading(true)
        setErrors({})

        const supabase = createClient()
        let avatarUrl: string | null = null

        if (avatarFile) {
            const { data: { user }, error: userError } = await supabase.auth.getUser()
            if (userError || !user) {
                setErrors({ general: 'Could not get current user. Please log in again.' })
                setLoading(false)
                return
            }

            const fileName = `staffs/${user.id}/${Date.now()}-${avatarFile.name}`
            const { error: uploadError } = await supabase.storage.from('avatars').upload(fileName, avatarFile)

            if (uploadError) {
                setErrors({ general: uploadError.message })
                setLoading(false)
                return
            }

            const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(fileName)
            avatarUrl = urlData.publicUrl
        }

        const cleanedForm = { ...form, middleInitial: form.middleInitial.replace('.', '').toUpperCase() }

        const { error: updateError } = await supabase
            .from('staff_profiles')
            .update({ ...cleanedForm, ...(avatarUrl && { avatar: avatarUrl }), updated_at: new Date().toISOString() })
            .eq('id', staff!.id)

        setLoading(false)

        if (updateError) {
            setErrors({ general: updateError.message })
            return
        }

        handleClose()
        onSuccess()
    }

    if (!staff) return null

    // Form status check
    const isFormComplete = Boolean(form.firstName.trim() && form.lastName.trim() && form.email.trim() && form.role)
    const isUnchanged =
        form.firstName === staff.firstName &&
        form.lastName === staff.lastName &&
        form.middleInitial === (staff.middleInitial || '') &&
        form.email === staff.email &&
        form.role === staff.role &&
        !avatarFile

    return (
        <>
            <CrudModal
                open={isOpen && !confirmOpen}
                title="Edit Staff Member"
                subtitle="Update their information and profile picture."
                onClose={handleClose}
                maxWidth="max-w-4xl"
                footer={
                    <div className="flex gap-3">
                        <button onClick={handleClose} disabled={loading}
                                className="flex-1 px-4 py-2 text-sm font-semibold text-slate-600 bg-white border border-white-border rounded-lg hover:bg-white-dark cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition">
                            Cancel
                        </button>
                        <button onClick={handleValidate} disabled={loading || !isFormComplete || isUnchanged}
                                className="flex-1 px-4 py-2 text-sm font-semibold text-white bg-btn-gray hover:bg-btn-gray-hover rounded-lg shadow-md disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition">
                            {loading ? 'Updating...' : 'Update Staff Member'}
                        </button>
                    </div>
                }
            >
                <div className="grid grid-cols-2 gap-6">
                    <div className="flex flex-col gap-4">
                        <p className="text-xs font-bold text-text-muted uppercase tracking-wider flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full bg-up-maroon text-white text-xs flex items-center justify-center">1</span>
                            Staff Information
                        </p>

                        <div className="grid grid-cols-2 gap-3">
                            <Field label="First Name" required error={errors.firstName}>
                                <input name="firstName" value={form.firstName} onChange={handleChange} className={inputClass} />
                            </Field>
                            <Field label="Last Name" required error={errors.lastName}>
                                <input name="lastName" value={form.lastName} onChange={handleChange} className={inputClass} />
                            </Field>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <Field label="M.I.">
                                <input name="middleInitial" value={form.middleInitial} onChange={handleChange} maxLength={1} className={inputClass} />
                            </Field>
                            <Field label="Email" required error={errors.email}>
                                <input name="email" type="email" value={form.email} onChange={handleChange} className={inputClass} />
                            </Field>
                        </div>

                        <Field label="Role / Position" required error={errors.role}>
                            <select name="role" value={form.role} onChange={handleChange} className={inputClass}>
                                <option value="" disabled hidden>Select role</option>
                                {Object.entries(ROLE_LABELS).map(([value, label]) => (
                                    <option key={value} value={value}>{label as string}</option>
                                ))}
                            </select>
                        </Field>

                        {errors.general && (
                            <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2">{errors.general}</div>
                        )}
                    </div>

                    <div className="flex flex-col gap-4">
                        <p className="text-xs font-bold text-text-muted uppercase tracking-wider flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full bg-up-maroon text-white text-xs flex items-center justify-center">2</span>
                            Profile Picture
                        </p>

                        <div 
                            onClick={() => fileInputRef.current?.click()}
                            className="w-full aspect-square max-w-[375px] rounded-xl border-2 border-dashed border-white-border bg-white flex flex-col items-center justify-center cursor-pointer hover:bg-white-hover hover:border-white-complement transition overflow-hidden relative group bg-white shadow-sm">
                            {avatarPreview
                                ? (
                                <>
                                    <img src={avatarPreview} alt="preview" className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <MdImage className="text-2xl text-white mb-2" />
                                        <span className="text-white text-xs font-bold">Change Image</span>
                                    </div>
                                </>
                                ) : (
                                    <div className="text-center p-6">
                                        <div className="w-16 h-16 flex items-center justify-center mx-auto mb-3">
                                            <MdImage className="text-2xl" />
                                        </div>
                                        <p className="text-sm font-bold text-slate-700">Upload Image</p>
                                        <p className="text-[10px] text-gray-400 mt-1">PNG, JPG up to 5MB</p>
                                    </div>
                                )}
                        </div>
                        <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" ref={fileInputRef} />
                        {errors.avatar && <p className="mt-2 text-xs text-red-600">{errors.avatar}</p>}
                    </div>
                </div>
            </CrudModal>

            <ConfirmModal
                isOpen={confirmOpen}
                onCancel={() => setConfirmOpen(false)}
                title="Update this staff member?"
                message="This will save the changes made to their information and profile."
                icon={<FaUserEdit  className="text-blue-600 text-5xl" />}
                confirmLabel="Update"
                confirmClassName="bg-blue-600 hover:bg-blue-700"
                loading={loading}
                onConfirm={handleSubmit}
            />
        </>

    )
}

function Field({ label, required, error, children }: { label: string; required?: boolean; error?: string; children: React.ReactNode }) {
    return (
        <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-text-muted uppercase tracking-wider">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            {children}
            {error && <p className="text-xs text-red-600">{error}</p>}
        </div>
    )
}