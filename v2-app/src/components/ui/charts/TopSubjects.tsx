// Components
import EmptyState from "@/components/ui/charts/EmptyState"

// Constants
import { CHART_COLORS } from "@/constants/chartColors"

// Icons
import { FaBook } from "react-icons/fa"

// Recharts
import { Bar, BarChart, CartesianGrid, Tooltip, XAxis, YAxis, Rectangle } from "recharts"
import type { RectangleProps } from "recharts"

// Types
import { TopSubject } from "@/types/topSubject"

const COLORS = CHART_COLORS.bars

interface TopSubjectProps {
    topSubjects: TopSubject[]
    hasActiveSemester: boolean
}

export default function TopSubjects({ topSubjects, hasActiveSemester }: TopSubjectProps) {
    return (
        <div className="rounded-xl shadow-sm border border-white-border px-5 py-4 h-full">
            <div className="flex flex-col gap-5 h-full">
                <div className="flex items-center gap-2">
                    <FaBook className="text-xl" />
                    <p className="font-bold text-xl">Most Booked Subjects</p>
                </div>

                {!hasActiveSemester ? (
                    <EmptyState />
                ) : topSubjects.length === 0 ? (
                    <EmptyState message="No bookings recorded yet for this semester." />
                ) : (
                    <BarChart responsive style={{ height: '300px', width: '100%'}} data={topSubjects}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                        <XAxis dataKey="subject_code" tick={{ fontSize: 13}} />
                        <YAxis tick={{ fontSize: 13}} />
                        <Tooltip contentStyle={{ fontSize: 13, borderRadius: 8, borderColor: '#D6CFC0' }}
                                 itemStyle={{ fontSize: 13 }} cursor={false} />
                        <Bar
                            dataKey="total_bookings"
                            name="Bookings"
                            radius={[8, 8, 0, 0]}
                            activeBar={(props: RectangleProps & { index?: number }) => {
                                const { index, ...rest } = props;
                                const baseColor = COLORS[(index ?? 0) % COLORS.length];
                                return <Rectangle {...rest} fill={baseColor} style={{ filter: 'brightness(0.8)' }} />;
                            }}
                            shape={(props: RectangleProps & { index?: number }) => {
                                const { index, ...rest } = props;
                                return <Rectangle {...rest} fill={COLORS[(index ?? 0) % COLORS.length]} />;
                            }}
                        />
                    </BarChart>
                )}
            </div>
        </div>
    )
}