// Icons
import { FaBook } from "react-icons/fa";

// Recharts
import { Bar, BarChart, CartesianGrid, Tooltip, XAxis, YAxis, Rectangle } from "recharts";
import type { RectangleProps } from "recharts";

// Types
import { TopSubject } from "@/types/topSubject";

const COLORS = ["#9B2C2C", "#2C7A4B", "#D97706", "#7C3AED", "#0891B2"];

export default function TopSubjects({ topSubjects }: { topSubjects: TopSubject[] }) {
    return (
        <div className="rounded-xl shadow-sm border border-cream-border px-5 py-4 h-full">
            <div className="flex flex-col gap-5">
                <div className="flex items-center gap-2">
                    <FaBook className="text-xl" />
                    <p className="font-bold text-xl">Most Booked Subjects</p>
                </div>

                <BarChart responsive style={{ height: '300px', width: '100%'}} data={topSubjects}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis dataKey="subject_code" tick={{ fontSize: 13}} />
                    <YAxis tick={{ fontSize: 13}} />
                    <Tooltip contentStyle={{ fontSize: 13, borderRadius: 8, borderColor: '#D6CFC0' }}
                             itemStyle={{ fontSize: 13 }} />
                    <Bar
                        dataKey="total_bookings"
                        name="Bookings"
                        radius={[8, 8, 0, 0]}
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