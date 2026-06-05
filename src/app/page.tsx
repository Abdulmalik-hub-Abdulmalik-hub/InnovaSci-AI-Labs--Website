import Link from "next/link";
import { db } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export const revalidate = 60;

async function getFeaturedData() {
  const [models, publications, products] = await Promise.all([
    db.aIModel.findMany({
      where: { status: "ACTIVE" },
      take: 3,
      orderBy: { createdAt: "desc" },
    }),
    db.publication.findMany({
      where: { status: "PUBLISHED" },
      take: 3,
      orderBy: { createdAt: "desc" },
    }),
    db.product.findMany({
      where: { status: "ACTIVE" },
      take: 4,
      orderBy: { createdAt: "desc" },
    }),
  ]);
  return { models, publications, products };
}

export default async function HomePage() {
  const { models, publications, products } = await getFeaturedData();

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 px-4">
        <div className="absolute inset-0 bg-gradient-to-br from-accent-blue/10 via-transparent to-accent-purple/10" />
        <div className="max-w-7xl mx-auto relative">
          <div className="text-center max-w-3xl mx-auto">
            <div className="flex justify-center mb-6">
              <svg className="w-20 h-20 text-accent-blue" viewBox="0 0 32 32" fill="none">
                <path d="M16 2L4 8v16l12 6 12-6V8L16 2z" stroke="currentColor" strokeWidth="2" fill="none" />
                <circle cx="16" cy="16" r="4" fill="currentColor" />
                <path d="M16 12v-6M16 26v-6M12 16H6M26 16h-6" stroke="currentColor" strokeWidth="2" />
                <circle cx="10" cy="10" r="2" fill="currentColor" opacity="0.6" />
                <circle cx="22" cy="22" r="2" fill="currentColor" opacity="0.6" />
              </svg>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Pioneering the Future of{' '}
              <span className="text-accent-cyan">Artificial Intelligence</span>
            </h1>
            <p className="text-xl text-gray-400 mb-8 leading-relaxed">
              InnovaSci AI Labs is at the forefront of AI research, developing groundbreaking 
              models and systems that push the boundaries of machine intelligence.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/research"
                className="px-8 py-3 bg-accent-blue text-white font-medium rounded-md hover:bg-accent-blue/90 transition-colors"
              >
                Explore Research
              </Link>
              <Link
                href="/models"
                className="px-8 py-3 border border-border-subtle text-white font-medium rounded-md hover:bg-surface-hover transition-colors"
              >
                View Models
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Models */}
      <section className="py-16 px-4 bg-surface">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-white">Foundation Models</h2>
              <p className="text-gray-400 mt-1">State-of-the-art AI models powering innovation</p>
            </div>
            <Link href="/models" className="text-accent-cyan hover:underline">
              View all →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {models.length > 0 ? models.map((model) => (
              <div key={model.id} className="bg-background border border-border-subtle rounded-lg p-6 hover:border-accent-blue/50 transition-colors">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">{model.name}</h3>
                  <span className="text-xs bg-success/20 text-success px-2 py-1 rounded">v{model.version}</span>
                </div>
                <p className="text-gray-400 text-sm mb-4 line-clamp-2">{model.description}</p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-accent-cyan">{model.parameters}B parameters</span>
                  <span className="text-gray-500">{model.contextWindow.toLocaleString()} tokens</span>
                </div>
              </div>
            )) : (
              <div className="col-span-3 text-center py-12 text-gray-500">
                No models available yet
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Featured Publications */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-white">Latest Publications</h2>
              <p className="text-gray-400 mt-1">Peer-reviewed research from our labs</p>
            </div>
            <Link href="/publications" className="text-accent-cyan hover:underline">
              View all →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {publications.length > 0 ? publications.map((pub) => (
              <div key={pub.id} className="bg-surface border border-border-subtle rounded-lg p-6">
                <span className="text-xs text-accent-purple mb-2 block">{pub.journal || "Research Paper"}</span>
                <h3 className="text-lg font-semibold text-white mb-2">{pub.title}</h3>
                <p className="text-gray-400 text-sm line-clamp-3">{pub.abstract}</p>
                {pub.year && <p className="text-sm text-gray-500 mt-4">{pub.year}</p>}
              </div>
            )) : (
              <div className="col-span-3 text-center py-12 text-gray-500">
                No publications available yet
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="py-16 px-4 bg-surface">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-white">Our Products</h2>
              <p className="text-gray-400 mt-1">Tools and platforms for AI development</p>
            </div>
            <Link href="/products" className="text-accent-cyan hover:underline">
              View all →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.length > 0 ? products.map((product) => (
              <Link key={product.id} href={`/products/${product.slug}`} className="bg-background border border-border-subtle rounded-lg p-6 hover:border-accent-blue/50 transition-colors group">
                <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-accent-cyan transition-colors">{product.name}</h3>
                <p className="text-gray-400 text-sm mb-4 line-clamp-2">{product.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs bg-surface px-2 py-1 rounded">{product.category}</span>
                  <span className="text-accent-blue text-sm">v{product.version}</span>
                </div>
              </Link>
            )) : (
              <div className="col-span-4 text-center py-12 text-gray-500">
                No products available yet
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gradient-to-r from-accent-blue/20 to-accent-purple/20 border border-accent-blue/30 rounded-lg p-12 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Join Our Research Community</h2>
            <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
              Explore career opportunities and collaborate with world-leading researchers 
              on the next generation of AI systems.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/careers" className="px-8 py-3 bg-accent-blue text-white font-medium rounded-md hover:bg-accent-blue/90 transition-colors">
                View Open Positions
              </Link>
              <Link href="/research" className="px-8 py-3 border border-accent-cyan text-accent-cyan font-medium rounded-md hover:bg-accent-cyan/10 transition-colors">
                Explore Research
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
