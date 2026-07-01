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
    const content = (
        <div onClick={onClick} className={`p-5 rounded-xl shadow-sm border border-cream-border border-l-4 ${borderColor} flex items-center gap-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer`}>
            <div className={`text-3xl flex-shrink-0 ${iconColor}`}>{icon}</div>
            <div className="min-w-0 flex-1">
                <h3 className="text-xs font-bold text-text-brown-light uppercase leading-none truncate" title={label}>
                    {label}
                </h3>
                <p className="text-3xl font-black text-text-brown truncate mt-1"
                   title={typeof value === 'string' ? value : undefined}>
                    {value}
                </p>
            </div>
        </div>
    )

    return href ? <Link href={href}>{content}</Link> : content
}