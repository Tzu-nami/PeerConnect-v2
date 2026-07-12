import { useState } from "react";
import { toast } from "sonner";
import SemesterFilter from "@/components/admin/settings/SemesterFilter";
import { Semester } from "@/types/semester";

interface GenerateReportProps {
    semesters: Semester[]
    selectedSemesterId: string | null
    onSemesterChange: (id: string) => void
}

export default function GenerateReport({ semesters, selectedSemesterId, onSemesterChange }: GenerateReportProps) {
    const [loading, setLoading] = useState(false);

    async function handleExport() {
        if (!selectedSemesterId) {
            toast.error("Please select a semester.");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch(`/api/admin/settings/export-report?semester_id=${selectedSemesterId}`);

            if (!res.ok) {
                const body = await res.json().catch(() => null);
                toast.error(body?.error ?? "Failed to generate report.");
                return;
            }

            const disposition = res.headers.get('Content-Disposition');
            const match = disposition?.match(/filename="(.+)"/);
            const filename = match?.[1] ?? "LRC-Report.xlsx";

            const blob = await res.blob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = filename;
            a.click();
            URL.revokeObjectURL(url);

            toast.success("Report generated successfully.");
        } catch {
            toast.error("Something went wrong while generating the report.");
        } finally {
            setLoading(false);
        }
    }

    return(
        <div className="bg-white rounded-xl border border-white-border shadow-sm p-6 max-w-xl mt-5">
            <p className="font-bold text-text-primary uppercase tracking-wider">Generate Semestral Report</p>
            <p className="text-sm text-text-muted mb-6">Please select a semester to download its report.</p>

            <div className="flex gap-5">
                <button
                    onClick={handleExport}
                    disabled={loading || !selectedSemesterId}
                    className="px-4 py-2 text-sm font-semibold text-white bg-btn-gray hover:bg-btn-gray-hover rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition cursor-pointer">
                    {loading ? "Generating..." : "Download"}
                </button>
                <SemesterFilter semesters={semesters} selected={selectedSemesterId} onChange={onSemesterChange} />
            </div>
        </div>
    )
}