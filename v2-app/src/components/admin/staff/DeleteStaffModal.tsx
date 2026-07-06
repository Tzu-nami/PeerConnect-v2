'use client'

import { useState } from "react"
import CrudModal from "@/components/ui/CrudModal"
import { createClient } from "@/utils/supabase/client"
import { StaffProfile } from "@/types/staff"
import { MdWarning } from "react-icons/md"

interface DeleteStaffModalProps {
    isOpen: boolean
    onClose: () => void
    onSuccess: () => void
    staff: StaffProfile | null
}

export default function DeleteStaffModal({ isOpen, onClose, onSuccess, staff }: DeleteStaffModalProps) {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // Handles closing the form
    function handleClose() {
        setError(null)
        onClose()
    }

    // Handles deleting the form
    async function handleDelete() {
        if (!staff) return
        setLoading(true)
        setError(null)

        const supabase = createClient()
        const { error: deleteError } = await supabase.from('staff_profiles').delete().eq('id', staff.id)

        setLoading(false)

        if (deleteError) {
            setError(deleteError.message)
            return
        }

        handleClose()
        onSuccess()
    }

    if (!staff) return null

    const mi = staff.middleInitial
    const fullName = `${staff.lastName}, ${staff.firstName}${mi ? ` ${mi}.` : ''}`

    return (
        <CrudModal
            open={isOpen}
            title="Delete Staff Member"
            subtitle="This action cannot be undone."
            onClose={handleClose}
            maxWidth="max-w-xl"
            footer={
                <div className="flex gap-3">
                    <button onClick={handleClose} disabled={loading}
                            className="flex-1 px-4 py-2 text-sm font-semibold text-slate-600 bg-white border border-white-border rounded-lg hover:bg-white-dark cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition">
                        Cancel
                    </button>
                    <button onClick={handleDelete} disabled={loading}
                            className="flex-1 px-4 py-2 text-sm font-semibold text-white bg-red-700 hover:bg-red-800 rounded-lg shadow-md disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition">
                        {loading ? 'Deleting...' : 'Delete Staff'}
                    </button>
                </div>
            }
        >
            <div className="flex flex-col items-center gap-4 text-center py-4">
                <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center">
                    <MdWarning className="text-3xl text-red-700" />
                </div>
                <div>
                    <p className="text-base font-semibold text-slate-700">Are you sure you want to delete</p>
                    <p className="text-lg font-extrabold text-up-maroon mt-1">{fullName}?</p>
                </div>
                <p className="text-sm text-slate-400">This will permanently remove their profile and cannot be recovered.</p>
                {error && (
                    <div className="w-full text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2">{error}</div>
                )}
            </div>
        </CrudModal>
    )
}