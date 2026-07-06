import { useState } from "react"

// Components
import CrudModal from "@/components/ui/CrudModal"

// Constants
import { ROLE_LABELS } from "@/constants/roleLabels"

// Icons
import { MdImage } from "react-icons/md"

// Utilities
import { createClient } from "@/utils/supabase/client"

// Props
interface AddStaffModalProps {
    isOpen: boolean
    onClose: () => void
    onSuccess: () => void
}

const INITIAL_FORM = {
    firstName: '',
    lastName: '',
    middleInitial: '',
    email: '',
    role: '',
}

const inputClass = "w-full px-3 py-2 text-sm rounded-lg border border-white-border bg-white text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-up-maroon/30 focus:border-up-maroon transition"

export default function AddStaffModal({ isOpen, onClose, onSuccess }: AddStaffModalProps) {
    const [form, setForm] = useState(INITIAL_FORM)
    const [avatarFile, setAvatarFile] = useState<File | null>(null)
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [confirmOpen, setConfirmOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    // Form status check
    const hasInput = Boolean(form.firstName || form.lastName || form.email || form.role || form.middleInitial || avatarFile)
    const isFormComplete = Boolean(form.firstName.trim() && form.lastName.trim() && form.email.trim() && form.role)

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

    // Handles form reset
    function handleReset() {
        setForm(INITIAL_FORM)
        setAvatarFile(null)
        setAvatarPreview(null)
        setErrors({})
    }

    // Handles closing the form
    function handleClose() {
        handleReset()
        onClose()
    }

    // Handles validating form inputs
    async function handleValidate() {
        const errs: Record<string, string> = {}
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            if (!emailRegex.test(form.email)) errs.email = 'Please enter a valid email address.'
        if (!form.role) errs.role = 'Role is required.'
        setErrors(errs)
        if (Object.keys(errs).length === 0) await handleSubmit()
    }

    // Handles form submission
    async function handleSubmit() {
        setLoading(true)

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

            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(fileName, avatarFile)

            if (uploadError) {
                setErrors({ general: uploadError.message })
                setLoading(false)
                return
            }

            const { data: urlData } = supabase.storage
                .from('avatars')
                .getPublicUrl(fileName)

            avatarUrl = urlData.publicUrl
        }

        const cleanedForm = {
            ...form,
            middleInitial: form.middleInitial.replace('.', '').toUpperCase()
        }

        const { error: insertError } = await supabase
            .from('staff_profiles')
            .insert([{
                ...cleanedForm,
                avatar: avatarUrl,
                created_at: new Date().toISOString(),
            }])

        setLoading(false)

        if (insertError) {
            setErrors({ general: insertError.message })
            setConfirmOpen(false)
            return
        }

        setConfirmOpen(false)
        handleClose()
        onSuccess()
    }

    return (
        <>
            <CrudModal
                open={isOpen && !confirmOpen}
                title="Add Staff Member"
                subtitle="Fill in their information and profile picture."
                onClose={handleClose}
                maxWidth="max-w-4xl"
                footer={
                    <div className="flex gap-3">
                        {hasInput ? (
                            <button
                                onClick={handleReset}
                                disabled={loading}
                                className="flex-1 px-4 py-2 text-sm font-semibold text-slate-600 bg-white border border-white-border rounded-lg hover:bg-white-dark cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition">
                                Reset Form
                            </button>
                        ) : (
                            <button
                                onClick={handleClose}
                                disabled={loading}
                                className="flex-1 px-4 py-2 text-sm font-semibold text-slate-600 bg-white border border-white-border rounded-lg hover:bg-white-dark cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition">
                                Cancel
                            </button>
                        )}
                        <button
                            onClick={handleValidate}
                            disabled={loading || !isFormComplete}
                            className="flex-1 px-4 py-2 text-sm font-semibold text-white bg-btn-gray hover:bg-btn-gray-hover rounded-lg shadow-md disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition">
                            {loading ? 'Adding...' : 'Add Staff Member'}
                        </button>
                    </div>
                }
            >
                <div className="grid grid-cols-2 gap-6">
                    {/* Left - staff information */}
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
                            <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2">
                                {errors.general}
                            </div>
                        )}
                    </div>

                    {/* Right - profile picture */}
                    <div className="flex flex-col gap-4">
                        <p className="text-xs font-bold text-text-muted uppercase tracking-wider flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full bg-up-maroon text-white text-xs flex items-center justify-center">2</span>
                            Profile Picture
                        </p>

                        <div className="w-full aspect-square rounded-xl border-2 border-dashed border-white-border bg-white-dark flex items-center justify-center overflow-hidden">
                            {avatarPreview
                                ? <img src={avatarPreview} alt="preview" className="w-full h-full object-cover" />
                                : <MdImage className="text-4xl text-slate-300" />
                            }
                        </div>

                        <label className="flex items-center justify-center px-4 py-2 text-sm font-semibold text-white bg-btn-gray hover:bg-btn-gray-hover rounded-lg shadow-md cursor-pointer">
                            Choose File
                            <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
                        </label>
                    </div>
                </div>
            </CrudModal>
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