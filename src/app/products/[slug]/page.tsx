import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export const revalidate = 60;

async function getProduct(slug: string) {
  return db.product.findUnique({
    where: { slug },
    include: { versions: { orderBy: { releasedAt: "desc" } } },
  });
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    notFound();
  }

  const features = JSON.parse(product.features || "[]");
  const parameters = JSON.parse(product.parameters || "{}");
  const pricing = product.pricing ? JSON.parse(product.pricing) : null;

  return (
    <div className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <Link href="/products" className="text-accent-cyan hover:underline mb-8 inline-block">
          ← Back to Products
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-surface border border-border-subtle rounded-lg p-8">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold text-white">{product.name}</h1>
                <span className={`px-3 py-1 rounded text-sm ${
                  product.status === "ACTIVE" ? "bg-success/20 text-success" :
                  product.status === "BETA" ? "bg-warning/20 text-warning" :
                  "bg-gray-600/20 text-gray-400"
                }`}>
                  {product.status}
                </span>
              </div>
              
              <div className="flex items-center space-x-4 mb-6">
                <span className="px-3 py-1 bg-accent-blue/20 text-accent-blue rounded">{product.category}</span>
                <span className="text-gray-400">Version {product.version}</span>
              </div>

              <p className="text-gray-300 text-lg mb-8">{product.description}</p>

              {features.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-white mb-4">Features</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {features.map((feature: string, i: number) => (
                      <div key={i} className="flex items-center bg-background rounded-lg p-3">
                        <span className="w-2 h-2 bg-accent-teal rounded-full mr-3" />
                        <span className="text-gray-300">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {product.documentation && (
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-white mb-4">Documentation</h3>
                  <div className="bg-background rounded-lg p-4">
                    <p className="text-gray-400">{product.documentation}</p>
                  </div>
                </div>
              )}

              {Object.keys(parameters).length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold text-white mb-4">Technical Specifications</h3>
                  <div className="bg-background rounded-lg p-4">
                    <div className="grid grid-cols-2 gap-4">
                      {Object.entries(parameters).map(([key, value]) => (
                        <div key={key}>
                          <p className="text-xs text-gray-500 uppercase">{key}</p>
                          <p className="text-white font-medium">{String(value)}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            {pricing && (
              <div className="bg-surface border border-border-subtle rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Pricing</h3>
                <div className="space-y-3">
                  {Object.entries(pricing).map(([tier, details]: [string, any]) => (
                    <div key={tier} className="bg-background rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-white font-medium">{tier}</span>
                        <span className="text-accent-cyan text-lg">{details.price}</span>
                      </div>
                      <p className="text-sm text-gray-500">{details.period}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {product.versions.length > 0 && (
              <div className="bg-surface border border-border-subtle rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Version History</h3>
                <div className="space-y-3">
                  {product.versions.map((version) => (
                    <div key={version.id} className="bg-background rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <span className="text-white font-medium">v{version.version}</span>
                        <span className="text-xs text-gray-500">
                          {new Date(version.releasedAt).toLocaleDateString()}
                        </span>
                      </div>
                      {version.changelog && (
                        <p className="text-sm text-gray-400 mt-2">{version.changelog}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}