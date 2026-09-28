"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { adminLogoutAction } from "@/lib/actions/admin";

const links = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/guests", label: "Guests" },
  { href: "/admin/groups", label: "Groups" },
];

export function AdminNav({ displayName }: { displayName: string }) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 bg-ink-900 text-ivory-100">
      <div className="container-content flex h-16 items-center justify-between">
        <Link href="/admin" className="font-serif text-lg">
          Wedding Admin
        </Link>
        <nav className="flex items-center gap-6">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={clsx(
                "text-xs uppercase tracking-widest2 transition-colors hidden sm:inline",
                pathname === link.href ? "text-gold-400" : "text-ivory-200/80 hover:text-ivory-100"
              )}
            >
              {link.label}
            </Link>
          ))}
          <a
            href="/api/admin/export"
            className="text-xs uppercase tracking-widest2 text-ivory-200/80 hover:text-ivory-100 hidden sm:inline"
          >
            Export CSV
          </a>
          <span className="text-xs text-ivory-300/60 hidden md:inline">{displayName}</span>
          <form action={adminLogoutAction}>
            <button type="submit" className="text-xs uppercase tracking-widest2 text-gold-400 hover:text-gold-300">
              Log out
            </button>
          </form>
        </nav>
      </div>
      <div className="sm:hidden container-content flex gap-5 pb-3 -mt-1">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={clsx(
              "text-xs uppercase tracking-widest2",
              pathname === link.href ? "text-gold-400" : "text-ivory-200/80"
            )}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </header>
  );
}
