"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";

const navigation = [
  { name: "Home", href: "/" },
  { name: "Research", href: "/research" },
  { name: "Models", href: "/models" },
  { name: "Products", href: "/products" },
  { name: "Publications", href: "/publications" },
  { name: "Datasets", href: "/datasets" },
  { name: "Careers", href: "/careers" },
  { name: "News", href: "/news" },
];

export function Header() {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <header className="bg-surface border-b border-border-subtle sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center space-x-2">
              <svg className="w-8 h-8 text-accent-blue" viewBox="0 0 32 32" fill="none">
                <path d="M16 2L4 8v16l12 6 12-6V8L16 2z" stroke="currentColor" strokeWidth="2" fill="none" />
                <circle cx="16" cy="16" r="4" fill="currentColor" />
                <path d="M16 12v-6M16 26v-6M12 16H6M26 16h-6" stroke="currentColor" strokeWidth="2" />
                <circle cx="10" cy="10" r="2" fill="currentColor" opacity="0.6" />
                <circle cx="22" cy="22" r="2" fill="currentColor" opacity="0.6" />
              </svg>
              <span className="text-xl font-bold text-white">InnovaSci AI Labs</span>
            </Link>
            <nav className="hidden md:flex space-x-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`text-sm font-medium transition-colors ${
                    pathname === item.href
                      ? "text-accent-blue"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            {session ? (
              <>
                <Link
                  href="/dashboard/super-admin"
                  className="text-sm text-gray-400 hover:text-white"
                >
                  Dashboard
                </Link>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-300">{session.user?.name}</span>
                  <Badge variant="info">{session.user?.role}</Badge>
                </div>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="text-sm text-gray-400 hover:text-white"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="px-4 py-2 bg-accent-blue text-white text-sm font-medium rounded-md hover:bg-accent-blue/90"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

function Badge({ children, variant }: { children: React.ReactNode; variant: string }) {
  const variants: Record<string, string> = {
    info: "bg-accent-blue/20 text-accent-blue",
    success: "bg-success/20 text-success",
    warning: "bg-warning/20 text-warning",
    error: "bg-error/20 text-error",
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${variants[variant]}`}>
      {children}
    </span>
  );
}