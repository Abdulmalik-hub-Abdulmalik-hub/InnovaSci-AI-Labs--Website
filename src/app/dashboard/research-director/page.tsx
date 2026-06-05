"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { StatCard } from "@/components/ui/StatCard";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";

interface ResearchProject {
  id: string;
  name: string;
  description: string;
  status: string;
  department: string;
  budget: number;
  spentBudget: number;
  progress: number;
}

export default function ResearchDirectorDashboard() {
  const [projects, setProjects] = useState<ResearchProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newProject, setNewProject] = useState({
    name: "",
    description: "",
    department: "AI Research",
    budget: "",
    status: "PLANNING",
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await fetch("/api/projects");
      if (res.ok) setProjects(await res.json());
    } catch (error) {
      console.error("Failed to fetch projects:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async () => {
    if (!newProject.name || !newProject.budget) return;
    
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newProject,
          budget: parseFloat(newProject.budget),
          startDate: new Date().toISOString(),
        }),
      });
      
      if (res.ok) {
        const project = await res.json();
        setProjects([project, ...projects]);
        setShowForm(false);
        setNewProject({ name: "", description: "", department: "AI Research", budget: "", status: "PLANNING" });
      }
    } catch (error) {
      console.error("Failed to create project:", error);
    }
  };

  const departments = ["AI Research", "Medical AI", "Natural Language", "Computer Vision", "Robotics"];
  const statusColors: Record<string, string> = {
    PLANNING: "default",
    ACTIVE: "success",
    ON_HOLD: "warning",
    COMPLETED: "info",
    CANCELLED: "error",
  };

  if (loading) {
    return <div className="text-gray-400">Loading...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Research Director</h1>
          <p className="text-gray-400 mt-1">Research initiatives and department oversight</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cancel" : "New Project"}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Active Projects"
          value={projects.filter(p => p.status === "ACTIVE").length}
          change="In progress"
          changeType="positive"
        />
        <StatCard
          title="Total Budget"
          value={`$${(projects.reduce((sum, p) => sum + p.budget, 0) / 1000000).toFixed(1)}M`}
        />
        <StatCard
          title="Avg Progress"
          value={`${Math.round(projects.reduce((sum, p) => sum + p.progress, 0) / projects.length)}%`}
        />
        <StatCard
          title="Departments"
          value={departments.length}
        />
      </div>

      {showForm && (
        <Card title="Create Research Project" description="Initialize a new research initiative">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Project Name"
              value={newProject.name}
              onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
              placeholder="Enter project name"
            />
            <Select
              label="Department"
              value={newProject.department}
              onChange={(e) => setNewProject({ ...newProject, department: e.target.value })}
              options={departments.map(d => ({ value: d, label: d }))}
            />
            <Input
              label="Budget"
              type="number"
              value={newProject.budget}
              onChange={(e) => setNewProject({ ...newProject, budget: e.target.value })}
              placeholder="Enter budget amount"
            />
            <Select
              label="Initial Status"
              value={newProject.status}
              onChange={(e) => setNewProject({ ...newProject, status: e.target.value })}
              options={[
                { value: "PLANNING", label: "Planning" },
                { value: "ACTIVE", label: "Active" },
              ]}
            />
            <div className="md:col-span-2">
              <Textarea
                label="Description"
                value={newProject.description}
                onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                placeholder="Project description and objectives"
              />
            </div>
          </div>
          <div className="mt-4">
            <Button onClick={handleCreateProject}>Create Project</Button>
          </div>
        </Card>
      )}

      <Card title="Research Projects" description="All research initiatives by department">
        <div className="space-y-4">
          {projects.map((project) => (
            <div key={project.id} className="p-4 bg-background rounded-lg">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h4 className="text-white font-medium">{project.name}</h4>
                    <span className={`px-2 py-0.5 rounded text-xs ${
                      project.status === "ACTIVE" ? "bg-success/20 text-success" :
                      project.status === "PLANNING" ? "bg-gray-600/20 text-gray-400" :
                      "bg-warning/20 text-warning"
                    }`}>
                      {project.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400 mb-3">{project.description}</p>
                  <div className="flex items-center space-x-6 text-sm">
                    <span className="text-gray-500">Dept: {project.department}</span>
                    <span className="text-gray-500">Budget: ${project.budget.toLocaleString()}</span>
                    <span className="text-gray-500">Spent: ${project.spentBudget.toLocaleString()}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-bold text-accent-blue">{project.progress}%</span>
                </div>
              </div>
              <div className="mt-3 h-2 bg-surface rounded-full overflow-hidden">
                <div 
                  className="h-full bg-accent-blue"
                  style={{ width: `${project.progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}