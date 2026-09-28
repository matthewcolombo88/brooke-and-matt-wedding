import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/lib/auth/current";
import { AdminNav } from "@/components/AdminNav";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");

  return (
    <div className="min-h-screen bg-ivory-200">
      <AdminNav displayName={admin.displayName ?? admin.email} />
      <main className="container-content py-10">{children}</main>
    </div>
  );
}
