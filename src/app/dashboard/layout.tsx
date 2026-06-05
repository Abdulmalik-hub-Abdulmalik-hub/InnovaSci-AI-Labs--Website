"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

const dashboardLinks = [
  { name: "Super Admin", href: "/dashboard/super-admin", roles: ["SUPER_ADMIN"] },
  { name: "CEO", href: "/dashboard/ceo", roles: ["SUPER_ADMIN", "CEO"] },
  { name: "CTO", href: "/dashboard/cto", roles: ["SUPER_ADMIN", "CTO"] },
  { name: "Research Director", href: "/dashboard/research-director", roles: ["SUPER_ADMIN", "RESEARCH_DIRECTOR"] },
  { name: "Scientific Research", href: "/dashboard/scientific-research", roles: ["SUPER_ADMIN", "RESEARCH_DIRECTOR", "DATA_SCIENTIST"] },
  { name: "Medical Research", href: "/dashboard/medical-research", roles: ["SUPER_ADMIN", "RESEARCH_DIRECTOR"] },
  { name: "AI Engineer", href: "/dashboard/ai-engineer", roles: ["SUPER_ADMIN", "CTO", "AI_ENGINEER"] },
  { name: "Software Engineer", href: "/dashboard/software-engineer", roles: ["SUPER_ADMIN", "CTO", "SOFTWARE_ENGINEER"] },
  { name: "Data Scientist", href: "/dashboard/data-scientist", roles: ["SUPER_ADMIN", "DATA_SCIENTIST"] },
  { name: "HR", href: "/dashboard/hr", roles: ["SUPER_ADMIN", "HR_MANAGER"] },
  { name: "Finance", href: "/dashboard/finance", roles: ["SUPER_ADMIN", "FINANCE_MANAGER"] },
  { name: "Content", href: "/dashboard/content", roles: ["SUPER_ADMIN", "CONTENT_MANAGER"] },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session } = useSession();

  const visibleLinks = dashboardLinks.filter(
    (link) => session?.user?.role && link.roles.includes(session.user.role)
  );

  return (
    <div className="flex min-h-[calc(100vh-64px)]">
      <aside className="w-64 bg-surface border-r border-border-subtle flex-shrink-0">
        <div className="p-4">
          <h2 className="text-lg font-semibold text-white mb-4">Dashboards</h2>
          <nav className="space-y-1">
            {visibleLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`block px-4 py-2 rounded-md text-sm transition-colors ${
                  pathname === link.href
                    ? "bg-accent-blue text-white"
                    : "text-gray-400 hover:bg-surface-hover hover:text-white"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>
        
        <div className="absolute bottom-4 left-4 right-4">
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="w-full px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-surface-hover rounded-md"
          >
            Sign Out
          </button>
        </div>
      </aside>
      
      <div className="flex-1 p-8 overflow-y-auto">
        {children}
      </div>
    </div>
  );
}