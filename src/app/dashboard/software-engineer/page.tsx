"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { StatCard } from "@/components/ui/StatCard";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Badge } from "@/components/ui/Badge";

interface APIEndpoint {
  id: string;
  path: string;
  method: string;
  status: string;
  responseTime: number | null;
  errorRate: number;
}

interface SystemError {
  id: string;
  errorType: string;
  message: string;
  resolved: boolean;
  occurredAt: string;
}

interface Product {
  id: string;
  name: string;
  version: string;
  status: string;
}

export default function SoftwareEngineerDashboard() {
  const [endpoints, setEndpoints] = useState<APIEndpoint[]>([]);
  const [errors, setErrors] = useState<SystemError[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [endpointsRes, errorsRes, productsRes] = await Promise.all([
          fetch("/api/endpoints"),
          fetch("/api/errors"),
          fetch("/api/products"),
        ]);
        if (endpointsRes.ok) setEndpoints(await endpointsRes.json());
        if (errorsRes.ok) setErrors(await errorsRes.json());
        if (productsRes.ok) setProducts(await productsRes.json());
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSitemapGeneration = async () => {
    try {
      const res = await fetch("/api/sitemap/generate", { method: "POST" });
      if (res.ok) {
        alert("Sitemap generation triggered successfully!");
      }
    } catch (error) {
      console.error("Failed to generate sitemap:", error);
    }
  };

  const handleSystemCheck = async () => {
    try {
      const res = await fetch("/api/health", { method: "POST" });
      if (res.ok) {
        alert("System health check completed!");
      }
    } catch (error) {
      console.error("Failed to run system check:", error);
    }
  };

  if (loading) {
    return <div className="text-gray-400">Loading...</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Software Engineer</h1>
        <p className="text-gray-400 mt-1">API monitoring and system management</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="API Endpoints"
          value={endpoints.length}
          change={`${endpoints.filter(e => e.status === "ACTIVE").length} active`}
        />
        <StatCard
          title="System Errors"
          value={errors.filter(e => !e.resolved).length}
          change="Unresolved"
          changeType="negative"
        />
        <StatCard
          title="Products"
          value={products.length}
          change={`${products.filter(p => p.status === "ACTIVE").length} live`}
          changeType="positive"
        />
        <StatCard
          title="Avg Response Time"
          value={`${Math.round(endpoints.reduce((sum, e) => sum + (e.responseTime || 0), 0) / endpoints.length)}ms`}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card title="System Actions" description="Trigger administrative tasks">
          <div className="space-y-4">
            <div className="p-4 bg-background rounded-lg">
              <h4 className="text-white font-medium mb-2">Sitemap Generation</h4>
              <p className="text-sm text-gray-400 mb-4">Generate and update the sitemap.xml for SEO</p>
              <Button onClick={handleSitemapGeneration}>Generate Sitemap</Button>
            </div>
            <div className="p-4 bg-background rounded-lg">
              <h4 className="text-white font-medium mb-2">System Health Check</h4>
              <p className="text-sm text-gray-400 mb-4">Run comprehensive system diagnostics</p>
              <Button onClick={handleSystemCheck}>Run Health Check</Button>
            </div>
          </div>
        </Card>

        <Card title="API Endpoints" description="Monitor API path status">
          <div className="space-y-3">
            {endpoints.map((endpoint) => (
              <div key={endpoint.id} className="flex items-center justify-between p-3 bg-background rounded-md">
                <div className="flex items-center space-x-3">
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                    endpoint.method === "GET" ? "bg-success/20 text-success" :
                    endpoint.method === "POST" ? "bg-accent-blue/20 text-accent-blue" :
                    "bg-warning/20 text-warning"
                  }`}>
                    {endpoint.method}
                  </span>
                  <span className="text-white text-sm">{endpoint.path}</span>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-400">{endpoint.responseTime}ms</span>
                  <Badge variant={endpoint.status === "ACTIVE" ? "success" : "warning"}>
                    {endpoint.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card title="System Errors" description="Recent error reports">
        <div className="space-y-3">
          {errors.filter(e => !e.resolved).map((error) => (
            <div key={error.id} className="flex items-center justify-between p-3 bg-background rounded-md">
              <div>
                <p className="text-white font-medium">{error.errorType}</p>
                <p className="text-sm text-gray-500">{error.message}</p>
              </div>
              <span className="text-xs text-gray-500">
                {new Date(error.occurredAt).toLocaleString()}
              </span>
            </div>
          ))}
          {errors.filter(e => !e.resolved).length === 0 && (
            <p className="text-gray-500 text-center py-4">No unresolved errors</p>
          )}
        </div>
      </Card>

      <Card title="Product Versions" description="Software release tracking">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {products.map((product) => (
            <div key={product.id} className="p-4 bg-background rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-white font-medium">{product.name}</h4>
                <Badge variant={product.status === "ACTIVE" ? "success" : "warning"}>
                  v{product.version}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}