import React from "react";
import {
  Folder,
  CheckCircle2,
  Clock,
  ArrowUpCircle,
  AlertCircle,
} from "lucide-react";

const StatsCard = ({ icon: Icon, label, value, colorClass, iconColor }) => (
  <div className="bg-base-300/50 p-4 rounded-xl border border-base-content/5">
    <div className="flex items-center gap-3">
      <div className={`p-2 rounded-lg ${colorClass} bg-opacity-10`}>
        <Icon className={`size-5 ${iconColor}`} />
      </div>
      <div>
        <div className="text-2xl font-bold">{value}</div>
        <div className="text-xs opacity-50">{label}</div>
      </div>
    </div>
  </div>
);

export default function DashboardStats({ projects = [] }) {
  const stats = {
    total: projects.length,
    clean: projects.filter(p => p.status === "Clean").length,
    uncommitted: projects.filter(p => p.status === "Uncommitted" || p.status === "Uncommitted Changes").length,
    ahead: projects.filter(p => p.status === "Ahead").length,
    conflicts: projects.filter(p => p.status === "Conflicts").length
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      <StatsCard
        icon={Folder}
        label="Total Repos"
        value={stats.total}
        colorClass="bg-primary/10"
        iconColor="text-primary"
      />
      <StatsCard
        icon={CheckCircle2}
        label="Clean"
        value={stats.clean}
        colorClass="bg-success/10"
        iconColor="text-success"
      />
      <StatsCard
        icon={Clock}
        label="Uncommitted"
        value={stats.uncommitted}
        colorClass="bg-warning/10"
        iconColor="text-warning"
      />
      <StatsCard
        icon={ArrowUpCircle}
        label="Ahead"
        value={stats.ahead}
        colorClass="bg-info/10"
        iconColor="text-info"
      />
      <StatsCard
        icon={AlertCircle}
        label="Conflicts"
        value={stats.conflicts}
        colorClass="bg-error/10"
        iconColor="text-error"
      />
    </div>
  );
}
