// Icons
import { FaInbox  } from "react-icons/fa"

interface EmptyStateProps {
    message?: string
}

export default function EmptyState({ message="No semester is currently active." }: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[250px] text-sm text-text-muted italic text-center px-4">
            <FaInbox className="text-4xl opacity-30 mb-2" />
            <div>{message}</div>
        </div>
    )
}
