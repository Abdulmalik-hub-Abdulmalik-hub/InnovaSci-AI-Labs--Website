import { prisma } from "@/lib/prisma";

export const revalidate = 60;

async function getProjects() {
  return prisma.researchProject.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export default async function ResearchPage() {
  const projects = await getProjects();

  const departments = [...new Set(projects.map(p => p.department))];

  return (
    <div className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Research Hub</h1>
          <p className="text-gray-400 text-lg">
            Explore our active research initiatives across different departments
          </p>
        </div>

        {departments.length > 0 ? (
          <div className="space-y-12">
            {departments.map((dept) => {
              const deptProjects = projects.filter(p => p.department === dept);
              return (
                <div key={dept}>
                  <h2 className="text-2xl font-semibold text-white mb-6 pb-2 border-b border-border-subtle">
                    {dept}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {deptProjects.map((project: any) => (
                      <div key={project.id} className="bg-surface border border-border-subtle rounded-lg p-6">
                        <div className="flex items-start justify-between mb-4">
                          <h3 className="text-lg font-semibold text-white">{project.name}</h3>
                          <span className={`px-2 py-1 rounded text-xs ${
                            project.status === "ACTIVE" ? "bg-success/20 text-success" :
                            project.status === "PLANNING" ? "bg-accent-blue/20 text-accent-blue" :
                            project.status === "COMPLETED" ? "bg-gray-600/20 text-gray-400" :
                            "bg-warning/20 text-warning"
                          }`}>
                            {project.status}
                          </span>
                        </div>
                        <p className="text-gray-400 text-sm mb-4">{project.description}</p>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Budget: ${project.budget.toLocaleString()}</span>
                          <span className="text-accent-cyan">{project.progress}% complete</span>
                        </div>
                        <div className="mt-3 h-2 bg-background rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-accent-blue"
                            style={{ width: `${project.progress}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20">
            <svg className="w-16 h-16 text-gray-600 mx-auto mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            <h3 className="text-xl text-white mb-2">No research projects</h3>
            <p className="text-gray-500">Check back soon for our latest research initiatives</p>
          </div>
        )}
      </div>
    </div>
  );
}