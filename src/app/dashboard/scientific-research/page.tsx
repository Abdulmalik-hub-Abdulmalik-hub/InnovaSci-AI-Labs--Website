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
  domain: string | null;
}

interface Publication {
  id: string;
  title: string;
  status: string;
  year: number | null;
}

export default function ScientificResearchDashboard() {
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [publications, setPublications] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDatasetForm, setShowDatasetForm] = useState(false);
  const [showPublicationForm, setShowPublicationForm] = useState(false);
  const [newDataset, setNewDataset] = useState({
    name: "",
    description: "",
    size: "",
    licenseType: "MIT",
    storageLocation: "",
    domain: "",
  });
  const [newPublication, setNewPublication] = useState({
    title: "",
    abstract: "",
    authors: "",
    keywords: "",
    status: "DRAFT",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [datasetsRes, pubsRes] = await Promise.all([
          fetch("/api/datasets"),
          fetch("/api/publications"),
        ]);
        if (datasetsRes.ok) setDatasets(await datasetsRes.json());
        if (pubsRes.ok) setPublications(await pubsRes.json());
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleCreateDataset = async () => {
    if (!newDataset.name || !newDataset.size) return;
    
    try {
      const res = await fetch("/api/datasets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newDataset),
      });
      
      if (res.ok) {
        const dataset = await res.json();
        setDatasets([dataset, ...datasets]);
        setShowDatasetForm(false);
        setNewDataset({ name: "", description: "", size: "", licenseType: "MIT", storageLocation: "", domain: "" });
      }
    } catch (error) {
      console.error("Failed to create dataset:", error);
    }
  };

  const handleCreatePublication = async () => {
    if (!newPublication.title || !newPublication.abstract) return;
    
    try {
      const res = await fetch("/api/publications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPublication),
      });
      
      if (res.ok) {
        const publication = await res.json();
        setPublications([publication, ...publications]);
        setShowPublicationForm(false);
        setNewPublication({ title: "", abstract: "", authors: "", keywords: "", status: "DRAFT" });
      }
    } catch (error) {
      console.error("Failed to create publication:", error);
    }
  };

  if (loading) {
    return <div className="text-gray-400">Loading...</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Scientific Research</h1>
        <p className="text-gray-400 mt-1">Interdisciplinary research workspace</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Datasets"
          value={datasets.length}
          change="Available for research"
        />
        <StatCard
          title="Publications"
          value={publications.length}
          change={`${publications.filter(p => p.status === "PUBLISHED").length} published`}
          changeType="positive"
        />
        <StatCard
          title="Draft Papers"
          value={publications.filter(p => p.status === "DRAFT").length}
        />
        <StatCard
          title="Research Domains"
          value={new Set(datasets.map(d => d.domain).filter(Boolean)).size}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card 
          title="Datasets" 
          description="Research datasets and documentation"
          action={
            <Button size="sm" onClick={() => setShowDatasetForm(!showDatasetForm)}>
              {showDatasetForm ? "Cancel" : "Upload Dataset"}
            </Button>
          }
        >
          {showDatasetForm && (
            <div className="mb-6 p-4 bg-background rounded-lg space-y-4">
              <Input
                label="Dataset Name"
                value={newDataset.name}
                onChange={(e) => setNewDataset({ ...newDataset, name: e.target.value })}
                placeholder="e.g., Medical Image Dataset v2"
              />
              <Textarea
                label="Description"
                value={newDataset.description}
                onChange={(e) => setNewDataset({ ...newDataset, description: e.target.value })}
                placeholder="Dataset description"
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Size"
                  value={newDataset.size}
                  onChange={(e) => setNewDataset({ ...newDataset, size: e.target.value })}
                  placeholder="e.g., 500GB"
                />
                <Select
                  label="License"
                  value={newDataset.licenseType}
                  onChange={(e) => setNewDataset({ ...newDataset, licenseType: e.target.value })}
                  options={[
                    { value: "MIT", label: "MIT" },
                    { value: "Apache 2.0", label: "Apache 2.0" },
                    { value: "CC BY 4.0", label: "CC BY 4.0" },
                    { value: "Proprietary", label: "Proprietary" },
                  ]}
                />
              </div>
              <Input
                label="Storage Location"
                value={newDataset.storageLocation}
                onChange={(e) => setNewDataset({ ...newDataset, storageLocation: e.target.value })}
                placeholder="s3://bucket/path"
              />
              <Button onClick={handleCreateDataset}>Upload Dataset</Button>
            </div>
          )}
          
          <div className="space-y-3">
            {datasets.map((dataset) => (
              <div key={dataset.id} className="p-3 bg-background rounded-md">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-medium">{dataset.name}</p>
                    <p className="text-sm text-gray-500">{dataset.size} - {dataset.licenseType}</p>
                  </div>
                  <Badge variant="info">{dataset.domain || "General"}</Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card 
          title="Publications" 
          description="Research papers and drafts"
          action={
            <Button size="sm" onClick={() => setShowPublicationForm(!showPublicationForm)}>
              {showPublicationForm ? "Cancel" : "New Paper"}
            </Button>
          }
        >
          {showPublicationForm && (
            <div className="mb-6 p-4 bg-background rounded-lg space-y-4">
              <Input
                label="Title"
                value={newPublication.title}
                onChange={(e) => setNewPublication({ ...newPublication, title: e.target.value })}
                placeholder="Publication title"
              />
              <Textarea
                label="Abstract"
                value={newPublication.abstract}
                onChange={(e) => setNewPublication({ ...newPublication, abstract: e.target.value })}
                placeholder="Paper abstract"
              />
              <Input
                label="Authors (comma-separated)"
                value={newPublication.authors}
                onChange={(e) => setNewPublication({ ...newPublication, authors: e.target.value })}
                placeholder="John Doe, Jane Smith"
              />
              <Input
                label="Keywords (comma-separated)"
                value={newPublication.keywords}
                onChange={(e) => setNewPublication({ ...newPublication, keywords: e.target.value })}
                placeholder="machine learning, AI, neural networks"
              />
              <Button onClick={handleCreatePublication}>Create Publication</Button>
            </div>
          )}
          
          <div className="space-y-3">
            {publications.map((pub) => (
              <div key={pub.id} className="p-3 bg-background rounded-md">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-medium">{pub.title}</p>
                    <p className="text-sm text-gray-500">Year: {pub.year || "N/A"}</p>
                  </div>
                  <Badge variant={pub.status === "PUBLISHED" ? "success" : pub.status === "SUBMITTED" ? "warning" : "default"}>
                    {pub.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}