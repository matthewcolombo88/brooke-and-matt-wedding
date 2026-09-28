"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import clsx from "clsx";
import { nav, couple } from "@/lib/config";
import { logoutGuestAction } from "@/lib/actions/guest";

export function PortalNav({ firstName }: { firstName: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-ivory-100/95 backdrop-blur border-b border-ink-900/[0.06]">
      <div className="container-content flex h-[68px] items-center justify-between">
        <Link href="/portal" className="font-serif text-lg text-ink-900">
          {couple.casualNames}
        </Link>

        <nav className="hidden lg:flex items-center gap-7">
          {nav.portal.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "text-[0.78rem] uppercase tracking-widest2 transition-colors",
                pathname === item.href ? "text-wine-600" : "text-ink-700 hover:text-wine-600"
              )}
            >
              {item.label}
            </Link>
          ))}
          <span className="text-[0.78rem] text-ink-400">Hi, {firstName}</span>
          <form action={logoutGuestAction}>
            <button type="submit" className="btn-ghost !text-ink-500 hover:!text-wine-600">
              Log out
            </button>
          </form>
        </nav>

        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="lg:hidden inline-flex h-10 w-10 items-center justify-center"
        >
          <div className="flex flex-col gap-[5px]">
            <span className={clsx("block h-px w-6 bg-ink-900 transition-transform", open && "translate-y-[6px] rotate-45")} />
            <span className={clsx("block h-px w-6 bg-ink-900 transition-opacity", open && "opacity-0")} />
            <span className={clsx("block h-px w-6 bg-ink-900 transition-transform", open && "-translate-y-[6px] -rotate-45")} />
          </div>
        </button>
      </div>

      <div className={clsx("lg:hidden overflow-hidden bg-ivory-100 transition-[max-height] duration-500 ease-elegant", open ? "max-h-[420px]" : "max-h-0")}>
        <nav className="container-content flex flex-col gap-1 pb-6 pt-2">
          <p className="py-2 text-sm text-ink-400">Welcome, {firstName}</p>
          {nav.portal.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={clsx(
                "py-3 text-sm uppercase tracking-widest2 border-b border-ink-900/[0.06]",
                pathname === item.href ? "text-wine-600" : "text-ink-800"
              )}
            >
              {item.label}
            </Link>
          ))}
          <form action={logoutGuestAction} className="mt-4">
            <button type="submit" className="btn-secondary w-full">
              Log out
            </button>
          </form>
        </nav>
      </div>
    </header>
  );
}
