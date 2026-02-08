import React from "react";
import { History, ChevronRight } from "lucide-react";

const ActivityItem = ({ activity }) => (
  <div className="flex gap-3 py-3 border-b border-base-content/5 last:border-0">
    <div
      className={`mt-1 p-1.5 rounded-full ${activity.colorClass} bg-opacity-10`}
    >
      <activity.icon
        className={`size-3.5 ${activity.colorClass.replace("bg-", "text-")}`}
      />
    </div>
    <div className="min-w-0 flex-1">
      <div className="flex items-center justify-between gap-2">
        <span className="font-medium text-sm truncate">{activity.project}</span>
        <span className="text-[10px] opacity-40 whitespace-nowrap">
          {activity.time}
        </span>
      </div>
      <p className="text-xs opacity-60 truncate">{activity.action}</p>
    </div>
  </div>
);

export default function ActivitySidebar({ activities }) {
  return (
    <div className="w-full lg:w-80 shrink-0">
      <div className="bg-base-300/20 rounded-2xl border border-base-content/5 p-6 sticky top-0">
        <div className="flex items-center gap-2 mb-6">
          <History className="size-5 text-primary" />
          <h3 className="font-bold">Recent Activity</h3>
        </div>

        <div className="space-y-1 mb-6">
          {activities.map((a, idx) => (
            <ActivityItem key={idx} activity={a} />
          ))}
        </div>

        <button className="btn btn-ghost btn-sm btn-block text-xs opacity-50 hover:opacity-100 transition-opacity gap-1">
          View all activity
          <ChevronRight className="size-3" />
        </button>
      </div>
    </div>
  );
}
