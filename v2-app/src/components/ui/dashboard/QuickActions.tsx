import { useState } from "react";
import { toast } from "sonner";
import { MdLibraryAdd, MdPersonAddAlt1 } from "react-icons/md";
import { FaFileAlt } from "react-icons/fa";
import Link from "next/link";

export default function QuickActions() {
    const [downloading, setDownloading] = useState(false);

    async function handleGenerateCurrentReport() {
        setDownloading(true);
        try {
            const res = await fetch(`/api/admin/settings/export-report?semester_id=current`);

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
            setDownloading(false);
        }
    }

    return (
        <div className="rounded-xl shadow-sm border border-white-border flex-1 px-4 py-3 text-sm ">
            <p className="font-bold mb-3">Quick Actions</p>
            <div className="flex flex-col gap-2">
                <div className="flex gap-2">
                    <Link href="/admin/mentors?action=add" className="w-full flex gap-2 items-center justify-center border border-white-border rounded-md py-2 hover:bg-white-hover cursor-pointer">
                        <MdPersonAddAlt1 className="text-base" />
                        <span className="font-semibold">Add Mentor</span>
                    </Link>
                    <Link href="/admin/courses?action=add" className="w-full flex gap-2 items-center justify-center border border-white-border rounded-md py-2 hover:bg-white-hover cursor-pointer">
                        <MdLibraryAdd className="text-base" />
                        <span className="font-semibold">Add Subject</span>
                    </Link>
                </div>

                <button
                    type="button"
                    onClick={handleGenerateCurrentReport}
                    disabled={downloading}
                    className="w-full flex gap-2 items-center justify-center border border-white-border rounded-md py-2 hover:bg-white-hover cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <FaFileAlt className="text-base" />
                    <span className="font-semibold">{downloading ? "Generating..." : "Generate Report"}</span>
                </button>
            </div>
        </div>
    )
}