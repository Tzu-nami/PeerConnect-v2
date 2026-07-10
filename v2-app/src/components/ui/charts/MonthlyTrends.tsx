// Components
import EmptyState from "@/components/ui/charts/EmptyState"

// Constants
import { CHART_COLORS } from "@/constants/chartColors"

// Icons
import { FaChartArea } from "react-icons/fa"

// Recharts
import { AreaChart, Area, XAxis, YAxis, Legend, CartesianGrid, Tooltip } from "recharts"

// Types
import { MonthlyTrend } from "@/types/monthlyTrend"

interface MonthlyTrendsProps {
    monthlyTrends: MonthlyTrend[]
    hasActiveSemester: boolean
}

export default function MonthlyTrends({ monthlyTrends, hasActiveSemester }: MonthlyTrendsProps) {
    return(
        <div className="rounded-xl shadow-sm border border-white-border px-5 py-4 h-full">
            <div className="flex flex-col gap-4">
                {/* Chart title */}
                <div className="flex items-center gap-2">
                    <FaChartArea className="text-xl" />
                    <p className="font-bold text-xl">Monthly Session Trends</p>
                </div>

                {!hasActiveSemester ? (
                    <EmptyState />
                ) : monthlyTrends.length === 0 ? (
                    <EmptyState message="No bookings recorded yet for this semester." />
                ) : (
                    <AreaChart responsive style={{ height: '300px', width: '100%'}} data={monthlyTrends}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                        <XAxis dataKey="month"  tick={{ fontSize: 13}} tickFormatter={(val) => val.split(' ')[0]} />
                        <YAxis tick={{ fontSize: 13}} />
                        <Tooltip contentStyle={{ fontSize: 13, borderRadius: 8, borderColor: '#D6CFC0' }}
                                 itemStyle={{ fontSize: 13 }} />
                        <Legend />

                        {/* Lines */}
                        <Area type="monotone" dataKey="total_successful" name="Successful Sessions"
                              stroke={CHART_COLORS.successful.stroke} strokeWidth={2} fillOpacity={0.3} fill={CHART_COLORS.successful.fill} />
                        <Area type="monotone" dataKey="total_unsuccessful" name="Unsuccessful Sessions"
                              stroke={CHART_COLORS.unsuccessful.stroke} strokeWidth={2} fillOpacity={0.3} fill={CHART_COLORS.unsuccessful.fill} />
                    </AreaChart>
                )}
            </div>
        </div>
    )
}