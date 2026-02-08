import React from "react";
import {
  Folder,
  CheckCircle2,
  Clock,
  ArrowUpCircle,
  AlertCircle,
} from "lucide-react";

const StatsCard = ({ icon: Icon, label, value, colorClass }) => (
  <div className="bg-base-300/50 p-4 rounded-xl border border-base-content/5">
    <div className="flex items-center gap-3">
      <div className={`p-2 rounded-lg ${colorClass} bg-opacity-10`}>
        <Icon className={`size-5 ${colorClass.replace("bg-", "text-")}`} />
      </div>
      <div>
        <div className="text-2xl font-bold">{value}</div>
        <div className="text-xs opacity-50">{label}</div>
      </div>
    </div>
  </div>
);

export default function DashboardStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-10">
      <StatsCard
        icon={Folder}
        label="Total Repos"
        value="8"
        colorClass="bg-primary"
      />
      <StatsCard
        icon={CheckCircle2}
        label="Clean"
        value="3"
        colorClass="bg-success"
      />
      <StatsCard
        icon={Clock}
        label="Uncommitted"
        value="2"
        colorClass="bg-warning"
      />
      <StatsCard
        icon={ArrowUpCircle}
        label="Ahead"
        value="1"
        colorClass="bg-info"
      />
      <StatsCard
        icon={AlertCircle}
        label="Conflicts"
        value="1"
        colorClass="bg-error"
      />
    </div>
  );
}
