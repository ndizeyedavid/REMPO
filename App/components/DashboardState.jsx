import React, { useState, useMemo } from "react";
import {
  Search, Filter, List, Grid2X2, GitBranch,
  CheckCircle2, AlertCircle, ChevronDown, ArrowUpDown, Check
} from "lucide-react";
import ProjectCard from "./ProjectCard";
import ProjectListItem from "./ProjectListItem";
import ActivitySidebar from "./ActivitySidebar";
import DashboardStats from "./DashboardStats";
import ProjectDetailsDrawer from "./ProjectDetailsDrawer";

export default function DashboardState({ projects: initialProjects, activities, onLogActivity, aiSettings, aiResponses, onTriggerSummary }) {
  const [viewMode, setViewMode] = useState("grid"); // "grid" or "list"
  const [selectedProject, setSelectedProject] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [sortBy, setSortBy] = useState("Name");

  const projects = initialProjects || [];

  const filteredProjects = useMemo(() => {
    let result = [...projects];

    // Search filter
    if (searchQuery) {
      result = result.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.path.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== "All Status") {
      result = result.filter(p => p.status === statusFilter);
    }

    // Sort logic
    result.sort((a, b) => {
      if (sortBy === "Name") {
        return a.name.localeCompare(b.name);
      } else if (sortBy === "Status") {
        return a.status.localeCompare(b.status);
      } else if (sortBy === "Recent") {
        // Since we don't have real timestamps yet, we'll keep it as is
        return 0;
      }
      return 0;
    });

    return result;
  }, [projects, searchQuery, statusFilter, sortBy]);

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
      <DashboardStats projects={projects} />

      <div className="flex flex-col lg:flex-row gap-8 mt-8">
        {/* Main Section */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 opacity-40" />
              <input
                type="text"
                placeholder="Search repositories..."
                className="input input-bordered w-full pl-12 bg-base-300/30 border-base-content/10 rounded-xl focus:border-primary/50 transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-3">
              <div className="dropdown dropdown-end">
                <button tabIndex={0} className="btn btn-ghost btn-sm bg-base-300/50 border border-base-content/10 rounded-xl gap-2 font-medium">
                  <Filter className="size-4 opacity-40" />
                  {statusFilter}
                  <ChevronDown className="size-4 opacity-40" />
                </button>
                <ul tabIndex={0} className="dropdown-content z-1 menu p-2 shadow-lg bg-base-300 rounded-xl w-52 mt-2 border border-base-content/10">
                  <li>
                    <button
                      className={`flex items-center justify-between ${statusFilter === "All Status" ? "bg-base-content/10" : ""}`}
                      onClick={() => setStatusFilter("All Status")}
                    >
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="size-4 opacity-40" />
                        <span>All Status</span>
                      </div>
                      {statusFilter === "All Status" && <Check className="size-4 text-primary" />}
                    </button>
                  </li>
                  <div className="divider my-1 opacity-5"></div>
                  <li>
                    <button
                      className={`flex items-center justify-between ${statusFilter === "Clean" ? "bg-base-content/10" : ""}`}
                      onClick={() => setStatusFilter("Clean")}
                    >
                      <div className="flex items-center gap-2">
                        <div className="size-2 rounded-full bg-success"></div>
                        <span>Clean</span>
                      </div>
                      {statusFilter === "Clean" && <Check className="size-4 text-primary" />}
                    </button>
                  </li>
                  <li>
                    <button
                      className={`flex items-center justify-between ${statusFilter === "Uncommitted" ? "bg-base-content/10" : ""}`}
                      onClick={() => setStatusFilter("Uncommitted")}
                    >
                      <div className="flex items-center gap-2">
                        <div className="size-2 rounded-full bg-warning"></div>
                        <span>Uncommitted</span>
                      </div>
                      {statusFilter === "Uncommitted" && <Check className="size-4 text-primary" />}
                    </button>
                  </li>
                </ul>
              </div>

              <div className="dropdown dropdown-end">
                <button tabIndex={0} className="btn btn-ghost btn-sm bg-base-300/50 border border-base-content/10 rounded-xl gap-2 font-medium">
                  <ArrowUpDown className="size-4 opacity-40" />
                  {sortBy}
                  <ChevronDown className="size-4 opacity-40" />
                </button>
                <ul tabIndex={0} className="dropdown-content z-1 menu p-2 shadow-lg bg-base-300 rounded-xl w-44 mt-2 border border-base-content/10">
                  <li>
                    <button
                      className={`flex items-center justify-between ${sortBy === "Name" ? "bg-base-content/10" : ""}`}
                      onClick={() => setSortBy("Name")}
                    >
                      <span>Name</span>
                      {sortBy === "Name" && <Check className="size-4 text-primary" />}
                    </button>
                  </li>
                  <li>
                    <button
                      className={`flex items-center justify-between ${sortBy === "Status" ? "bg-base-content/10" : ""}`}
                      onClick={() => setSortBy("Status")}
                    >
                      <span>Status</span>
                      {sortBy === "Status" && <Check className="size-4 text-primary" />}
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
            <span
              className={`badge gap-1.5 py-3 px-3 cursor-pointer transition-colors ${statusFilter === "Clean" ? "bg-success text-success-content border-success" : "bg-success/10 text-success border-success/20 hover:bg-success hover:text-success-content"}`}
              onClick={() => setStatusFilter(statusFilter === "Clean" ? "All Status" : "Clean")}
            >
              <div className={`size-1.5 rounded-full ${statusFilter === "Clean" ? "bg-success-content" : "bg-success"}`} /> Clean
            </span>
            <span
              className={`badge gap-1.5 py-3 px-3 cursor-pointer transition-colors ${statusFilter === "Uncommitted" ? "bg-warning text-warning-content border-warning" : "bg-warning/10 text-warning border-warning/20 hover:bg-warning hover:text-warning-content"}`}
              onClick={() => setStatusFilter(statusFilter === "Uncommitted" ? "All Status" : "Uncommitted")}
            >
              <div className={`size-1.5 rounded-full ${statusFilter === "Uncommitted" ? "bg-warning-content" : "bg-warning"}`} /> Uncommitted
            </span>
            <span className="badge bg-info/10 text-info border-info/20 gap-1.5 py-3 px-3 cursor-pointer hover:bg-info hover:text-info-content transition-colors opacity-50">
              <div className="size-1.5 rounded-full bg-info" /> Ahead
            </span>
            <span className="badge bg-error/10 text-error border-error/20 gap-1.5 py-3 px-3 cursor-pointer hover:bg-error hover:text-error-content transition-colors opacity-50">
              <div className="size-1.5 rounded-full bg-error" /> Conflicts
            </span>
          </div>

          {/* Display */}
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {filteredProjects.map((p, idx) => (
                <ProjectCard
                  key={p.path}
                  project={p}
                  handleProjectClick={handleProjectClick}
                  aiSettings={aiSettings}
                  aiResponse={aiResponses[p.path]}
                  onTriggerSummary={onTriggerSummary}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {filteredProjects.map((p, idx) => (
                <ProjectListItem key={idx} project={p} handleProjectClick={handleProjectClick} />
              ))}
            </div>
          )}
          {filteredProjects.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 opacity-40">
              <Search className="size-12 mb-4" />
              <p className="text-lg font-medium">No repositories match your filters</p>
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
          onLogActivity={onLogActivity}
        />
      )}
    </div>
  );
}
