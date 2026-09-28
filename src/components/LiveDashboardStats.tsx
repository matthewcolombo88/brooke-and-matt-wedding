"use client";

import { useEffect, useState } from "react";
import type { DashboardStats } from "@/lib/types";

const dietaryLabels: Record<string, string> = {
  vegetarian: "Vegetarian",
  vegan: "Vegan",
  gluten_free: "Gluten free",
  halal: "Halal",
  other: "Other",
};

export function LiveDashboardStats({ initial }: { initial: DashboardStats }) {
  const [stats, setStats] = useState<DashboardStats>(initial);
  const [live, setLive] = useState(false);

  useEffect(() => {
    const source = new EventSource("/api/admin/live");
    source.onopen = () => setLive(true);
    source.onmessage = (event) => {
      try {
        setStats(JSON.parse(event.data));
      } catch {
        // ignore malformed frames
      }
    };
    source.onerror = () => setLive(false);
    return () => source.close();
  }, []);

  const cards = [
    { label: "Total Invited", value: stats.totalInvited },
    { label: "Attending", value: stats.totalAttending },
    { label: "Declined", value: stats.totalDeclined },
    { label: "Awaiting RSVP", value: stats.totalAwaiting },
  ];

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <span
          className={`h-1.5 w-1.5 rounded-full ${live ? "bg-olive-500" : "bg-ink-400"}`}
          aria-hidden
        />
        <span className="text-xs uppercase tracking-widest2 text-ink-400">
          {live ? "Live" : "Connecting…"}
        </span>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c) => (
          <div key={c.label} className="card p-6 text-center">
            <p className="font-serif text-4xl text-wine-600 tabular-nums">{c.value}</p>
            <p className="mt-1 text-xs uppercase tracking-widest2 text-ink-500">{c.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid sm:grid-cols-2 gap-4">
        <div className="card p-6">
          <p className="text-xs uppercase tracking-widest2 text-ink-500 mb-3">Attending Breakdown</p>
          <div className="flex justify-between text-ink-700">
            <span>Adults</span>
            <span className="tabular-nums font-medium">{stats.attendingAdults}</span>
          </div>
          <div className="flex justify-between text-ink-700 mt-1">
            <span>Children</span>
            <span className="tabular-nums font-medium">{stats.attendingChildren}</span>
          </div>
        </div>
        <div className="card p-6">
          <p className="text-xs uppercase tracking-widest2 text-ink-500 mb-3">Dietary Requirements</p>
          {Object.keys(stats.dietaryBreakdown).length === 0 ? (
            <p className="text-sm text-ink-400">No dietary requirements recorded yet.</p>
          ) : (
            Object.entries(stats.dietaryBreakdown).map(([key, count]) => (
              <div key={key} className="flex justify-between text-ink-700">
                <span>{dietaryLabels[key] ?? key}</span>
                <span className="tabular-nums font-medium">{count}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
