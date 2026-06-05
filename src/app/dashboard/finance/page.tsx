"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { StatCard } from "@/components/ui/StatCard";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";

interface BudgetAllocation {
  id: string;
  department: string;
  fiscalYear: number;
  allocated: number;
  spent: number;
  category: string;
}

interface Grant {
  id: string;
  name: string;
  funder: string;
  amount: number;
  status: string;
}

export default function FinanceDashboard() {
  const [budgets, setBudgets] = useState<BudgetAllocation[]>([]);
  const [grants, setGrants] = useState<Grant[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newBudget, setNewBudget] = useState({
    department: "AI Research",
    fiscalYear: new Date().getFullYear(),
    allocated: "",
    category: "RESEARCH",
    notes: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [budgetsRes, grantsRes] = await Promise.all([
          fetch("/api/budgets"),
          fetch("/api/grants"),
        ]);
        if (budgetsRes.ok) setBudgets(await budgetsRes.json());
        if (grantsRes.ok) setGrants(await grantsRes.json());
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleCreateBudget = async () => {
    if (!newBudget.allocated) return;
    
    try {
      const res = await fetch("/api/budgets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newBudget,
          allocated: parseFloat(newBudget.allocated),
        }),
      });
      
      if (res.ok) {
        const budget = await res.json();
        setBudgets([budget, ...budgets]);
        setShowForm(false);
        setNewBudget({
          department: "AI Research",
          fiscalYear: new Date().getFullYear(),
          allocated: "",
          category: "RESEARCH",
          notes: "",
        });
      }
    } catch (error) {
      console.error("Failed to create budget:", error);
    }
  };

  const totalAllocated = budgets.reduce((sum, b) => sum + b.allocated, 0);
  const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0);
  const activeGrants = grants.filter(g => g.status === "ACTIVE").length;

  if (loading) {
    return <div className="text-gray-400">Loading...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Finance Dashboard</h1>
          <p className="text-gray-400 mt-1">Budget allocation and fiscal analytics</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cancel" : "Update Budget"}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Total Allocated"
          value={`$${(totalAllocated / 1000000).toFixed(2)}M`}
          change="This fiscal year"
          changeType="positive"
        />
        <StatCard
          title="Total Spent"
          value={`$${(totalSpent / 1000000).toFixed(2)}M`}
          change={`${Math.round((totalSpent / totalAllocated) * 100)}% utilized`}
        />
        <StatCard
          title="Active Grants"
          value={activeGrants}
          change={`$${(grants.filter(g => g.status === "ACTIVE").reduce((sum, g) => sum + g.amount, 0) / 1000000).toFixed(1)}M`}
          changeType="positive"
        />
        <StatCard
          title="Remaining"
          value={`$${((totalAllocated - totalSpent) / 1000000).toFixed(2)}M`}
        />
      </div>

      {showForm && (
        <Card title="Update Budget Allocation" description="Modify department budget">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select
              label="Department"
              value={newBudget.department}
              onChange={(e) => setNewBudget({ ...newBudget, department: e.target.value })}
              options={[
                { value: "AI Research", label: "AI Research" },
                { value: "Medical AI", label: "Medical AI" },
                { value: "Infrastructure", label: "Infrastructure" },
                { value: "Operations", label: "Operations" },
                { value: "HR", label: "Human Resources" },
              ]}
            />
            <Select
              label="Category"
              value={newBudget.category}
              onChange={(e) => setNewBudget({ ...newBudget, category: e.target.value })}
              options={[
                { value: "RESEARCH", label: "Research" },
                { value: "OPERATIONS", label: "Operations" },
                { value: "INFRASTRUCTURE", label: "Infrastructure" },
                { value: "PERSONNEL", label: "Personnel" },
              ]}
            />
            <Input
              label="Allocated Amount"
              type="number"
              value={newBudget.allocated}
              onChange={(e) => setNewBudget({ ...newBudget, allocated: e.target.value })}
              placeholder="500000"
            />
            <div className="md:col-span-3">
              <Textarea
                label="Notes"
                value={newBudget.notes}
                onChange={(e) => setNewBudget({ ...newBudget, notes: e.target.value })}
                placeholder="Budget justification and notes"
              />
            </div>
          </div>
          <div className="mt-4">
            <Button onClick={handleCreateBudget}>Update Budget</Button>
          </div>
        </Card>
      )}

      <Card title="Budget by Department" description="Fiscal year allocation breakdown">
        <div className="space-y-4">
          {budgets.map((budget) => {
            const percentage = budget.allocated > 0 ? (budget.spent / budget.allocated) * 100 : 0;
            return (
              <div key={budget.id} className="p-4 bg-background rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h4 className="text-white font-medium">{budget.department}</h4>
                    <p className="text-sm text-gray-400">{budget.category} - FY{budget.fiscalYear}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-accent-cyan">
                      ${budget.allocated.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-400">
                      Spent: ${budget.spent.toLocaleString()} ({percentage.toFixed(0)}%)
                    </p>
                  </div>
                </div>
                <div className="h-3 bg-surface rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${
                      percentage > 90 ? "bg-error" : 
                      percentage > 70 ? "bg-warning" : 
                      "bg-accent-teal"
                    }`}
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      <Card title="Research Grants" description="Active funding sources">
        <div className="space-y-3">
          {grants.map((grant) => (
            <div key={grant.id} className="flex items-center justify-between p-4 bg-background rounded-lg">
              <div>
                <h4 className="text-white font-medium">{grant.name}</h4>
                <p className="text-sm text-gray-400">{grant.funder}</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-accent-blue">
                  ${grant.amount.toLocaleString()}
                </p>
                <span className={`text-xs px-2 py-0.5 rounded ${
                  grant.status === "ACTIVE" ? "bg-success/20 text-success" : "bg-gray-600/20 text-gray-400"
                }`}>
                  {grant.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}