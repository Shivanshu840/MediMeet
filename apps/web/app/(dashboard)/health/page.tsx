"use client";
import { redirect } from "next/navigation";
import HealthMonitor from "../../../components/health-monitor";
import HealthAIInsights from "../../../components/health-ai-insights";
import { ToastProvider } from "@repo/ui/use-toast"; 
import { useEffect } from "react";
import { useSession } from "next-auth/react";

export default function HealthPage() {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "unauthenticated") {
      redirect("/login");
    }
  }, [status]);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (status === "authenticated") {
    return (
      <ToastProvider>
        <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800/90 to-emerald-900/40 p-6">
          <div className="max-w-7xl mx-auto space-y-8">
            <h1 className="text-3xl font-bold text-white">Health Dashboard</h1>
            <p className="text-zinc-400">
              Monitor and track your health metrics with AI-powered insights
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <HealthMonitor />
              </div>
              <div className="lg:col-span-1">
                <HealthAIInsights />
              </div>
            </div>
          </div>
        </div>
      </ToastProvider>
    );
  }
}
