import React, { useState } from "react";
import {
  Search, Filter, List, Grid2X2, GitBranch,
  CheckCircle2, AlertCircle, ChevronDown, ArrowUpDown, Check
} from "lucide-react";
import ProjectCard from "./ProjectCard";
import ProjectListItem from "./ProjectListItem";
import ActivitySidebar from "./ActivitySidebar";
import DashboardStats from "./DashboardStats";
import ProjectDetailsDrawer from "./ProjectDetailsDrawer";

export default function DashboardState({ projects: initialProjects }) {
  const [viewMode, setViewMode] = useState("grid"); // "grid" or "list"
  const [selectedProject, setSelectedProject] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [projects, setProjects] = useState(initialProjects || []);

  const activities = [
    { project: "react-dashboard", time: "2 min ago", action: "Add chart component", icon: GitBranch, colorClass: "bg-primary/10", iconColor: "text-primary" },
    { project: "api-gateway", time: "15 min ago", action: "Pushed 3 commits to main", icon: CheckCircle2, colorClass: "bg-success/10", iconColor: "text-success" },
    { project: "ml-pipeline", time: "1 hour ago", action: "Merge conflict detected", icon: AlertCircle, colorClass: "bg-error/10", iconColor: "text-error" },
    { project: "design-system", time: "3 hours ago", action: "Merged PR #42", icon: GitBranch, colorClass: "bg-info/10", iconColor: "text-info" },
    { project: "landing-page", time: "5 hours ago", action: "Conflict resolved", icon: CheckCircle2, colorClass: "bg-success/10", iconColor: "text-success" }
  ];

  const handleProjectClick = (project) => {
    setSelectedProject(project);
    setIsDrawerOpen(true);
  }

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    // Don't clear selectedProject immediately to allow for closing animation
  };

  return (
    <div className="p-8 h-full overflow-y-auto bg-base-100">
      <DashboardStats />

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Section */}
        <div className="flex-1 min-w-0">
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-1">Your Projects</h2>
            <p className="text-sm opacity-50">Click a project to view details and recent activity</p>
          </div>

          {/* Filters Bar */}
          <div className="flex flex-wrap gap-4 mb-8">
            <div className="relative flex-1 min-w-[300px]">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 opacity-40" />
              <input
                type="text"
                placeholder="Search by name, branch, or path..."
                className="input input-bordered w-full pl-11 rounded-xl bg-base-300/30 border-base-content/5 focus:border-primary/30"
              />
            </div>
            <div className="flex gap-2">
              <div className="dropdown dropdown-end">
                <button tabIndex={0} className="btn btn-ghost bg-base-300/30 border-base-content/5 rounded-xl gap-2 font-normal">
                  <Filter className="size-4 opacity-50" />
                  All Status
                  <ChevronDown className="size-4 opacity-40" />
                </button>
                <ul tabIndex={0} className="dropdown-content z-1 menu p-2 shadow-lg bg-base-300 rounded-xl w-52 mt-2 border border-base-content/10">
                  <li>
                    <button className="flex items-center justify-between bg-base-content/10">
                      <div className="flex items-center gap-2">
                        <Check className="size-4" />
                        <span>All Status</span>
                      </div>
                    </button>
                  </li>
                  <li>
                    <button className="flex items-center gap-2">
                      <div className="size-2 rounded-full bg-success" />
                      <span>Clean</span>
                    </button>
                  </li>
                  <li>
                    <button className="flex items-center gap-2">
                      <div className="size-2 rounded-full bg-warning" />
                      <span>Uncommitted</span>
                    </button>
                  </li>
                  <li>
                    <button className="flex items-center gap-2">
                      <div className="size-2 rounded-full bg-info" />
                      <span>Ahead</span>
                    </button>
                  </li>
                  <li>
                    <button className="flex items-center gap-2">
                      <div className="size-2 rounded-full bg-warning" />
                      <span>Behind</span>
                    </button>
                  </li>
                  <li>
                    <button className="flex items-center gap-2">
                      <div className="size-2 rounded-full bg-error" />
                      <span>Conflicts</span>
                    </button>
                  </li>
                </ul>
              </div>

              <div className="dropdown dropdown-end">
                <button tabIndex={0} className="btn btn-ghost bg-base-300/30 border-base-content/5 rounded-xl gap-2 font-normal">
                  <ArrowUpDown className="size-4 opacity-50" />
                  Name
                  <ChevronDown className="size-4 opacity-40" />
                </button>
                <ul tabIndex={0} className="dropdown-content z-1 menu p-2 shadow-lg bg-base-300 rounded-xl w-44 mt-2 border border-base-content/10">
                  <li>
                    <button className="flex items-center justify-between bg-base-content/10">
                      <div className="flex items-center gap-2">
                        <Check className="size-4" />
                        <span>Name</span>
                      </div>
                    </button>
                  </li>
                  <li>
                    <button className="flex items-center px-8">
                      <span>Status</span>
                    </button>
                  </li>
                  <li>
                    <button className="flex items-center px-8">
                      <span>Recent</span>
                    </button>
                  </li>
                </ul>
              </div>
              <div className="join bg-base-300/30 rounded-xl border border-base-content/5 overflow-hidden h-fit">
                <button
                  className={`btn btn-ghost btn-sm join-item ${viewMode === "grid" ? "bg-base-200" : "opacity-50"}`}
                  onClick={() => setViewMode("grid")}
                >
                  <Grid2X2 className="size-4" />
                </button>
                <button
                  className={`btn btn-ghost btn-sm join-item ${viewMode === "list" ? "bg-base-200" : "opacity-50"}`}
                  onClick={() => setViewMode("list")}
                >
                  <List className="size-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-8">
            <span className="badge bg-success/10 text-success border-success/20 gap-1.5 py-3 px-3 cursor-pointer hover:bg-success hover:text-success-content transition-colors">
              <div className="size-1.5 rounded-full bg-success" /> Clean
            </span>
            <span className="badge bg-warning/10 text-warning border-warning/20 gap-1.5 py-3 px-3 cursor-pointer hover:bg-warning hover:text-warning-content transition-colors">
              <div className="size-1.5 rounded-full bg-warning" /> Uncommitted
            </span>
            <span className="badge bg-info/10 text-info border-info/20 gap-1.5 py-3 px-3 cursor-pointer hover:bg-info hover:text-info-content transition-colors">
              <div className="size-1.5 rounded-full bg-info" /> Ahead
            </span>
            <span className="badge bg-error/10 text-error border-error/20 gap-1.5 py-3 px-3 cursor-pointer hover:bg-error hover:text-error-content transition-colors">
              <div className="size-1.5 rounded-full bg-error" /> Conflicts
            </span>
          </div>

          {/* Display */}
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {projects.map((p, idx) => (
                // <div key={idx}  className="cursor-pointer">
                <ProjectCard key={idx} project={p} handleProjectClick={handleProjectClick} />
                // </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {projects.map((p, idx) => (
                // <div key={idx} onClick={() => handleProjectClick(p)} className="cursor-pointer">
                <ProjectListItem key={idx} project={p} handleProjectClick={handleProjectClick} />
                // </div>
              ))}
            </div>
          )}
        </div>

        <ActivitySidebar activities={activities} />
      </div>

      {/* Drawer */}
      {isDrawerOpen && (
        <ProjectDetailsDrawer
          project={selectedProject}
          onClose={handleCloseDrawer}
        />
      )}
    </div>
  );
}
