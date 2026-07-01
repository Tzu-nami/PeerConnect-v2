// Icons
import { FaTrophy } from "react-icons/fa"

// Types
import {TopMentor} from "@/types/topMentor"

export default function TopMentors({ topMentors }: { topMentors: TopMentor[] }) {
    return(
        <div className="rounded-xl shadow-sm border border-cream-border h-full">
            <div className="flex flex-col">
                {/* Table title */}
                <div className="flex items-center gap-2 px-5 py-4">
                    <FaTrophy className="text-xl" />
                    <p className="font-bold text-xl">Top Mentors</p>
                </div>

                {/* Table display */}
                <div>
                    <table className="w-full table-fixed text-left text-sm">
                        {/* Table header */}
                        <thead className="text-text-brown-light text-xs bg-cream-dark border-y border-cream-border">
                        <tr>
                            <th className="px-4 py-2 text-center w-[20%]">Rank</th>
                            <th className="px-4 py-2 w-[20%]">Name</th>
                            <th className="px-4 py-2 text-center w-[30%]">Total Sessions</th>
                            <th className="px-4 py-2 text-center w-[30%]">Average Rating</th>
                        </tr>
                        </thead>

                        {/* Table content */}
                        <tbody>
                        {topMentors.map((mentor, index) => {
                            const medals = ['🥇', '🥈', '🥉'];

                            return(
                                <tr key={mentor.mentor_id} className="border-t border-cream-border">
                                    <td className={index < 3 ? "p-4 text-center text-lg" : "px-4 py-3 text-center"}>{medals[index] ?? index + 1}</td>
                                    <td className="p-4  font-bold">{mentor.mentor_name}</td>
                                    <td className="p-4  text-center">{mentor.total_sessions}</td>
                                    <td className="p-4  text-center">{mentor.average_rating}</td>
                                </tr>
                            )
                        })}
                        </tbody>
                    </table>

                </div>
            </div>
        </div>
    )
}