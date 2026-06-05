"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { StatCard } from "@/components/ui/StatCard";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string | null;
  createdAt: string;
}

interface AuditLog {
  id: string;
  action: string;
  entityType: string;
  details: string | null;
  createdAt: string;
  user: { name: string };
}

interface SystemSetting {
  key: string;
  value: string;
  description: string | null;
}

export default function SuperAdminPage() {
  const { data: session } = useSession();
  const [users, setUsers] = useState<User[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [settings, setSettings] = useState<SystemSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [newSetting, setNewSetting] = useState({ key: "", value: "", description: "" });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [usersRes, logsRes, settingsRes] = await Promise.all([
        fetch("/api/users"),
        fetch("/api/audit-logs"),
        fetch("/api/settings"),
      ]);
      
      if (usersRes.ok) setUsers(await usersRes.json());
      if (logsRes.ok) setAuditLogs(await logsRes.json());
      if (settingsRes.ok) setSettings(await settingsRes.json());
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSetting = async () => {
    if (!newSetting.key || !newSetting.value) return;
    
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSetting),
      });
      
      if (res.ok) {
        setNewSetting({ key: "", value: "", description: "" });
        fetchData();
      }
    } catch (error) {
      console.error("Failed to add setting:", error);
    }
  };

  const roleColors: Record<string, string> = {
    SUPER_ADMIN: "info",
    CEO: "success",
    CTO: "warning",
    RESEARCH_DIRECTOR: "info",
    AI_ENGINEER: "success",
    SOFTWARE_ENGINEER: "success",
    DATA_SCIENTIST: "info",
    PRODUCT_MANAGER: "warning",
    HR_MANAGER: "error",
    FINANCE_MANAGER: "info",
    CONTENT_MANAGER: "success",
    PUBLIC_VISITOR: "default",
  };

  if (loading) {
    return <div className="text-gray-400">Loading...</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Super Admin Dashboard</h1>
        <p className="text-gray-400 mt-1">System administration and management</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Total Users"
          value={users.length}
          change={`${users.filter(u => u.role !== "PUBLIC_VISITOR").length} active`}
          changeType="positive"
        />
        <StatCard
          title="Audit Logs"
          value={auditLogs.length}
          change="Recent activity"
        />
        <StatCard
          title="System Settings"
          value={settings.length}
          change="Configuration entries"
        />
        <StatCard
          title="Admin Session"
          value="Active"
          change={session?.user?.name || "Unknown"}
          changeType="positive"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card title="User Management" description="All registered users in the system">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border-subtle">
                  <th className="text-left py-2 px-3 text-gray-400">Name</th>
                  <th className="text-left py-2 px-3 text-gray-400">Email</th>
                  <th className="text-left py-2 px-3 text-gray-400">Role</th>
                  <th className="text-left py-2 px-3 text-gray-400">Department</th>
                </tr>
              </thead>
              <tbody>
                {users.slice(0, 10).map((user) => (
                  <tr key={user.id} className="border-b border-border-subtle/50">
                    <td className="py-2 px-3 text-white">{user.name}</td>
                    <td className="py-2 px-3 text-gray-400">{user.email}</td>
                    <td className="py-2 px-3">
                      <Badge variant={roleColors[user.role] as any}>{user.role}</Badge>
                    </td>
                    <td className="py-2 px-3 text-gray-400">{user.department || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 text-sm text-gray-400">
            Showing {Math.min(10, users.length)} of {users.length} users
          </div>
        </Card>

        <Card title="System Settings" description="Platform configuration">
          <div className="space-y-4 mb-6">
            <Input
              label="Setting Key"
              value={newSetting.key}
              onChange={(e) => setNewSetting({ ...newSetting, key: e.target.value })}
              placeholder="e.g., MAINTENANCE_MODE"
            />
            <Input
              label="Value"
              value={newSetting.value}
              onChange={(e) => setNewSetting({ ...newSetting, value: e.target.value })}
              placeholder="Setting value"
            />
            <Input
              label="Description"
              value={newSetting.description}
              onChange={(e) => setNewSetting({ ...newSetting, description: e.target.value })}
              placeholder="Optional description"
            />
            <Button onClick={handleAddSetting}>Add Setting</Button>
          </div>
          
          <div className="space-y-2">
            {settings.map((setting) => (
              <div key={setting.key} className="flex items-center justify-between p-3 bg-background rounded-md">
                <div>
                  <p className="text-white font-medium">{setting.key}</p>
                  <p className="text-sm text-gray-400">{setting.value}</p>
                </div>
                {setting.description && (
                  <span className="text-xs text-gray-500">{setting.description}</span>
                )}
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card title="Recent Audit Logs" description="System activity history">
        <div className="space-y-2">
          {auditLogs.slice(0, 10).map((log) => (
            <div key={log.id} className="flex items-center justify-between p-3 bg-background rounded-md">
              <div>
                <p className="text-white">
                  <span className="text-accent-cyan">{log.user.name}</span>{" "}
                  {log.action} on {log.entityType}
                </p>
                {log.details && (
                  <p className="text-sm text-gray-500">{log.details}</p>
                )}
              </div>
              <span className="text-xs text-gray-500">
                {new Date(log.createdAt).toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}