// Icons
import { FaInbox  } from "react-icons/fa"

interface EmptyStateProps {
    message?: string
}

export default function EmptyState({ message="No semester is currently active." }: EmptyStateProps) {
    return (
        <div className="flex-1 flex flex-col items-center justify-center text-sm text-text-muted italic text-center px-4">
            <FaInbox className="text-4xl opacity-30" />
            <div>{message}</div>
        </div>
    )
}