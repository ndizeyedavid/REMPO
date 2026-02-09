import React from "react";
import { History, ChevronRight, GitBranch, CheckCircle2, AlertCircle, FileCode } from "lucide-react";

const getIcon = (type) => {
  switch (type) {
    case 'push': return GitBranch;
    case 'scan': return CheckCircle2;
    case 'error': return AlertCircle;
    default: return FileCode;
  }
};

const getColorClass = (type) => {
  switch (type) {
    case 'push': return "bg-primary text-primary";
    case 'scan': return "bg-success text-success";
    case 'error': return "bg-error text-error";
    default: return "bg-info text-info";
  }
};

const formatTime = (timestamp) => {
  if (!timestamp) return "Just now";
  const date = new Date(timestamp);
  const diff = Date.now() - date.getTime();

  if (diff < 60000) return "Just now";
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  return date.toLocaleDateString();
};

const ActivityItem = ({ activity }) => {
  const Icon = getIcon(activity.type);
  const colorClass = getColorClass(activity.type);

  return (
    <div className="flex gap-3 py-3 border-b border-base-content/5 last:border-0 hover:bg-base-200 cursor-pointer px-2 rounded-md">
      <div
        className={`mt-1 size-7 rounded-full ${colorClass.split(' ')[0]}/10 flex items-center justify-center`}
      >
        <Icon className={`size-3.5 ${colorClass.split(' ')[1]}`} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <span className="font-medium text-sm truncate">{activity.project || 'System'}</span>
          <span className="text-[10px] opacity-40 whitespace-nowrap">
            {formatTime(activity.timestamp)}
          </span>
        </div>
        <p className="text-xs opacity-60 truncate">{activity.action}</p>
      </div>
    </div>
  );
};

export default function ActivitySidebar({ activities = [] }) {
  return (
    <div className="w-full lg:w-80 shrink-0">
      <div className="bg-base-300/20 rounded-2xl border border-base-content/5 p-6 sticky top-0">
        <div className="flex items-center gap-2 mb-6">
          <History className="size-5 text-primary" />
          <h3 className="font-bold">Recent Activity</h3>
        </div>

        <div className="space-y-1 mb-6">
          {activities.length > 0 ? (
            activities.map((a) => (
              <ActivityItem key={a.id} activity={a} />
            ))
          ) : (
            <div className="py-10 text-center opacity-30">
              <p className="text-xs">No recent activity</p>
            </div>
          )}
        </div>

        <button className="btn btn-ghost btn-sm btn-block text-xs opacity-50 hover:opacity-100 transition-opacity gap-1">
          View all activity
          <ChevronRight className="size-3" />
        </button>
      </div>
    </div>
  );
}
