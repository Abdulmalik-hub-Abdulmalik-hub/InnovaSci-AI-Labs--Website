"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password");
        setLoading(false);
        return;
      }

      router.push("/dashboard/super-admin");
      router.refresh();
    } catch {
      setError("An error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <svg className="w-16 h-16 text-accent-blue" viewBox="0 0 32 32" fill="none">
              <path d="M16 2L4 8v16l12 6 12-6V8L16 2z" stroke="currentColor" strokeWidth="2" fill="none" />
              <circle cx="16" cy="16" r="4" fill="currentColor" />
              <path d="M16 12v-6M16 26v-6M12 16H6M26 16h-6" stroke="currentColor" strokeWidth="2" />
              <circle cx="10" cy="10" r="2" fill="currentColor" opacity="0.6" />
              <circle cx="22" cy="22" r="2" fill="currentColor" opacity="0.6" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white">Welcome Back</h1>
          <p className="text-gray-400 mt-2">Sign in to access InnovaSci AI Labs</p>
        </div>

        <Card>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 bg-error/10 border border-error/30 rounded-md text-error text-sm">
                {error}
              </div>
            )}
            
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@innovasci.ai"
              required
            />
            
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
            
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </Card>

        <div className="mt-8 p-4 bg-surface border border-border-subtle rounded-lg">
          <p className="text-sm text-gray-400 mb-3">Demo Accounts:</p>
          <div className="text-xs text-gray-500 space-y-1">
            <p>admin@innovasci.ai / AdminPassword2026!</p>
            <p>ceo@innovasci.ai / CeoPassword2026!</p>
            <p>visitor@innovasci.ai / VisitorPassword2026!</p>
          </div>
        </div>
      </div>
    </div>
  );
}