"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { StatCard } from "@/components/ui/StatCard";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Badge } from "@/components/ui/Badge";

interface Dataset {
  id: string;
  name: string;
  size: string;
  licenseType: string;
  storageLocation: string;
  format: string | null;
  domain: string | null;
}

export default function DataScientistDashboard() {
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newDataset, setNewDataset] = useState({
    name: "",
    description: "",
    size: "",
    licenseType: "MIT",
    storageLocation: "",
    format: "",
    domain: "",
  });

  useEffect(() => {
    fetchDatasets();
  }, []);

  const fetchDatasets = async () => {
    try {
      const res = await fetch("/api/datasets");
      if (res.ok) setDatasets(await res.json());
    } catch (error) {
      console.error("Failed to fetch datasets:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadDataset = async () => {
    if (!newDataset.name || !newDataset.size || !newDataset.storageLocation) return;
    
    try {
      const res = await fetch("/api/datasets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newDataset),
      });
      
      if (res.ok) {
        const dataset = await res.json();
        setDatasets([dataset, ...datasets]);
        setShowForm(false);
        setNewDataset({
          name: "",
          description: "",
          size: "",
          licenseType: "MIT",
          storageLocation: "",
          format: "",
          domain: "",
        });
      }
    } catch (error) {
      console.error("Failed to upload dataset:", error);
    }
  };

  const totalSize = datasets.reduce((sum, d) => {
    const match = d.size.match(/(\d+)/);
    return sum + (match ? parseInt(match[1]) : 0);
  }, 0);

  if (loading) {
    return <div className="text-gray-400">Loading...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Data Scientist</h1>
          <p className="text-gray-400 mt-1">Dataset management and documentation</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cancel" : "Upload Dataset"}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Total Datasets"
          value={datasets.length}
          change="Registered"
        />
        <StatCard
          title="Total Size"
          value={`${totalSize}GB`}
          change="Approximate"
        />
        <StatCard
          title="License Types"
          value={new Set(datasets.map(d => d.licenseType)).size}
        />
        <StatCard
          title="Domains"
          value={new Set(datasets.map(d => d.domain).filter(Boolean)).size}
        />
      </div>

      {showForm && (
        <Card title="Upload Dataset Metadata" description="Register a new dataset in the catalog">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Dataset Name"
              value={newDataset.name}
              onChange={(e) => setNewDataset({ ...newDataset, name: e.target.value })}
              placeholder="e.g., ImageNet-2K"
            />
            <Input
              label="Size"
              value={newDataset.size}
              onChange={(e) => setNewDataset({ ...newDataset, size: e.target.value })}
              placeholder="e.g., 500GB"
            />
            <Select
              label="License Type"
              value={newDataset.licenseType}
              onChange={(e) => setNewDataset({ ...newDataset, licenseType: e.target.value })}
              options={[
                { value: "MIT", label: "MIT License" },
                { value: "Apache 2.0", label: "Apache 2.0" },
                { value: "CC BY 4.0", label: "CC BY 4.0" },
                { value: "CC0 1.0", label: "CC0 1.0 (Public Domain)" },
                { value: "Proprietary", label: "Proprietary" },
                { value: "Custom", label: "Custom License" },
              ]}
            />
            <Select
              label="Format"
              value={newDataset.format}
              onChange={(e) => setNewDataset({ ...newDataset, format: e.target.value })}
              options={[
                { value: "", label: "Select format..." },
                { value: "JSON", label: "JSON" },
                { value: "CSV", label: "CSV" },
                { value: "Parquet", label: "Parquet" },
                { value: "HDF5", label: "HDF5" },
                { value: "Image", label: "Images" },
                { value: "Video", label: "Video" },
                { value: "Audio", label: "Audio" },
                { value: "Mixed", label: "Mixed" },
              ]}
            />
            <Input
              label="Storage Location"
              value={newDataset.storageLocation}
              onChange={(e) => setNewDataset({ ...newDataset, storageLocation: e.target.value })}
              placeholder="s3://bucket/path or /data/datasets/name"
            />
            <Select
              label="Domain"
              value={newDataset.domain}
              onChange={(e) => setNewDataset({ ...newDataset, domain: e.target.value })}
              options={[
                { value: "", label: "Select domain..." },
                { value: "Computer Vision", label: "Computer Vision" },
                { value: "Natural Language", label: "Natural Language Processing" },
                { value: "Audio", label: "Audio/Speech" },
                { value: "Medical", label: "Medical/Healthcare" },
                { value: "Scientific", label: "Scientific Research" },
                { value: "General", label: "General" },
              ]}
            />
            <div className="md:col-span-2">
              <Textarea
                label="Description"
                value={newDataset.description}
                onChange={(e) => setNewDataset({ ...newDataset, description: e.target.value })}
                placeholder="Dataset description, collection methodology, and intended use cases"
              />
            </div>
          </div>
          <div className="mt-4">
            <Button onClick={handleUploadDataset}>Upload Dataset Metadata</Button>
          </div>
        </Card>
      )}

      <Card title="Dataset Registry" description="All available datasets">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border-subtle">
                <th className="text-left py-2 px-3 text-gray-400">Name</th>
                <th className="text-left py-2 px-3 text-gray-400">Size</th>
                <th className="text-left py-2 px-3 text-gray-400">License</th>
                <th className="text-left py-2 px-3 text-gray-400">Format</th>
                <th className="text-left py-2 px-3 text-gray-400">Domain</th>
              </tr>
            </thead>
            <tbody>
              {datasets.map((dataset) => (
                <tr key={dataset.id} className="border-b border-border-subtle/50">
                  <td className="py-3 px-3">
                    <div className="text-white font-medium">{dataset.name}</div>
                    <div className="text-xs text-gray-500 truncate max-w-xs">{dataset.storageLocation}</div>
                  </td>
                  <td className="py-3 px-3 text-gray-400">{dataset.size}</td>
                  <td className="py-3 px-3">
                    <Badge variant="info">{dataset.licenseType}</Badge>
                  </td>
                  <td className="py-3 px-3 text-gray-400">{dataset.format || "-"}</td>
                  <td className="py-3 px-3 text-gray-400">{dataset.domain || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}