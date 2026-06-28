export interface StatCardProps {
  label: string;
  value: React.ReactNode;
  icon: React.ReactNode;
  color: string;
  iconColor: string;
}

export default function StatCard({ label, value, icon, color, iconColor }: StatCardProps) {
    return (
        <div className={`bg-white p-5 rounded-xl shadow-md border border-cream-border border-l-4 ${color} flex items-center gap-4`}>
            <div className={`text-2xl flex-shrink-0 ${iconColor}`}>{icon}</div>

            <div className="min-w-0 flex-1">
                <h3 className="text-xs font-bold text-text-brown-light uppercase leading-none truncate"
                title={label}>
                {label}
                </h3>

                <p className="text-xl font-black text-text-brown truncate"
                title={typeof value === 'string' ? value : undefined}>
                {value}
                </p>
            </div>
        </div>
    );
}