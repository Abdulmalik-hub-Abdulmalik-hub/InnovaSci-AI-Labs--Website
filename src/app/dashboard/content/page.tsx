"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { StatCard } from "@/components/ui/StatCard";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Badge } from "@/components/ui/Badge";

interface NewsArticle {
  id: string;
  title: string;
  slug: string;
  category: string;
  status: string;
  publishedAt: string | null;
}

interface Event {
  id: string;
  title: string;
  type: string;
  location: string | null;
  startDate: string;
  status: string;
}

export default function ContentDashboard() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewsForm, setShowNewsForm] = useState(false);
  const [showEventForm, setShowEventForm] = useState(false);
  const [newArticle, setNewArticle] = useState({
    title: "",
    slug: "",
    content: "",
    excerpt: "",
    category: "ANNOUNCEMENT",
  });
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    type: "CONFERENCE",
    location: "",
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [articlesRes, eventsRes] = await Promise.all([
          fetch("/api/news"),
          fetch("/api/events"),
        ]);
        if (articlesRes.ok) setArticles(await articlesRes.json());
        if (eventsRes.ok) setEvents(await eventsRes.json());
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleCreateArticle = async () => {
    if (!newArticle.title || !newArticle.content) return;
    
    const slug = newArticle.slug || newArticle.title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    
    try {
      const res = await fetch("/api/news", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newArticle, slug }),
      });
      
      if (res.ok) {
        const article = await res.json();
        setArticles([article, ...articles]);
        setShowNewsForm(false);
        setNewArticle({ title: "", slug: "", content: "", excerpt: "", category: "ANNOUNCEMENT" });
      }
    } catch (error) {
      console.error("Failed to create article:", error);
    }
  };

  const handleCreateEvent = async () => {
    if (!newEvent.title || !newEvent.startDate) return;
    
    try {
      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newEvent),
      });
      
      if (res.ok) {
        const event = await res.json();
        setEvents([event, ...events]);
        setShowEventForm(false);
        setNewEvent({ title: "", description: "", type: "CONFERENCE", location: "", startDate: "", endDate: "" });
      }
    } catch (error) {
      console.error("Failed to create event:", error);
    }
  };

  const handlePublishArticle = async (id: string) => {
    try {
      const res = await fetch(`/api/news/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "PUBLISHED", publishedAt: new Date().toISOString() }),
      });
      
      if (res.ok) {
        setArticles(articles.map(a => a.id === id ? { ...a, status: "PUBLISHED" } : a));
      }
    } catch (error) {
      console.error("Failed to publish article:", error);
    }
  };

  if (loading) {
    return <div className="text-gray-400">Loading...</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Content Dashboard</h1>
        <p className="text-gray-400 mt-1">News, events, and media management</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="News Articles"
          value={articles.length}
          change={`${articles.filter(a => a.status === "PUBLISHED").length} published`}
          changeType="positive"
        />
        <StatCard
          title="Upcoming Events"
          value={events.filter(e => e.status === "SCHEDULED").length}
        />
        <StatCard
          title="Drafts"
          value={articles.filter(a => a.status === "DRAFT").length}
        />
        <StatCard
          title="Media Assets"
          value={5}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card 
          title="News Articles" 
          description="Press releases and announcements"
          action={
            <Button size="sm" onClick={() => setShowNewsForm(!showNewsForm)}>
              {showNewsForm ? "Cancel" : "New Article"}
            </Button>
          }
        >
          {showNewsForm && (
            <div className="mb-6 p-4 bg-background rounded-lg space-y-4">
              <Input
                label="Title"
                value={newArticle.title}
                onChange={(e) => setNewArticle({ ...newArticle, title: e.target.value })}
                placeholder="Article title"
              />
              <Input
                label="Slug (optional)"
                value={newArticle.slug}
                onChange={(e) => setNewArticle({ ...newArticle, slug: e.target.value })}
                placeholder="auto-generated-if-empty"
              />
              <Select
                label="Category"
                value={newArticle.category}
                onChange={(e) => setNewArticle({ ...newArticle, category: e.target.value })}
                options={[
                  { value: "PRESS_RELEASE", label: "Press Release" },
                  { value: "ANNOUNCEMENT", label: "Announcement" },
                  { value: "PARTNERSHIP", label: "Partnership" },
                  { value: "MILESTONE", label: "Milestone" },
                ]}
              />
              <Input
                label="Excerpt"
                value={newArticle.excerpt}
                onChange={(e) => setNewArticle({ ...newArticle, excerpt: e.target.value })}
                placeholder="Brief summary"
              />
              <Textarea
                label="Content"
                value={newArticle.content}
                onChange={(e) => setNewArticle({ ...newArticle, content: e.target.value })}
                placeholder="Full article content"
              />
              <Button onClick={handleCreateArticle}>Create Article</Button>
            </div>
          )}
          
          <div className="space-y-3">
            {articles.map((article) => (
              <div key={article.id} className="p-3 bg-background rounded-md">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-white font-medium">{article.title}</p>
                    <p className="text-sm text-gray-500">{article.category.replace("_", " ")}</p>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    <Badge variant={article.status === "PUBLISHED" ? "success" : article.status === "DRAFT" ? "warning" : "default"}>
                      {article.status}
                    </Badge>
                    {article.status === "DRAFT" && (
                      <Button size="sm" variant="outline" onClick={() => handlePublishArticle(article.id)}>
                        Publish
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card 
          title="Events" 
          description="Upcoming conferences and events"
          action={
            <Button size="sm" onClick={() => setShowEventForm(!showEventForm)}>
              {showEventForm ? "Cancel" : "Schedule Event"}
            </Button>
          }
        >
          {showEventForm && (
            <div className="mb-6 p-4 bg-background rounded-lg space-y-4">
              <Input
                label="Event Title"
                value={newEvent.title}
                onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                placeholder="Conference or event name"
              />
              <Select
                label="Type"
                value={newEvent.type}
                onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value })}
                options={[
                  { value: "CONFERENCE", label: "Conference" },
                  { value: "WORKSHOP", label: "Workshop" },
                  { value: "SEMINAR", label: "Seminar" },
                  { value: "WEBINAR", label: "Webinar" },
                  { value: "MEETUP", label: "Meetup" },
                ]}
              />
              <Input
                label="Location"
                value={newEvent.location}
                onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                placeholder="City, Country or Online"
              />
              <Input
                label="Start Date"
                type="datetime-local"
                value={newEvent.startDate}
                onChange={(e) => setNewEvent({ ...newEvent, startDate: e.target.value })}
              />
              <Input
                label="End Date (optional)"
                type="datetime-local"
                value={newEvent.endDate}
                onChange={(e) => setNewEvent({ ...newEvent, endDate: e.target.value })}
              />
              <Textarea
                label="Description"
                value={newEvent.description}
                onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                placeholder="Event description"
              />
              <Button onClick={handleCreateEvent}>Schedule Event</Button>
            </div>
          )}
          
          <div className="space-y-3">
            {events.map((event) => (
              <div key={event.id} className="p-3 bg-background rounded-md">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-white font-medium">{event.title}</p>
                    <p className="text-sm text-gray-500">
                      {event.type} | {event.location || "Online"} | {new Date(event.startDate).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge variant={event.status === "SCHEDULED" ? "info" : "default"}>
                    {event.status}
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