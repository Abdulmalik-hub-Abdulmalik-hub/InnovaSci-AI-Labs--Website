"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { StatCard } from "@/components/ui/StatCard";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Badge } from "@/components/ui/Badge";

interface AIModel {
  id: string;
  name: string;
  version: string;
  status: string;
  parameters: number;
  benchmarks: string;
}

interface TrainingRun {
  id: string;
  modelId: string;
  status: string;
  datasetSize: number;
  metrics: string | null;
  createdAt: string;
}

export default function AIEngineerDashboard() {
  const [models, setModels] = useState<AIModel[]>([]);
  const [trainingRuns, setTrainingRuns] = useState<TrainingRun[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newModel, setNewModel] = useState({
    name: "",
    version: "1.0.0",
    description: "",
    status: "TRAINING",
    parameters: "",
    contextWindow: "8192",
    capabilities: "[]",
    benchmarks: "{}",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [modelsRes, runsRes] = await Promise.all([
          fetch("/api/models"),
          fetch("/api/training-runs"),
        ]);
        if (modelsRes.ok) setModels(await modelsRes.json());
        if (runsRes.ok) setTrainingRuns(await runsRes.json());
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleRegisterModel = async () => {
    if (!newModel.name || !newModel.parameters) return;
    
    try {
      const res = await fetch("/api/models", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newModel,
          parameters: parseFloat(newModel.parameters),
          contextWindow: parseInt(newModel.contextWindow),
        }),
      });
      
      if (res.ok) {
        const model = await res.json();
        setModels([model, ...models]);
        setShowForm(false);
        setNewModel({
          name: "",
          version: "1.0.0",
          description: "",
          status: "TRAINING",
          parameters: "",
          contextWindow: "8192",
          capabilities: "[]",
          benchmarks: "{}",
        });
      }
    } catch (error) {
      console.error("Failed to register model:", error);
    }
  };

  const statusColors: Record<string, string> = {
    ACTIVE: "success",
    TRAINING: "warning",
    DEPRECATED: "error",
    QUEUED: "default",
    RUNNING: "info",
    COMPLETED: "success",
    FAILED: "error",
  };

  if (loading) {
    return <div className="text-gray-400">Loading...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">AI Engineer</h1>
          <p className="text-gray-400 mt-1">Model registry and training management</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cancel" : "Register Model"}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Registered Models"
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
          title="Avg Parameters"
          value={`${(models.reduce((sum, m) => sum + m.parameters, 0) / models.length || 0).toFixed(1)}B`}
        />
        <StatCard
          title="Completed Runs"
          value={trainingRuns.filter(r => r.status === "COMPLETED").length}
          changeType="positive"
        />
      </div>

      {showForm && (
        <Card title="Register New Model" description="Add a new AI model to the registry">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="Model Name"
              value={newModel.name}
              onChange={(e) => setNewModel({ ...newModel, name: e.target.value })}
              placeholder="e.g., InnovaSci Nova"
            />
            <Input
              label="Version"
              value={newModel.version}
              onChange={(e) => setNewModel({ ...newModel, version: e.target.value })}
              placeholder="1.0.0"
            />
            <Select
              label="Status"
              value={newModel.status}
              onChange={(e) => setNewModel({ ...newModel, status: e.target.value })}
              options={[
                { value: "TRAINING", label: "Training" },
                { value: "ACTIVE", label: "Active" },
                { value: "DEPRECATED", label: "Deprecated" },
              ]}
            />
            <Input
              label="Parameters (B)"
              type="number"
              value={newModel.parameters}
              onChange={(e) => setNewModel({ ...newModel, parameters: e.target.value })}
              placeholder="e.g., 7"
            />
            <Input
              label="Context Window (tokens)"
              type="number"
              value={newModel.contextWindow}
              onChange={(e) => setNewModel({ ...newModel, contextWindow: e.target.value })}
              placeholder="8192"
            />
            <div className="md:col-span-3">
              <Textarea
                label="Description"
                value={newModel.description}
                onChange={(e) => setNewModel({ ...newModel, description: e.target.value })}
                placeholder="Model capabilities and use cases"
              />
            </div>
          </div>
          <div className="mt-4">
            <Button onClick={handleRegisterModel}>Register Model</Button>
          </div>
        </Card>
      )}

      <Card title="Model Registry" description="All registered AI models">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border-subtle">
                <th className="text-left py-2 px-3 text-gray-400">Model</th>
                <th className="text-left py-2 px-3 text-gray-400">Version</th>
                <th className="text-left py-2 px-3 text-gray-400">Status</th>
                <th className="text-left py-2 px-3 text-gray-400">Parameters</th>
                <th className="text-left py-2 px-3 text-gray-400">Benchmarks</th>
              </tr>
            </thead>
            <tbody>
              {models.map((model) => {
                const benchmarks = JSON.parse(model.benchmarks || "{}");
                return (
                  <tr key={model.id} className="border-b border-border-subtle/50">
                    <td className="py-3 px-3">
                      <div className="text-white font-medium">{model.name}</div>
                    </td>
                    <td className="py-3 px-3 text-gray-400">v{model.version}</td>
                    <td className="py-3 px-3">
                      <Badge variant={statusColors[model.status] as any}>{model.status}</Badge>
                    </td>
                    <td className="py-3 px-3 text-gray-400">{model.parameters}B</td>
                    <td className="py-3 px-3">
                      <div className="flex gap-2">
                        {Object.entries(benchmarks).slice(0, 3).map(([key, value]) => (
                          <span key={key} className="text-xs bg-surface px-2 py-1 rounded">
                            {key}: {String(value)}
                          </span>
                        ))}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      <Card title="Training Runs" description="Recent model training activities">
        <div className="space-y-3">
          {trainingRuns.map((run) => {
            const model = models.find(m => m.id === run.modelId);
            return (
              <div key={run.id} className="flex items-center justify-between p-3 bg-background rounded-md">
                <div>
                  <p className="text-white font-medium">{model?.name || "Unknown Model"}</p>
                  <p className="text-sm text-gray-500">
                    Dataset: {run.datasetSize.toLocaleString()} samples - {new Date(run.createdAt).toLocaleString()}
                  </p>
                </div>
                <Badge variant={statusColors[run.status] as any}>{run.status}</Badge>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}