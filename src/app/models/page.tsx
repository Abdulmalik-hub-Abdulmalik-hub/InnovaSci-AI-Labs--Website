import Link from "next/link";
import { db } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export const revalidate = 60;

async function getModels() {
  return db.aIModel.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export default async function ModelsPage() {
  const models = await getModels();

  return (
    <div className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">AI Models Catalog</h1>
          <p className="text-gray-400 text-lg">
            Explore our collection of foundation models and their capabilities
          </p>
        </div>

        {models.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {models.map((model: any) => {
              const capabilities = JSON.parse(model.capabilities || "[]");
              const benchmarks = JSON.parse(model.benchmarks || "{}");
              
              return (
                <div key={model.id} className="bg-surface border border-border-subtle rounded-lg p-6 hover:border-accent-blue/50 transition-colors">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-white">{model.name}</h3>
                    <span className={`px-2 py-1 rounded text-xs ${
                      model.status === "ACTIVE" ? "bg-success/20 text-success" :
                      model.status === "TRAINING" ? "bg-warning/20 text-warning" :
                      "bg-gray-600/20 text-gray-400"
                    }`}>
                      {model.status}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm mb-4">{model.description}</p>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-background rounded p-3">
                      <p className="text-xs text-gray-500">Parameters</p>
                      <p className="text-lg font-bold text-accent-cyan">{model.parameters}B</p>
                    </div>
                    <div className="bg-background rounded p-3">
                      <p className="text-xs text-gray-500">Context Window</p>
                      <p className="text-lg font-bold text-white">{model.contextWindow.toLocaleString()}</p>
                    </div>
                  </div>

                  {capabilities.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {capabilities.slice(0, 4).map((cap: string, i: number) => (
                        <span key={i} className="text-xs bg-accent-purple/20 text-accent-purple px-2 py-1 rounded">
                          {cap}
                        </span>
                      ))}
                    </div>
                  )}

                  {Object.keys(benchmarks).length > 0 && (
                    <div className="border-t border-border-subtle pt-4">
                      <p className="text-xs text-gray-500 mb-2">Benchmarks</p>
                      <div className="flex flex-wrap gap-2">
                        {Object.entries(benchmarks).slice(0, 3).map(([key, value]) => (
                          <span key={key} className="text-xs bg-surface px-2 py-1 rounded">
                            {key}: {String(value)}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20">
            <svg className="w-16 h-16 text-gray-600 mx-auto mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
            <h3 className="text-xl text-white mb-2">No models available</h3>
            <p className="text-gray-500">Check back soon for our latest AI models</p>
          </div>
        )}
      </div>
    </div>
  );
}