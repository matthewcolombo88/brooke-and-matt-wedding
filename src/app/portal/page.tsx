import Link from "next/link";
import Image from "next/image";
import { getCurrentGuest } from "@/lib/auth/current";
import { getHouseholdByGroupId } from "@/lib/data/household";
import { deriveFirstName } from "@/lib/auth/name-match";
import { heroPhoto } from "@/lib/photos";
import { wedding, ceremony, reception } from "@/lib/config";

export const metadata = { title: "Welcome" };

export default async function PortalHomePage() {
  const session = await getCurrentGuest();
  if (!session) return null;

  const household = await getHouseholdByGroupId(session.groupId);
  const firstName = deriveFirstName(session.fullName);

  const attendingCount = household?.guests.filter((g) => g.rsvp_status === "attending").length ?? 0;
  const pendingCount = household?.guests.filter((g) => g.rsvp_status === "pending").length ?? 0;

  return (
    <>
      <section className="relative py-24 sm:py-28 overflow-hidden">
        <Image src={heroPhoto.src} alt="" fill className="object-cover object-[center_62%]" priority />
        <div className="absolute inset-0 bg-ink-900/60" />
        <div className="relative container-content text-center">
          <p className="eyebrow !text-ivory-100/80">Welcome, {firstName}</p>
          <h1 className="mt-4 font-serif text-4xl sm:text-5xl text-ivory-100">Your Wedding Portal</h1>
          <p className="mt-4 text-ivory-200/90">
            {wedding.dateDisplay} &middot; {wedding.location}
          </p>
        </div>
      </section>

      <section className="section-pad bg-ivory-100">
        <div className="container-content">
          {pendingCount > 0 && (
            <div className="card mb-10 p-6 sm:p-8 text-center bg-gold-300/20 border-gold-400/40">
              <p className="text-ink-800">
                {pendingCount === 1
                  ? "You have one invitation awaiting a response."
                  : `You have ${pendingCount} invitations awaiting a response.`}
              </p>
              <Link href="/portal/rsvp" className="btn-primary mt-5 inline-flex">
                Respond Now
              </Link>
            </div>
          )}

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <PortalLinkCard href="/portal/rsvp" title="My RSVP" desc="View or update your response" />
            <PortalLinkCard href="/portal/group" title="My Group" desc="See who else is invited with you" />
            <PortalLinkCard href="/portal/details" title="Wedding Details" desc="Times, venues & the day" />
            <PortalLinkCard href="/portal/gallery" title="Gallery" desc="Our favourite photos" />
          </div>

          <div className="mt-14 grid sm:grid-cols-2 gap-6 text-center">
            <div className="card p-7">
              <p className="eyebrow">Ceremony</p>
              <p className="mt-2 font-serif text-2xl text-ink-900">{ceremony.time}</p>
              <p className="mt-1 text-sm text-ink-500">{ceremony.name}</p>
            </div>
            <div className="card p-7">
              <p className="eyebrow">Reception</p>
              <p className="mt-2 font-serif text-2xl text-ink-900">{reception.arrivalTime}</p>
              <p className="mt-1 text-sm text-ink-500">{reception.venueName}, {reception.roomName}</p>
            </div>
          </div>

          {attendingCount > 0 && (
            <p className="mt-10 text-center text-ink-500">
              We can&rsquo;t wait to celebrate with {attendingCount === 1 ? "you" : "you all"}.
            </p>
          )}
        </div>
      </section>
    </>
  );
}

function PortalLinkCard({ href, title, desc }: { href: string; title: string; desc: string }) {
  return (
    <Link href={href} className="card p-6 hover:shadow-cardHover transition-shadow duration-300 group">
      <p className="font-serif text-xl text-ink-900 group-hover:text-wine-600 transition-colors">{title}</p>
      <p className="mt-1.5 text-sm text-ink-500">{desc}</p>
    </Link>
  );
}
