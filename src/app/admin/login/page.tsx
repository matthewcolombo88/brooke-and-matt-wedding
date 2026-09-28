import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/lib/auth/current";
import { AdminLoginForm } from "@/components/AdminLoginForm";
import { couple } from "@/lib/config";

export const metadata = { title: "Admin Login", robots: { index: false, follow: false } };

export default async function AdminLoginPage() {
  const admin = await getCurrentAdmin();
  if (admin) redirect("/admin");

  return (
    <div className="min-h-screen flex items-center justify-center bg-ink-900 px-6">
      <div className="w-full max-w-sm">
        <p className="text-center eyebrow !text-gold-400">{couple.displayNames}</p>
        <h1 className="mt-3 font-serif text-3xl text-ivory-100 text-center">Wedding Admin</h1>
        <div className="mt-10 card p-8 bg-ivory-100">
          <AdminLoginForm />
        </div>
      </div>
    </div>
  );
}
