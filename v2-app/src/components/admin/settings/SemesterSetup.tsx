import { useState, useEffect } from "react";
import { toast } from "sonner"
import { useRouter } from "next/router"

// Components
import ConfirmModal from "@/components/ui/ConfirmModal"

// Constants
import {TERM_LABELS} from "@/constants/termLabels";

// Icons
import { FiAlertTriangle, FiCheckCircle } from "react-icons/fi"

// Utilities
import {createClient} from "@/utils/supabase/client";

interface SemesterSetupProps {
    currentSemester: string
    currentAcadYear: number
    currentSemStart: string
    isCurrentActive: boolean
}

export default function SemesterSetup({ currentSemester, currentAcadYear, currentSemStart, isCurrentActive }: SemesterSetupProps) {
    // Value states
    const [semester, setSemester] = useState(currentSemester ?? '')
    const [acadYear, setAcadYear] = useState(currentAcadYear ?? 2026)
    const [semStart, setSemStart] = useState(currentSemStart)

    // Function states
    const [loading, setLoading] = useState(false)
    const [confirmAction, setConfirmAction] = useState<'save' | 'end' | null>(null)

    const supabase = createClient()
    const router = useRouter()

    // Reset state after refresh
    useEffect(() => {
        setSemester(currentSemester ?? '')
        setAcadYear(currentAcadYear ?? 2026)
        setSemStart(currentSemStart ?? '')
    }, [currentSemester, currentAcadYear, currentSemStart])

    // Handles saving the semester details
    async function handleSave() {
        setLoading(true)
        const { error } = await supabase.rpc('set_current_semester', {
            p_term: semester,
            p_ay_start: acadYear,
            p_semester_start: semStart
        })
        setLoading(false)
        setConfirmAction(null)

        if (error) {
            toast.error(error.message)
            return
        }
        toast.success('Semester saved successfully.')
        window.location.reload()
    }

    // Handles ending the semester
    async function handleEndSemester() {
        setLoading(true)
        const { error } = await supabase.rpc('end_current_semester')
        setLoading(false)
        setConfirmAction(null)

        if (error) {
            toast.error(error.message)
            return
        }
        toast.success('Semester ended.')
        window.location.reload()
    }

    return(
        <div className="bg-white rounded-xl border border-white-border shadow-sm p-6 flex flex-col gap-5 max-w-xl mt-5">
            <p className="font-bold text-text-primary uppercase tracking-wider">Set up current semester</p>

            <div className="flex flex-col gap-4">
                {/* Current term */}
                <div className="grid grid-cols-[140px_1fr] items-center gap-4">
                    <label className="text-sm text-text-muted">Term</label>
                    <select name="currentTerm"
                            value={semester}
                            disabled={isCurrentActive}
                            onChange={(e) => setSemester(e.target.value)}
                            className="px-3 py-2 text-sm rounded-sm border border-white-border bg-white  focus:outline-none focus:ring focus:ring-text-primary disabled:opacity-50 disabled:cursor-not-allowed">
                        <option value="" disabled hidden>Select semester</option>
                        {Object.entries(TERM_LABELS).map(([value, label]) => (
                            <option key={value} value={value}>{label as string}</option>
                        ))}
                    </select>
                </div>

                {/* Academic year */}
                <div className="grid grid-cols-[140px_1fr] items-center gap-4">
                    <label className="text-sm text-text-muted">Academic Year</label>
                    <div className="flex items-center gap-3">
                        <input
                            name="acadYear"
                            type="number"
                            min={2026}
                            value={acadYear}
                            disabled={isCurrentActive}
                            placeholder="Enter academic year 2026 onwards..."
                            onChange={(e) => setAcadYear(Number(e.target.value))}
                            className="px-3 py-2 text-sm rounded-sm border border-white-border bg-white  focus:outline-none focus:ring focus:ring-text-primary disabled:opacity-50 disabled:cursor-not-allowed w-40"
                        />
                        <p className={`${isCurrentActive ? "opacity-50" : "opacity-100" } text-sm whitespace-nowrap`}>
                            {acadYear ? `– ${acadYear + 1}` : '— ----'}
                        </p>
                    </div>
                </div>

                {/* Semester start schedule */}
                <div className="grid grid-cols-[140px_1fr] items-center gap-4">
                    <label className="text-sm text-text-muted">Start</label>
                    <input name="semStart"
                           type="date"
                           value={semStart}
                           disabled={isCurrentActive}
                           onChange={(e) => setSemStart(e.target.value)}
                           className="px-3 py-2 text-sm rounded-sm border border-white-border bg-white  focus:outline-none focus:ring focus:ring-text-primary disabled:opacity-50 disabled:cursor-not-allowed" />
                </div>
            </div>
            <button onClick={() => {
                        if (!acadYear || acadYear < 2026) {
                            toast.error('Academic year must be 2026 or later.')
                            return
                        }
                        setConfirmAction('save')
                    }}
                    disabled={loading || isCurrentActive || !semester || !acadYear || !semStart}
                    className="px-4 py-2 text-sm font-semibold text-white bg-btn-gray hover:bg-btn-gray-hover rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition cursor-pointer">
                Save Current Semester
            </button>

            <button onClick={() => setConfirmAction('end')}
                    disabled={loading || !isCurrentActive}
                    className="px-4 py-2 text-sm font-semibold text-white bg-btn-gray hover:bg-btn-gray-hover rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition cursor-pointer">
                End Current Semester
            </button>

            <ConfirmModal
                isOpen={confirmAction === 'save'}
                onCancel={() => setConfirmAction(null)}
                title="Save this semester?"
                message="This will set the entered term as the new current semester. Once saved, the semestral details cannot be edited unless it is ended first."
                icon={<FiCheckCircle className="text-up-maroon" size={40} />}
                confirmLabel="Save"
                loading={loading}
                onConfirm={handleSave}
            />

            <ConfirmModal
                isOpen={confirmAction === 'end'}
                onCancel={() => setConfirmAction(null)}
                title="End the current semester?"
                message="This will close the active semester until a new one is set up."
                icon={<FiAlertTriangle className="text-amber-600" size={40} />}
                confirmLabel="End Semester"
                confirmClassName="bg-red-600 hover:bg-red-700"
                loading={loading}
                onConfirm={handleEndSemester}
            />
        </div>

    )
}