import { prisma } from "@/lib/prisma";

export const revalidate = 60;

async function getPublications() {
  return prisma.publication.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export default async function PublicationsPage() {
  const publications = await getPublications();

  return (
    <div className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Publications</h1>
          <p className="text-gray-400 text-lg">
            Peer-reviewed research papers and academic publications
          </p>
        </div>

        {publications.length > 0 ? (
          <div className="space-y-6">
            {publications.map((pub) => {
              const authors = JSON.parse(pub.authors || "[]");
              const keywords = JSON.parse(pub.keywords || "[]");
              
              return (
                <div key={pub.id} className="bg-surface border border-border-subtle rounded-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-2">{pub.title}</h3>
                      {pub.journal && (
                        <p className="text-accent-purple text-sm">{pub.journal}</p>
                      )}
                    </div>
                    <span className={`px-3 py-1 rounded text-sm ${
                      pub.status === "PUBLISHED" ? "bg-success/20 text-success" :
                      pub.status === "SUBMITTED" ? "bg-warning/20 text-warning" :
                      "bg-gray-600/20 text-gray-400"
                    }`}>
                      {pub.status}
                    </span>
                  </div>
                  
                  <p className="text-gray-300 mb-4">{pub.abstract}</p>
                  
                  {authors.length > 0 && (
                    <div className="mb-4">
                      <p className="text-xs text-gray-500 mb-1">Authors</p>
                      <p className="text-gray-400 text-sm">{authors.join(", ")}</p>
                    </div>
                  )}
                  
                  {keywords.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {keywords.map((keyword: string, i: number) => (
                        <span key={i} className="text-xs bg-accent-blue/20 text-accent-blue px-2 py-1 rounded">
                          {keyword}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between border-t border-border-subtle pt-4">
                    <div className="flex items-center space-x-4">
                      {pub.year && <span className="text-sm text-gray-500">{pub.year}</span>}
                      {pub.doi && (
                        <a href={`https://doi.org/${pub.doi}`} target="_blank" rel="noopener noreferrer" className="text-accent-cyan text-sm hover:underline">
                          DOI: {pub.doi}
                        </a>
                      )}
                    </div>
                    {pub.pdfUrl && (
                      <a href={pub.pdfUrl} target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-accent-blue text-white text-sm rounded hover:bg-accent-blue/90">
                        Download PDF
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20">
            <svg className="w-16 h-16 text-gray-600 mx-auto mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <h3 className="text-xl text-white mb-2">No publications yet</h3>
            <p className="text-gray-500">Check back soon for our latest research papers</p>
          </div>
        )}
      </div>
    </div>
  );
}