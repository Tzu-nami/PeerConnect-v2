import Link from "next/link"
interface StatCardProps {
    label: string
    value: number | string | null
    href: string
    color: string
    icon: React.ReactNode
}

const colorScheme: Record<string, { border: string; text: string }> = {
    green:  { border: 'border-green-500',  text: 'text-green-500'  },
    blue:   { border: 'border-blue-500',   text: 'text-blue-500'   },
    yellow: { border: 'border-yellow-500', text: 'text-yellow-500' },
    red:    { border: 'border-red-500',    text: 'text-red-500'    },
    purple: { border: 'border-purple-500', text: 'text-purple-500' },
}

export default function StatCard({ label, value, href, color, icon }: StatCardProps) {
    return(
        <Link href={href} className={`flex items-center gap-5 p-5 rounded-xl shadow-sm bg-white border-l-4 ${colorScheme[color].border} hover:shadow-md hover:-translate-y-0.5 transition-transform duration-200 cursor-pointer`}>
            <div className={`text-3xl ${colorScheme[color].text}`}>{icon}</div>
            <div>
                <h1 className="text-xs text-text-brown-light uppercase font-bold tracking-wide">{label}</h1>
                <h2 className="text-3xl font-extrabold">{value}</h2>
            </div>
        </Link>
    )
}