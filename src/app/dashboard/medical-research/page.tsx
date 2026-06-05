"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { StatCard } from "@/components/ui/StatCard";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";

interface ClinicalStudy {
  id: string;
  name: string;
  status: string;
  phase: string;
  participants: number;
}

interface MedicalPublication {
  id: string;
  title: string;
  journal: string | null;
  year: number | null;
}

export default function MedicalResearchDashboard() {
  const [studies, setStudies] = useState<ClinicalStudy[]>([]);
  const [publications, setPublications] = useState<MedicalPublication[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newStudy, setNewStudy] = useState({
    name: "",
    description: "",
    phase: "Phase I",
    participants: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [studiesRes, pubsRes] = await Promise.all([
          fetch("/api/clinical-studies"),
          fetch("/api/publications"),
        ]);
        if (studiesRes.ok) setStudies(await studiesRes.json());
        if (pubsRes.ok) setPublications(await pubsRes.json());
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleCreateStudy = async () => {
    if (!newStudy.name || !newStudy.participants) return;
    
    try {
      const res = await fetch("/api/clinical-studies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newStudy,
          participants: parseInt(newStudy.participants),
        }),
      });
      
      if (res.ok) {
        const study = await res.json();
        setStudies([study, ...studies]);
        setShowForm(false);
        setNewStudy({ name: "", description: "", phase: "Phase I", participants: "" });
      }
    } catch (error) {
      console.error("Failed to create study:", error);
    }
  };

  if (loading) {
    return <div className="text-gray-400">Loading...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Medical Research</h1>
          <p className="text-gray-400 mt-1">Clinical models and drug discovery</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cancel" : "Add Study"}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Active Studies"
          value={studies.filter(s => s.status === "ACTIVE").length}
          change="Clinical trials"
          changeType="positive"
        />
        <StatCard
          title="Total Participants"
          value={studies.reduce((sum, s) => sum + s.participants, 0)}
        />
        <StatCard
          title="Medical Papers"
          value={publications.length}
        />
        <StatCard
          title="Drug Discovery Projects"
          value={3}
        />
      </div>

      {showForm && (
        <Card title="Add Clinical Study" description="Register a new clinical study">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Study Name"
              value={newStudy.name}
              onChange={(e) => setNewStudy({ ...newStudy, name: e.target.value })}
              placeholder="Clinical study name"
            />
            <Select
              label="Phase"
              value={newStudy.phase}
              onChange={(e) => setNewStudy({ ...newStudy, phase: e.target.value })}
              options={[
                { value: "Phase I", label: "Phase I" },
                { value: "Phase II", label: "Phase II" },
                { value: "Phase III", label: "Phase III" },
                { value: "Phase IV", label: "Phase IV" },
              ]}
            />
            <Input
              label="Participants"
              type="number"
              value={newStudy.participants}
              onChange={(e) => setNewStudy({ ...newStudy, participants: e.target.value })}
              placeholder="Number of participants"
            />
            <div className="md:col-span-2">
              <Textarea
                label="Description"
                value={newStudy.description}
                onChange={(e) => setNewStudy({ ...newStudy, description: e.target.value })}
                placeholder="Study description"
              />
            </div>
          </div>
          <div className="mt-4">
            <Button onClick={handleCreateStudy}>Add Study</Button>
          </div>
        </Card>
      )}

      <Card title="Clinical Studies" description="Active medical research studies">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {studies.map((study) => (
            <div key={study.id} className="p-4 bg-background rounded-lg">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="text-white font-medium">{study.name}</h4>
                  <p className="text-sm text-gray-400">{study.phase}</p>
                </div>
                <span className={`px-2 py-1 rounded text-xs ${
                  study.status === "ACTIVE" ? "bg-success/20 text-success" : "bg-gray-600/20 text-gray-400"
                }`}>
                  {study.status}
                </span>
              </div>
              <p className="text-sm text-gray-500 mb-3">Phase {study.phase} Clinical Trial</p>
              <div className="flex items-center justify-between text-sm">
                <span className="text-accent-cyan">{study.participants} participants</span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card title="Medical Publications" description="Recent peer-reviewed medical papers">
        <div className="space-y-3">
          {publications.slice(0, 5).map((pub) => (
            <div key={pub.id} className="p-3 bg-background rounded-md">
              <p className="text-white font-medium">{pub.title}</p>
              <p className="text-sm text-gray-500">{pub.journal || "Journal"} - {pub.year || "N/A"}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}