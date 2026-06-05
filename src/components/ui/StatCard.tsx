import { ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
}

export function StatCard({ title, value, icon, change, changeType = "neutral" }: StatCardProps) {
  const changeColors = {
    positive: "text-success",
    negative: "text-error",
    neutral: "text-gray-400",
  };

  return (
    <div className="bg-surface border border-border-subtle rounded-lg p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-400">{title}</p>
          <p className="text-2xl font-bold text-white mt-1">{value}</p>
          {change && (
            <p className={`text-sm mt-1 ${changeColors[changeType]}`}>{change}</p>
          )}
        </div>
        {icon && (
          <div className="text-accent-blue">{icon}</div>
        )}
      </div>
    </div>
  );
}