// Components
import EmptyState from "@/components/ui/charts/EmptyState"

// Constants
import { CHART_COLORS } from "@/constants/chartColors"

// Icons
import { FaSmile } from "react-icons/fa"

// Recharts
import { Pie, PieChart, Cell, Tooltip, Sector } from "recharts"

// Types
import { SatisfactionData } from "@/types/satisfactionData"

interface  SatisfactionDataProps {
    satisfactionData: SatisfactionData[]
    hasActiveSemester: boolean
}

export default function SatisfactionRate({ satisfactionData, hasActiveSemester }: SatisfactionDataProps) {
    return (
        <div className="rounded-xl shadow-sm border border-white-border px-5 py-4 h-full">
            <div className="flex flex-col gap-5">
                {/* Chart title */}
                <div className="flex items-center gap-2">
                    <FaSmile className="text-xl" />
                    <p className="font-bold text-xl">Student Satisfaction Rate</p>
                </div>

                {!hasActiveSemester ? (
                    <EmptyState />
                ) : satisfactionData.length === 0 ? (
                    <EmptyState message="No feedbacks received yet for this semester." />
                ) : (
                    <PieChart width={undefined} height={300} responsive style={{ width: '100%' }}>
                        <Pie
                            data={satisfactionData}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={90}
                            activeShape={(props: any) => {
                                const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props
                                return (
                                    <Sector
                                        cx={cx}
                                        cy={cy}
                                        innerRadius={innerRadius}
                                        outerRadius={outerRadius + 6}
                                        startAngle={startAngle}
                                        endAngle={endAngle}
                                        fill={fill}
                                        style={{ filter: 'brightness(0.85)' }}
                                    />
                                )
                            }}
                            label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                        >
                            {satisfactionData.map((entry) => {
                                const color = CHART_COLORS.satisfaction[entry.name as keyof typeof CHART_COLORS.satisfaction]
                                return <Cell key={entry.name} fill={color ?? "#9CA3AF"} />
                            })}
                        </Pie>
                        <Tooltip contentStyle={{ fontSize: 13, borderRadius: 8, borderColor: '#D6CFC0' }}
                                 itemStyle={{ fontSize: 13 }} />
                    </PieChart>
                )}
            </div>
        </div>
    )
}