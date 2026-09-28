"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import clsx from "clsx";
import { nav, couple } from "@/lib/config";

export function PublicNav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const solid = scrolled || open;

  return (
    <header
      className={clsx(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-elegant",
        solid ? "bg-ivory-100/95 backdrop-blur shadow-[0_1px_0_rgba(38,32,28,0.08)]" : "bg-transparent"
      )}
    >
      <div className="container-content flex h-[72px] items-center justify-between">
        <a
          href="#top"
          className={clsx(
            "font-script text-2xl tracking-wide transition-colors",
            solid ? "text-ink-900" : "text-ivory-100"
          )}
        >
          {couple.partnerOneKnownAs}
          <span className="mx-[0.14em] inline-block">&amp;</span>
          {couple.partnerTwoFirstName}
        </a>

        <nav className="hidden lg:flex items-center gap-8">
          {nav.public.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={clsx(
                "text-[0.8rem] uppercase tracking-widest2 transition-colors",
                solid ? "text-ink-700 hover:text-wine-600" : "text-ivory-100/90 hover:text-ivory-100"
              )}
            >
              {item.label}
            </a>
          ))}
          <Link
            href="/rsvp"
            className={clsx(
              "btn text-[0.72rem] py-2.5 px-5",
              solid
                ? "bg-wine-600 text-ivory-100 hover:bg-wine-700"
                : "bg-ivory-100/95 text-wine-700 hover:bg-ivory-100"
            )}
          >
            RSVP
          </Link>
        </nav>

        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="lg:hidden inline-flex h-10 w-10 items-center justify-center"
        >
          <span className="sr-only">Menu</span>
          <div className="flex flex-col gap-[5px]">
            <span
              className={clsx(
                "block h-px w-6 transition-transform duration-300",
                solid ? "bg-ink-900" : "bg-ivory-100",
                open && "translate-y-[6px] rotate-45"
              )}
            />
            <span
              className={clsx(
                "block h-px w-6 transition-opacity duration-300",
                solid ? "bg-ink-900" : "bg-ivory-100",
                open && "opacity-0"
              )}
            />
            <span
              className={clsx(
                "block h-px w-6 transition-transform duration-300",
                solid ? "bg-ink-900" : "bg-ivory-100",
                open && "-translate-y-[6px] -rotate-45"
              )}
            />
          </div>
        </button>
      </div>

      <div
        className={clsx(
          "lg:hidden overflow-hidden bg-ivory-100 transition-[max-height] duration-500 ease-elegant",
          open ? "max-h-[560px]" : "max-h-0"
        )}
      >
        <nav className="container-content flex flex-col gap-1 pb-6 pt-2">
          {nav.public.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="py-3 text-sm uppercase tracking-widest2 border-b border-ink-900/[0.06] text-ink-800"
            >
              {item.label}
            </a>
          ))}
          <Link href="/rsvp" className="btn-primary mt-5 w-full">
            RSVP
          </Link>
        </nav>
      </div>
    </header>
  );
}
