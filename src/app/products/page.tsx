import Link from "next/link";
import { db } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export const revalidate = 60;

async function getProducts() {
  return db.product.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <div className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Products & Platforms</h1>
          <p className="text-gray-400 text-lg">
            Discover our suite of AI-powered tools and development platforms
          </p>
        </div>

        {products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => {
              const features = JSON.parse(product.features || "[]");
              
              return (
                <Link key={product.id} href={`/products/${product.slug}`} className="bg-surface border border-border-subtle rounded-lg p-6 hover:border-accent-blue/50 transition-colors group">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-white group-hover:text-accent-cyan transition-colors">{product.name}</h3>
                    <span className={`px-2 py-1 rounded text-xs ${
                      product.status === "ACTIVE" ? "bg-success/20 text-success" :
                      product.status === "BETA" ? "bg-warning/20 text-warning" :
                      "bg-gray-600/20 text-gray-400"
                    }`}>
                      {product.status}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm mb-4">{product.description}</p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs bg-accent-blue/20 text-accent-blue px-2 py-1 rounded">{product.category}</span>
                    <span className="text-accent-cyan text-sm">v{product.version}</span>
                  </div>

                  {features.length > 0 && (
                    <div className="border-t border-border-subtle pt-4">
                      <p className="text-xs text-gray-500 mb-2">Key Features</p>
                      <div className="space-y-1">
                        {features.slice(0, 3).map((feature: string, i: number) => (
                          <div key={i} className="flex items-center text-sm text-gray-400">
                            <span className="w-1.5 h-1.5 bg-accent-teal rounded-full mr-2" />
                            {feature}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20">
            <svg className="w-16 h-16 text-gray-600 mx-auto mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <path d="M3 9h18M9 21V9" />
            </svg>
            <h3 className="text-xl text-white mb-2">No products available</h3>
            <p className="text-gray-500">Check back soon for our latest offerings</p>
          </div>
        )}
      </div>
    </div>
  );
}