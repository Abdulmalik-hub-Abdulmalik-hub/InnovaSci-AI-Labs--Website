import { prisma } from "@/lib/prisma";

export const revalidate = 60;

async function getEvents() {
  return prisma.event.findMany({
    where: { status: { in: ["SCHEDULED", "ONGOING"] } },
    orderBy: { startDate: "asc" },
  });
}

export default async function EventsPage() {
  const events = await getEvents();

  return (
    <div className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Events Hub</h1>
          <p className="text-gray-400 text-lg">
            Upcoming conferences, workshops, and academic presentations
          </p>
        </div>

        {events.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event: any) => (
              <div key={event.id} className="bg-surface border border-border-subtle rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className={`px-2 py-1 rounded text-xs ${
                    event.type === "CONFERENCE" ? "bg-accent-purple/20 text-accent-purple" :
                    event.type === "WORKSHOP" ? "bg-accent-blue/20 text-accent-blue" :
                    event.type === "WEBINAR" ? "bg-accent-teal/20 text-accent-teal" :
                    "bg-accent-cyan/20 text-accent-cyan"
                  }`}>
                    {event.type}
                  </span>
                  <span className="text-xs bg-success/20 text-success px-2 py-1 rounded">
                    {event.status}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{event.title}</h3>
                <p className="text-gray-400 text-sm mb-4">{event.description}</p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>{new Date(event.startDate).toLocaleDateString()}</span>
                  {event.location && <span>{event.location}</span>}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <svg className="w-16 h-16 text-gray-600 mx-auto mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            <h3 className="text-xl text-white mb-2">No upcoming events</h3>
            <p className="text-gray-500">Check back soon for upcoming events</p>
          </div>
        )}
      </div>
    </div>
  );
}