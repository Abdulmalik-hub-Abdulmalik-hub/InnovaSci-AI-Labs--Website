"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { StatCard } from "@/components/ui/StatCard";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Badge } from "@/components/ui/Badge";

interface JobListing {
  id: string;
  title: string;
  department: string;
  type: string;
  level: string;
  status: string;
  applicants: number;
}

interface JobApplication {
  id: string;
  listingId: string;
  applicantName: string;
  email: string;
  status: string;
  appliedAt: string;
}

interface Interview {
  id: string;
  applicationId: string;
  type: string;
  scheduledAt: string;
  status: string;
}

export default function HRDashboard() {
  const [listings, setListings] = useState<JobListing[]>([]);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newListing, setNewListing] = useState({
    title: "",
    department: "Engineering",
    type: "FULL_TIME",
    level: "MID",
    description: "",
    requirements: "",
    salaryMin: "",
    salaryMax: "",
    location: "",
    remote: true,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [listingsRes, applicationsRes, interviewsRes] = await Promise.all([
          fetch("/api/job-listings"),
          fetch("/api/applications"),
          fetch("/api/interviews"),
        ]);
        if (listingsRes.ok) setListings(await listingsRes.json());
        if (applicationsRes.ok) setApplications(await applicationsRes.json());
        if (interviewsRes.ok) setInterviews(await interviewsRes.json());
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleCreateListing = async () => {
    if (!newListing.title || !newListing.description) return;
    
    try {
      const res = await fetch("/api/job-listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newListing,
          salaryMin: newListing.salaryMin ? parseFloat(newListing.salaryMin) : null,
          salaryMax: newListing.salaryMax ? parseFloat(newListing.salaryMax) : null,
        }),
      });
      
      if (res.ok) {
        const listing = await res.json();
        setListings([listing, ...listings]);
        setShowForm(false);
        setNewListing({
          title: "",
          department: "Engineering",
          type: "FULL_TIME",
          level: "MID",
          description: "",
          requirements: "",
          salaryMin: "",
          salaryMax: "",
          location: "",
          remote: true,
        });
      }
    } catch (error) {
      console.error("Failed to create listing:", error);
    }
  };

  const handleUpdateApplicationStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/applications/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      
      if (res.ok) {
        setApplications(applications.map(a => a.id === id ? { ...a, status } : a));
      }
    } catch (error) {
      console.error("Failed to update application:", error);
    }
  };

  if (loading) {
    return <div className="text-gray-400">Loading...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">HR Dashboard</h1>
          <p className="text-gray-400 mt-1">Workforce management and recruitment</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cancel" : "Create Listing"}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Active Listings"
          value={listings.filter(l => l.status === "OPEN").length}
          change="Open positions"
          changeType="positive"
        />
        <StatCard
          title="Total Applicants"
          value={applications.length}
          change="All time"
        />
        <StatCard
          title="In Interview"
          value={interviews.filter(i => i.status === "SCHEDULED").length}
        />
        <StatCard
          title="Offers Extended"
          value={applications.filter(a => a.status === "OFFER").length}
          changeType="positive"
        />
      </div>

      {showForm && (
        <Card title="Create Job Listing" description="Post a new position">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Job Title"
              value={newListing.title}
              onChange={(e) => setNewListing({ ...newListing, title: e.target.value })}
              placeholder="e.g., Senior AI Engineer"
            />
            <Select
              label="Department"
              value={newListing.department}
              onChange={(e) => setNewListing({ ...newListing, department: e.target.value })}
              options={[
                { value: "Engineering", label: "Engineering" },
                { value: "Research", label: "Research" },
                { value: "Product", label: "Product" },
                { value: "Data Science", label: "Data Science" },
                { value: "Operations", label: "Operations" },
              ]}
            />
            <Select
              label="Employment Type"
              value={newListing.type}
              onChange={(e) => setNewListing({ ...newListing, type: e.target.value })}
              options={[
                { value: "FULL_TIME", label: "Full Time" },
                { value: "PART_TIME", label: "Part Time" },
                { value: "CONTRACT", label: "Contract" },
                { value: "INTERNSHIP", label: "Internship" },
              ]}
            />
            <Select
              label="Level"
              value={newListing.level}
              onChange={(e) => setNewListing({ ...newListing, level: e.target.value })}
              options={[
                { value: "JUNIOR", label: "Junior" },
                { value: "MID", label: "Mid" },
                { value: "SENIOR", label: "Senior" },
                { value: "LEAD", label: "Lead" },
                { value: "EXECUTIVE", label: "Executive" },
              ]}
            />
            <Input
              label="Salary Min"
              type="number"
              value={newListing.salaryMin}
              onChange={(e) => setNewListing({ ...newListing, salaryMin: e.target.value })}
              placeholder="80000"
            />
            <Input
              label="Salary Max"
              type="number"
              value={newListing.salaryMax}
              onChange={(e) => setNewListing({ ...newListing, salaryMax: e.target.value })}
              placeholder="120000"
            />
            <Input
              label="Location"
              value={newListing.location}
              onChange={(e) => setNewListing({ ...newListing, location: e.target.value })}
              placeholder="San Francisco, CA"
            />
            <div className="md:col-span-2">
              <Textarea
                label="Description"
                value={newListing.description}
                onChange={(e) => setNewListing({ ...newListing, description: e.target.value })}
                placeholder="Job description"
              />
            </div>
            <div className="md:col-span-2">
              <Textarea
                label="Requirements (comma-separated)"
                value={newListing.requirements}
                onChange={(e) => setNewListing({ ...newListing, requirements: e.target.value })}
                placeholder="5+ years experience, PhD preferred, etc."
              />
            </div>
          </div>
          <div className="mt-4">
            <Button onClick={handleCreateListing}>Create Listing</Button>
          </div>
        </Card>
      )}

      <Card title="Job Listings" description="Current open positions">
        <div className="space-y-3">
          {listings.map((listing) => (
            <div key={listing.id} className="flex items-center justify-between p-4 bg-background rounded-lg">
              <div>
                <h4 className="text-white font-medium">{listing.title}</h4>
                <p className="text-sm text-gray-400">
                  {listing.department} | {listing.type} | {listing.level}
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <Badge variant={listing.status === "OPEN" ? "success" : "default"}>
                  {listing.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card title="Recent Applications" description="Applicant tracking">
        <div className="space-y-3">
          {applications.slice(0, 10).map((app) => (
            <div key={app.id} className="flex items-center justify-between p-4 bg-background rounded-lg">
              <div>
                <h4 className="text-white font-medium">{app.applicantName}</h4>
                <p className="text-sm text-gray-400">{app.email}</p>
              </div>
              <div className="flex items-center space-x-3">
                <Select
                  value={app.status}
                  onChange={(e) => handleUpdateApplicationStatus(app.id, e.target.value)}
                  options={[
                    { value: "APPLIED", label: "Applied" },
                    { value: "SCREENING", label: "Screening" },
                    { value: "INTERVIEW", label: "Interview" },
                    { value: "OFFER", label: "Offer" },
                    { value: "REJECTED", label: "Rejected" },
                  ]}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}