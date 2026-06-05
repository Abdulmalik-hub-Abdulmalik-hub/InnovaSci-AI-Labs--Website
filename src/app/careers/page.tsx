"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";

export default function CareersPage() {
  const [showApplication, setShowApplication] = useState(false);
  const [application, setApplication] = useState({
    listingId: "",
    applicantName: "",
    email: "",
    phone: "",
    coverLetter: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(application),
      });
      
      if (res.ok) {
        setSubmitted(true);
        setApplication({ listingId: "", applicantName: "", email: "", phone: "", coverLetter: "" });
      }
    } catch (error) {
      console.error("Failed to submit application:", error);
    }
  };

  return (
    <div className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Careers at InnovaSci AI Labs</h1>
          <p className="text-gray-400 text-lg">
            Join our team of world-class researchers and engineers pushing the boundaries of AI
          </p>
        </div>

        {/* Open Positions */}
        <div className="mb-16">
          <h2 className="text-2xl font-semibold text-white mb-6">Open Positions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { id: "1", title: "Senior AI Engineer", department: "AI Research", type: "FULL_TIME", level: "SENIOR" },
              { id: "2", title: "Research Scientist - NLP", department: "Research", type: "FULL_TIME", level: "SENIOR" },
              { id: "3", title: "Machine Learning Engineer", department: "AI Research", type: "FULL_TIME", level: "MID" },
              { id: "4", title: "Data Scientist", department: "Data Science", type: "FULL_TIME", level: "MID" },
              { id: "5", title: "Software Engineer - Platform", department: "Engineering", type: "FULL_TIME", level: "MID" },
              { id: "6", title: "Research Intern", department: "Research", type: "INTERNSHIP", level: "JUNIOR" },
            ].map((job) => (
              <div key={job.id} className="bg-surface border border-border-subtle rounded-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">{job.title}</h3>
                  <span className="bg-success/20 text-success px-2 py-1 rounded text-xs">OPEN</span>
                </div>
                <div className="flex items-center space-x-4 text-sm text-gray-400 mb-4">
                  <span>{job.department}</span>
                  <span>•</span>
                  <span>{job.type.replace("_", " ")}</span>
                  <span>•</span>
                  <span>{job.level}</span>
                </div>
                <Button size="sm" onClick={() => {
                  setShowApplication(true);
                  setApplication({ ...application, listingId: job.id });
                }}>
                  Apply Now
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Application Form */}
        {showApplication && (
          <div className="bg-surface border border-border-subtle rounded-lg p-8 max-w-2xl">
            <h2 className="text-2xl font-semibold text-white mb-6">Submit Application</h2>
            
            {submitted ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl text-white mb-2">Application Submitted!</h3>
                <p className="text-gray-400">We will review your application and get back to you soon.</p>
                <Button className="mt-4" onClick={() => { setShowApplication(false); setSubmitted(false); }}>
                  Submit Another
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="Full Name"
                  value={application.applicantName}
                  onChange={(e) => setApplication({ ...application, applicantName: e.target.value })}
                  required
                />
                <Input
                  label="Email"
                  type="email"
                  value={application.email}
                  onChange={(e) => setApplication({ ...application, email: e.target.value })}
                  required
                />
                <Input
                  label="Phone"
                  type="tel"
                  value={application.phone}
                  onChange={(e) => setApplication({ ...application, phone: e.target.value })}
                />
                <Textarea
                  label="Cover Letter"
                  value={application.coverLetter}
                  onChange={(e) => setApplication({ ...application, coverLetter: e.target.value })}
                  placeholder="Tell us why you'd be a great fit for this role..."
                  required
                />
                <div className="flex space-x-4">
                  <Button type="submit">Submit Application</Button>
                  <Button type="button" variant="outline" onClick={() => setShowApplication(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}