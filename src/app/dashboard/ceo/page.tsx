"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { StatCard } from "@/components/ui/StatCard";

interface Project {
  id: string;
  name: string;
  status: string;
  budget: number;
  spentBudget: number;
  progress: number;
}

interface Publication {
  id: string;
  title: string;
  status: string;
}

interface BudgetAllocation {
  id: string;
  department: string;
  allocated: number;
  spent: number;
}

export default function CEODashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [publications, setPublications] = useState<Publication[]>([]);
  const [budgets, setBudgets] = useState<BudgetAllocation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectsRes, pubsRes, budgetsRes] = await Promise.all([
          fetch("/api/projects"),
          fetch("/api/publications"),
          fetch("/api/budgets"),
        ]);
        
        if (projectsRes.ok) setProjects(await projectsRes.json());
        if (pubsRes.ok) setPublications(await pubsRes.json());
        if (budgetsRes.ok) setBudgets(await budgetsRes.json());
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const totalStaff = 127;
  const activeResearchBudget = projects.reduce((sum, p) => sum + p.budget, 0);
  const publishedPapers = publications.filter(p => p.status === "PUBLISHED").length;

  if (loading) {
    return <div className="text-gray-400">Loading...</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Executive Dashboard</h1>
        <p className="text-gray-400 mt-1">Organizational overview and key metrics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="Total Staff"
          value={totalStaff}
          change="+12 this quarter"
          changeType="positive"
        />
        <StatCard
          title="Active Research Budget"
          value={`$${(activeResearchBudget / 1000000).toFixed(1)}M`}
          change={`${projects.length} active projects`}
          changeType="positive"
        />
        <StatCard
          title="Publications"
          value={publishedPapers}
          change={`${publications.length} total papers`}
          changeType="positive"
        />
      </div>

      <Card title="Project Progress" description="Active research projects and completion status">
        <div className="space-y-4">
          {projects.map((project) => (
            <div key={project.id} className="p-4 bg-background rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-white font-medium">{project.name}</h4>
                <span className={`text-sm ${
                  project.status === "ACTIVE" ? "text-success" : "text-gray-400"
                }`}>
                  {project.status}
                </span>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex-1 h-2 bg-surface rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-accent-blue"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
                <span className="text-sm text-gray-400 w-12">{project.progress}%</span>
              </div>
              <div className="mt-2 flex justify-between text-sm text-gray-500">
                <span>Budget: ${project.budget.toLocaleString()}</span>
                <span>Spent: ${project.spentBudget.toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card title="Budget Allocation by Department" description="Fiscal year spending overview">
        <div className="space-y-4">
          {budgets.map((budget) => {
            const percentage = budget.allocated > 0 ? (budget.spent / budget.allocated) * 100 : 0;
            return (
              <div key={budget.id} className="p-4 bg-background rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white font-medium">{budget.department}</span>
                  <span className="text-sm text-gray-400">
                    ${budget.spent.toLocaleString()} / ${budget.allocated.toLocaleString()}
                  </span>
                </div>
                <div className="h-2 bg-surface rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${percentage > 90 ? "bg-error" : percentage > 70 ? "bg-warning" : "bg-success"}`}
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}