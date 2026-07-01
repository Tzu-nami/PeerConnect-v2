import { STATUS_LABELS } from "@/constants/statusLabels"
import { STATUS_COLORS } from "@/constants/statusColors"

export default function StatusBadge({ status }: { status: string }) {
    return(
        <span className={`${STATUS_COLORS[status]} rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap`}>
            {STATUS_LABELS[status] ?? status}
        </span>
    )

}