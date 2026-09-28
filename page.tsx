import Link from "next/link";
import { getDashboardStats } from "@/lib/data/admin";
import { LiveDashboardStats } from "@/components/LiveDashboardStats";

export const metadata = { title: "Admin Dashboard", robots: { index: false, follow: false } };

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-serif text-2xl text-ink-900">Dashboard</h1>
        <div className="flex gap-3">
          <Link href="/admin/guests" className="btn-secondary text-xs py-2.5 px-4">
            Manage Guests
          </Link>
          <a href="/api/admin/export" className="btn-primary text-xs py-2.5 px-4">
            Export Guest List
          </a>
        </div>
      </div>

      <LiveDashboardStats initial={stats} />
    </div>
  );
}
