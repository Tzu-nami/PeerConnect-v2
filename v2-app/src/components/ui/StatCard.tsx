import Link from "next/link"

export interface StatCardProps {
    label: string
    value: React.ReactNode
    icon: React.ReactNode
    borderColor: string
    iconColor: string
    href?: string
    onClick?: () => void;
}

export default function StatCard({ label, value, icon, borderColor, iconColor, href, onClick }: StatCardProps) {
    const isInteractive = Boolean(onClick || href);
    const content = (
        <div 
            onClick={onClick} 
            className={`p-4 md:p-5 bg-white rounded-xl shadow-sm border border-white-border border-l-4 ${borderColor} flex items-center gap-3 md:gap-4 ${
                isInteractive ? "hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer" : ""
            }`}
        >
            <div className={`text-2xl md:text-3xl flex-shrink-0 ${iconColor}`}>{icon}</div>
            <div className="min-w-0 flex-1">
                <h3 className="text-[10px] md:text-xs font-bold text-muted uppercase leading-none truncate" title={label}>
                    {label}
                </h3>
                <p className="text-2xl md:text-3xl font-black text-text-primary truncate mt-1"
                   title={typeof value === 'string' ? value : undefined}>
                    {label === 'Rendered Hours' ? `${value}` : value}
                </p>
            </div>
        </div>
    )

    return href ? <Link href={href}>{content}</Link> : content
}