import { FaSmile } from "react-icons/fa";
import { Pie, PieChart, Cell, Tooltip, Legend } from "recharts";

// Types
import { SatisfactionData } from "@/types/satisfactionData";

// Constants
import { SATISFACTION_COLORS } from "@/constants/satisfactionRateColors"


export default function SatisfactionRate({ satisfactionData }: { satisfactionData: SatisfactionData[] }) {
    return (
        <div className="rounded-xl shadow-sm border border-cream-border px-5 py-4 h-full">
            <div className="flex flex-col gap-5">
                {/* Chart title */}
                <div className="flex items-center gap-2">
                    <FaSmile className="text-xl" />
                    <p className="font-bold text-xl">Satisfaction Rate</p>
                </div>

                {/* Chart display */}
                <PieChart width={undefined} height={300} responsive style={{ width: '100%' }}>
                    <Pie
                        data={satisfactionData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={90}
                        label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                    >
                        {satisfactionData.map((entry) => (
                            <Cell key={entry.name} fill={SATISFACTION_COLORS[entry.name] ?? "#9CA3AF"} />
                        ))}
                    </Pie>
                    <Tooltip contentStyle={{ fontSize: 13, borderRadius: 8, borderColor: '#D6CFC0' }}
                             itemStyle={{ fontSize: 13 }} />
                    <Legend />
                </PieChart>
            </div>
        </div>
    )
}