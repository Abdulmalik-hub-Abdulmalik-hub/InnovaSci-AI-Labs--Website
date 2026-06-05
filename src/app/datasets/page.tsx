import { db } from "@/lib/prisma";

export const dynamic = 'force-dynamic';
export const revalidate = 60;

async function getDatasets() {
  return db.dataset.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export default async function DatasetsPage() {
  const datasets = await getDatasets();

  return (
    <div className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Datasets Catalog</h1>
          <p className="text-gray-400 text-lg">
            Explore our collection of scientific datasets for research
          </p>
        </div>

        {datasets.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {datasets.map((dataset: any) => (
              <div key={dataset.id} className="bg-surface border border-border-subtle rounded-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">{dataset.name}</h3>
                  <span className="text-xs bg-accent-teal/20 text-accent-teal px-2 py-1 rounded">
                    {dataset.licenseType}
                  </span>
                </div>
                <p className="text-gray-400 text-sm mb-4">{dataset.description}</p>
                
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-background rounded p-3">
                    <p className="text-xs text-gray-500">Size</p>
                    <p className="text-white font-medium">{dataset.size}</p>
                  </div>
                  {dataset.format && (
                    <div className="bg-background rounded p-3">
                      <p className="text-xs text-gray-500">Format</p>
                      <p className="text-white font-medium">{dataset.format}</p>
                    </div>
                  )}
                </div>

                {dataset.domain && (
                  <span className="text-xs bg-accent-purple/20 text-accent-purple px-2 py-1 rounded">
                    {dataset.domain}
                  </span>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <svg className="w-16 h-16 text-gray-600 mx-auto mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
            </svg>
            <h3 className="text-xl text-white mb-2">No datasets available</h3>
            <p className="text-gray-500">Check back soon for our latest datasets</p>
          </div>
        )}
      </div>
    </div>
  );
}