'use client'

import { useState } from "react"

// Components
import ModalBase from "@/components/ui/ModalBase"

// Utilities
import { createClient } from "@/utils/supabase/client"

// Types
import { StaffProfile } from "@/types/staff"

// Icons
import { MdWarning } from "react-icons/md"

// Props
interface DeleteStaffModalProps {
    isOpen: boolean
    onClose: () => void
    onSuccess: () => void
    staff: StaffProfile | null
}

export default function DeleteStaffModal({ isOpen, onClose, onSuccess, staff }: DeleteStaffModalProps) {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // Handler for closing the modal
    function handleClose() {
        setError(null)
        onClose()
    }

    // Handler for deleting the row
    async function handleDelete() {
        if (!staff) return

        setLoading(true)
        setError(null)

        const supabase = createClient()

        const { error: deleteError } = await supabase
            .from('staff_profiles')
            .delete()
            .eq('id', staff.id)

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
        <ModalBase isOpen={isOpen} onClose={handleClose}>
            {/* Modal title */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-cream-border">
                <div>
                    <h2 className="text-lg font-extrabold text-up-maroon">Delete Staff Member</h2>
                    <p className="text-sm text-slate-500 mt-0.5">This action cannot be undone.</p>
                </div>

                {/* Edit modal */}
                <button onClick={handleClose} className="text-slate-400 hover:text-red-700 text-xl font-bold transition cursor-pointer">✕</button>
            </div>

            {/* Body */}
            <div className="px-6 py-8 flex flex-col items-center gap-4 text-center">
                <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center">
                    <MdWarning className="text-3xl text-red-700" />
                </div>
                <div>
                    <p className="text-base font-semibold text-slate-700">Are you sure you want to delete</p>
                    <p className="text-lg font-extrabold text-up-maroon mt-1">{fullName}?</p>
                </div>
                <p className="text-sm text-slate-400">This will permanently remove their profile and cannot be recovered.</p>
            </div>

            {/* Error display */}
            {error && (
                <div className="mx-6 mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2">
                    {error}
                </div>
            )}

            {/* User Action */}
            <div className="flex gap-3 px-6 py-4 border-t border-cream-border">
                <button onClick={handleClose} className="flex-1 px-4 py-2 text-sm font-semibold text-slate-600 bg-white border border-cream-border rounded-lg hover:bg-cream-dark cursor-pointer">
                    Cancel
                </button>
                <button onClick={handleDelete} disabled={loading} className="flex-1 px-4 py-2 text-sm font-semibold text-white bg-red-700 hover:bg-red-800 rounded-lg shadow-md disabled:opacity-50 cursor-pointer">
                    {loading ? 'Deleting...' : 'Delete Staff'}
                </button>
            </div>
        </ModalBase>
    )
}