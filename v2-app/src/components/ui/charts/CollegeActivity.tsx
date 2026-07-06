// Constants
import { CHART_COLORS } from "@/constants/chartColors"

// Icons
import { FaSchool  } from "react-icons/fa"

// Recharts
import { Bar, BarChart, CartesianGrid, Tooltip, XAxis, YAxis, Rectangle } from "recharts"
import type { RectangleProps } from "recharts"

// Types
import { CollegeActivity } from "@/types/collegeActivity"

const COLORS = CHART_COLORS.bars

export default function CollegeBookings({ collegeActivity }: { collegeActivity: CollegeActivity[] }) {
    return (
        <div className="rounded-xl shadow-sm border border-cream-border px-5 py-4 h-full">
            <div className="flex flex-col gap-5">
                <div className="flex items-center gap-2">
                    <FaSchool  className="text-xl" />
                    <p className="font-bold text-xl">Bookings per College</p>
                </div>

                <BarChart responsive style={{ height: '300px', width: '100%'}} data={collegeActivity}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis dataKey="college_code" tick={{ fontSize: 13}} />
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
            </div>
        </div>
    )
}