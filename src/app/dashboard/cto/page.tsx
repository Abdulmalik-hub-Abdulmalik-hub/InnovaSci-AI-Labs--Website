"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { StatCard } from "@/components/ui/StatCard";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Badge } from "@/components/ui/Badge";

interface AIModel {
  id: string;
  name: string;
  version: string;
  status: string;
  parameters: number;
  contextWindow: number;
}

interface TrainingRun {
  id: string;
  modelId: string;
  status: string;
  duration: number | null;
  createdAt: string;
}

interface ComputeResource {
  id: string;
  name: string;
  type: string;
  provider: string;
  status: string;
  costPerHour: number | null;
}

export default function CTODashboard() {
  const [models, setModels] = useState<AIModel[]>([]);
  const [trainingRuns, setTrainingRuns] = useState<TrainingRun[]>([]);
  const [compute, setCompute] = useState<ComputeResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [modelUpdate, setModelUpdate] = useState({ id: "", status: "" });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [modelsRes, runsRes, computeRes] = await Promise.all([
          fetch("/api/models"),
          fetch("/api/training-runs"),
          fetch("/api/compute"),
        ]);
        
        if (modelsRes.ok) setModels(await modelsRes.json());
        if (runsRes.ok) setTrainingRuns(await runsRes.json());
        if (computeRes.ok) setCompute(await computeRes.json());
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleUpdateModelStatus = async () => {
    if (!modelUpdate.id || !modelUpdate.status) return;
    
    try {
      const res = await fetch(`/api/models/${modelUpdate.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: modelUpdate.status }),
      });
      
      if (res.ok) {
        setModels(models.map(m => 
          m.id === modelUpdate.id ? { ...m, status: modelUpdate.status } : m
        ));
        setModelUpdate({ id: "", status: "" });
      }
    } catch (error) {
      console.error("Failed to update model:", error);
    }
  };

  const statusColors: Record<string, string> = {
    ACTIVE: "success",
    TRAINING: "warning",
    DEPRECATED: "error",
    ARCHIVED: "default",
  };

  if (loading) {
    return <div className="text-gray-400">Loading...</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">CTO Dashboard</h1>
        <p className="text-gray-400 mt-1">AI infrastructure and model management</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Total Models"
          value={models.length}
          change={`${models.filter(m => m.status === "ACTIVE").length} active`}
          changeType="positive"
        />
        <StatCard
          title="Training Runs"
          value={trainingRuns.length}
          change={`${trainingRuns.filter(r => r.status === "RUNNING").length} running`}
        />
        <StatCard
          title="Compute Resources"
          value={compute.length}
          change={`${compute.filter(c => c.status === "IN_USE").length} in use`}
        />
        <StatCard
          title="Avg Parameters"
          value={`${(models.reduce((sum, m) => sum + m.parameters, 0) / models.length || 0).toFixed(1)}B`}
        />
      </div>

      <Card title="Model Registry" description="All AI models and their current status">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border-subtle">
                <th className="text-left py-2 px-3 text-gray-400">Model</th>
                <th className="text-left py-2 px-3 text-gray-400">Version</th>
                <th className="text-left py-2 px-3 text-gray-400">Status</th>
                <th className="text-left py-2 px-3 text-gray-400">Parameters</th>
                <th className="text-left py-2 px-3 text-gray-400">Context Window</th>
              </tr>
            </thead>
            <tbody>
              {models.map((model) => (
                <tr key={model.id} className="border-b border-border-subtle/50">
                  <td className="py-2 px-3 text-white font-medium">{model.name}</td>
                  <td className="py-2 px-3 text-gray-400">v{model.version}</td>
                  <td className="py-2 px-3">
                    <Badge variant={statusColors[model.status] as any}>{model.status}</Badge>
                  </td>
                  <td className="py-2 px-3 text-gray-400">{model.parameters}B</td>
                  <td className="py-2 px-3 text-gray-400">{model.contextWindow.toLocaleString()} tokens</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card title="Update Model Status" description="Modify AI model operational status">
          <div className="space-y-4">
            <Select
              label="Select Model"
              value={modelUpdate.id}
              onChange={(e) => setModelUpdate({ ...modelUpdate, id: e.target.value })}
              options={[
                { value: "", label: "Choose a model..." },
                ...models.map(m => ({ value: m.id, label: m.name }))
              ]}
            />
            <Select
              label="New Status"
              value={modelUpdate.status}
              onChange={(e) => setModelUpdate({ ...modelUpdate, status: e.target.value })}
              options={[
                { value: "", label: "Choose status..." },
                { value: "ACTIVE", label: "Active" },
                { value: "TRAINING", label: "Training" },
                { value: "DEPRECATED", label: "Deprecated" },
                { value: "ARCHIVED", label: "Archived" },
              ]}
            />
            <Button onClick={handleUpdateModelStatus} disabled={!modelUpdate.id || !modelUpdate.status}>
              Update Status
            </Button>
          </div>
        </Card>

        <Card title="Compute Resources" description="Infrastructure status">
          <div className="space-y-3">
            {compute.map((resource) => (
              <div key={resource.id} className="flex items-center justify-between p-3 bg-background rounded-md">
                <div>
                  <p className="text-white font-medium">{resource.name}</p>
                  <p className="text-sm text-gray-400">{resource.type} - {resource.provider}</p>
                </div>
                <Badge variant={resource.status === "IN_USE" ? "warning" : "success"}>
                  {resource.status}
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card title="Recent Training Runs" description="Latest model training activities">
        <div className="space-y-3">
          {trainingRuns.slice(0, 5).map((run) => (
            <div key={run.id} className="flex items-center justify-between p-3 bg-background rounded-md">
              <div>
                <p className="text-white">Training Run</p>
                <p className="text-sm text-gray-500">{new Date(run.createdAt).toLocaleString()}</p>
              </div>
              <Badge variant={run.status === "COMPLETED" ? "success" : run.status === "RUNNING" ? "warning" : "default"}>
                {run.status}
              </Badge>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}