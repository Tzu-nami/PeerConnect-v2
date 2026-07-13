import { FaChalkboardTeacher, FaStar } from "react-icons/fa";
import { FaChartBar } from "react-icons/fa6";

type FeedbackStatsProps = {
  stats: {
    total: number;
    sessions: number;
    avg: string;
  };
};

function StatCard({
  title,
  value,
  detail,
  icon,
  color,
}: {
  title: string;
  value: string;
  detail: string;
  icon: React.ReactNode;
  color: string;
}) {
  return (
    <div
      className={`p-5 bg-white rounded-xl shadow-sm border border-white-border border-l-4 ${color} flex items-center gap-4`}
    >
      <div className="text-3xl flex-shrink-0">{icon}</div>

      <div className="min-w-0 flex-1">
        <h3 className="text-xs font-bold text-muted uppercase leading-none truncate">
          {title}
        </h3>

        <p className="text-3xl font-black text-text-primary truncate mt-1">
          {value}
        </p>

        <p className="text-xs text-text-muted mt-1">
          {detail}
        </p>
      </div>
    </div>
  );
}

export default function FeedbackStats({ stats }: FeedbackStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
      <StatCard
        title="Total Responses"
        value={stats.total.toLocaleString()}
        detail="Feedback submissions"
        icon={<FaChartBar className="text-blue-600" />}
        color="border-l-blue-600"
      />

      <StatCard
        title="Total Sessions"
        value={stats.sessions.toLocaleString()}
        detail="Completed sessions"
        icon={<FaChalkboardTeacher className="text-yellow-500" />}
        color="border-l-yellow-500"
      />

      <StatCard
        title="Average Rating"
        value={`${stats.avg} / 5.0`}
        detail="Across rated responses"
        icon={<FaStar className="text-green-600" />}
        color="border-l-green-600"
      />
    </div>
  );
}