"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/card";
import { Button } from "@repo/ui/button";
import { Sparkles, ArrowRight, CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation"; // Import the router

interface HealthSuggestion {
  id: string;
  content: string;
  createdAt: string;
  read: boolean;
}

export default function HealthSuggestionCard() {
  const router = useRouter(); // Use Next.js router instead of window.location
  const [suggestions, setSuggestions] = useState<HealthSuggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false); // Add this to track client-side rendering

  // Use this to ensure we only render once hydrated
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      // Only fetch on the client
      fetchSuggestions();
    }
  }, [isClient]);

  const fetchSuggestions = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/auth/health-suggestion");
      if (!response.ok) {
        throw new Error("Failed to fetch suggestions");
      }
      const data = await response.json();
      setSuggestions(data.suggestions || []);
    } catch (err) {
      setError("Error fetching suggestions");
      console.error("Error fetching suggestions:", err);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      // Update the UI optimistically
      setSuggestions((prev) =>
        prev.map((suggestion) =>
          suggestion.id === id ? { ...suggestion, read: true } : suggestion,
        ),
      );

      // You would typically update this in the database as well
      // await fetch(`/api/auth/health-suggestion/${id}/read`, { method: 'POST' })
    } catch (err) {
      console.error("Error marking suggestion as read:", err);
      // Revert the optimistic update if it fails
      fetchSuggestions();
    }
  };

  // Return a consistent initial UI for server and client first render
  if (!isClient) {
    return (
      <Card className="bg-emerald-50/50 hover:bg-emerald-50 transition-colors">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <Sparkles className="h-5 w-5 mr-2 text-emerald-500" />
            Health Suggestions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-24 flex items-center justify-center">
            <div className="text-emerald-500">Loading suggestions...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card className="bg-emerald-50/50 hover:bg-emerald-50 transition-colors">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <Sparkles className="h-5 w-5 mr-2 text-emerald-500" />
            Health Suggestions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-24 flex items-center justify-center">
            <div className="animate-pulse text-emerald-500">
              Loading suggestions...
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || suggestions.length === 0) {
    return (
      <Card className="bg-emerald-50/50 hover:bg-emerald-50 transition-colors">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <Sparkles className="h-5 w-5 mr-2 text-emerald-500" />
            Health Suggestions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-24 flex flex-col items-center justify-center text-center">
            <p className="text-zinc-600 mb-2">
              {error || "No health suggestions available yet"}
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push("/health")}
              className="mt-2"
            >
              Go to Health Dashboard
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Get the first unread suggestion, or the most recent one if all are read
  const currentSuggestion = (suggestions.find((s) => !s.read) ||
    suggestions[0]) as HealthSuggestion;

  return (
    <Card className="bg-emerald-50/50 hover:bg-emerald-50 transition-colors">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <Sparkles className="h-5 w-5 mr-2 text-emerald-500" />
          Health Suggestion
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <p className="text-zinc-700">{currentSuggestion.content}</p>
          <div className="flex justify-between items-center pt-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => markAsRead(currentSuggestion.id)}
              className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-100"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Mark as read
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push("/health")}
              className="text-emerald-600 border-emerald-200 hover:bg-emerald-100"
            >
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
