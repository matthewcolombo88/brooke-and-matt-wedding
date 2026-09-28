import Link from "next/link";
import { couple, wedding } from "@/lib/config";
import { nav } from "@/lib/config";

export function PublicFooter() {
  return (
    <footer className="bg-ink-900 text-ivory-200 texture-grain">
      <div className="container-content py-16">
        <div className="text-center">
          <p className="font-script text-4xl sm:text-5xl text-ivory-100">
            {couple.partnerOneKnownAs}
            <span className="mx-[0.16em] inline-block">&amp;</span>
            {couple.partnerTwoFirstName}
          </p>
          <p className="mt-4 eyebrow !text-ivory-300/70">{wedding.dateDisplay}</p>
        </div>

        <nav className="mt-10 flex flex-wrap justify-center gap-x-6 gap-y-3">
          {nav.public.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-xs uppercase tracking-widest2 text-ivory-300/80 hover:text-ivory-100 transition-colors"
            >
              {item.label}
            </a>
          ))}
          <Link
            href="/rsvp"
            className="text-xs uppercase tracking-widest2 text-gold-400 hover:text-gold-300 transition-colors"
          >
            RSVP
          </Link>
        </nav>

        <div className="divider-mark my-10 !bg-ivory-100/15" />

        <p className="text-center text-[0.7rem] text-ivory-300/50">
          With love, we can&rsquo;t wait to celebrate with you.
        </p>
      </div>
    </footer>
  );
}
