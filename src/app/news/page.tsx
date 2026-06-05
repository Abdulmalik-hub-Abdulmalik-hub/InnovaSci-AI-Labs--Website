import { prisma } from "@/lib/prisma";

export const revalidate = 60;

async function getArticles() {
  return prisma.newsArticle.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { publishedAt: "desc" },
  });
}

export default async function NewsPage() {
  const articles = await getArticles();

  return (
    <div className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Newsroom</h1>
          <p className="text-gray-400 text-lg">
            Latest announcements, press releases, and company updates
          </p>
        </div>

        {articles.length > 0 ? (
          <div className="space-y-8">
            {articles.map((article) => (
              <div key={article.id} className="bg-surface border border-border-subtle rounded-lg p-8">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <span className="text-xs text-accent-cyan uppercase tracking-wide">
                      {article.category.replace("_", " ")}
                    </span>
                    <h2 className="text-2xl font-semibold text-white mt-2">{article.title}</h2>
                  </div>
                  {article.publishedAt && (
                    <span className="text-sm text-gray-500">
                      {new Date(article.publishedAt).toLocaleDateString()}
                    </span>
                  )}
                </div>
                {article.excerpt && (
                  <p className="text-gray-400 mb-4">{article.excerpt}</p>
                )}
                <p className="text-gray-300">{article.content}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <svg className="w-16 h-16 text-gray-600 mx-auto mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
            <h3 className="text-xl text-white mb-2">No news articles</h3>
            <p className="text-gray-500">Check back soon for the latest updates</p>
          </div>
        )}
      </div>
    </div>
  );
}