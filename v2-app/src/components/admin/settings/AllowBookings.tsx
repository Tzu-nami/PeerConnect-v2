import { useState } from "react"
import { toast } from "sonner"

// Icons
import { FaToggleOn, FaToggleOff } from "react-icons/fa6"

// Utilities
import { createClient } from "@/utils/supabase/client"

interface AllowBookingsProps {
    initialEnabled: boolean
    initialDisableMessage: string
    hasActiveSemester: boolean
}

export default function AllowBookings({ initialEnabled, initialDisableMessage, hasActiveSemester  }: AllowBookingsProps) {
    // States
    const [enabled, setEnabled] = useState(initialEnabled)
    const [disableMessage, setDisableMessage] = useState(initialDisableMessage ?? '')
    const [loading, setLoading] = useState(false)

    const supabase = createClient()
    const isUnchanged = enabled === initialEnabled &&
        (enabled || disableMessage === (initialDisableMessage ?? ''))

    async function handleSave() {
        setLoading(true)

        const { error: savingError } = await supabase
            .from('system_settings')
            .update({
                bookings_enabled: enabled,
                disabled_message: enabled ? null : disableMessage,
                updated_at: new Date().toISOString()
            }).eq('id', 1)

        setLoading(false)

        if (savingError) return toast.error('Failed to save settings')

        toast.success('Settings saved!')
        window.location.reload()
    }

    return(
        <div className="bg-white rounded-xl border border-white-border shadow-sm p-6 flex flex-col gap-5 max-w-xl mt-5">
            <p className="font-bold text-text-primary uppercase tracking-wider">Booking system</p>

            <div className="flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-2">
                        <p className="font-semibold">Allow Bookings</p>
                        {!hasActiveSemester && (
                            <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                                Locked
                            </span>
                        )}
                    </div>
                    <p className="text-sm text-text-muted">
                        {hasActiveSemester
                            ? 'Enable or disable student booking submissions'
                            : 'Bookings are locked until a new semester is set up.'}
                    </p>
                </div>
                <button
                    onClick={() => hasActiveSemester && setEnabled(!enabled)}
                    disabled={!hasActiveSemester}
                    className="text-3xl cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed">
                    {enabled ? <FaToggleOn className="text-green-600" /> : <FaToggleOff className="text-text-muted" /> }
                </button>
            </div>

            {/* Show message input when bookings are disabled */}
            {!enabled && (
                <div className="flex flex-col gap-3">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-text-muted uppercase tracking-wider">
                            Reason <span className="text-red-500">*</span>
                        </label>
                        <input
                            value={disableMessage}
                            onChange={(e) => setDisableMessage(e.target.value)}
                            placeholder="e.g. Exam week, End of semester..."
                            className="w-full px-3 py-2 text-sm rounded-sm border border-white-border bg-white  focus:outline-none focus:ring focus:ring-text-primary"
                        />
                    </div>
                </div>
            )}

            {/* Save button */}
            <button
                onClick={handleSave}
                disabled={loading || isUnchanged || (!enabled && !disableMessage.trim())}
                className="px-4 py-2 text-sm font-semibold text-white bg-btn-gray hover:bg-btn-gray-hover rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition cursor-pointer">
                {loading ? 'Saving...' : 'Save Settings'}
            </button>
        </div>
    )
}