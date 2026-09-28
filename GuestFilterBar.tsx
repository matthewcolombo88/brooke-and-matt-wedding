"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState, useTransition } from "react";

const statusOptions = [
  { value: "all", label: "All" },
  { value: "pending", label: "Awaiting" },
  { value: "attending", label: "Attending" },
  { value: "declined", label: "Declined" },
];

const dietaryOptions = [
  { value: "", label: "Any Dietary" },
  { value: "vegetarian", label: "Vegetarian" },
  { value: "vegan", label: "Vegan" },
  { value: "gluten_free", label: "Gluten free" },
  { value: "halal", label: "Halal" },
  { value: "other", label: "Other" },
];

export function GuestFilterBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();
  const [search, setSearch] = useState(searchParams.get("search") ?? "");

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    startTransition(() => router.push(`${pathname}?${params.toString()}`));
  }

  return (
    <div className="flex flex-wrap gap-3 items-center mb-6">
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") updateParam("search", search);
        }}
        onBlur={() => updateParam("search", search)}
        placeholder="Search by name…"
        className="rounded-sm border border-ink-900/15 bg-ivory-50 px-4 py-2.5 text-sm text-ink-900 focus:border-wine-600 focus:outline-none focus:ring-1 focus:ring-wine-600 min-w-[200px]"
      />

      <select
        defaultValue={searchParams.get("status") ?? "all"}
        onChange={(e) => updateParam("status", e.target.value === "all" ? "" : e.target.value)}
        className="rounded-sm border border-ink-900/15 bg-ivory-50 px-3.5 py-2.5 text-sm text-ink-900"
      >
        {statusOptions.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>

      <select
        defaultValue={searchParams.get("dietary") ?? ""}
        onChange={(e) => updateParam("dietary", e.target.value)}
        className="rounded-sm border border-ink-900/15 bg-ivory-50 px-3.5 py-2.5 text-sm text-ink-900"
      >
        {dietaryOptions.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}
