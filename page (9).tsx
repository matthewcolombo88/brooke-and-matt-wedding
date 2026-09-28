import type { Metadata } from "next";
import { getCurrentGuest } from "@/lib/auth/current";
import { getHouseholdByGroupId } from "@/lib/data/household";
import { RsvpForm } from "@/components/RsvpForm";
import { deriveFirstName } from "@/lib/auth/name-match";

export const metadata: Metadata = { title: "My RSVP" };

export default async function PortalRsvpPage() {
  const session = await getCurrentGuest();
  if (!session) return null; // layout already redirects; this satisfies TS

  const household = await getHouseholdByGroupId(session.groupId);
  if (!household) {
    return (
      <section className="section-pad container-content text-center">
        <p className="text-wine-600">
          We&rsquo;re having trouble loading your invitation right now. Please try again shortly.
        </p>
      </section>
    );
  }

  const firstName = deriveFirstName(session.fullName);

  return (
    <section className="pt-16 pb-24 sm:pt-20 sm:pb-28">
      <div className="container-content max-w-2xl">
        <p className="eyebrow text-center">Welcome, {firstName}</p>
        <h1 className="mt-3 font-serif text-3xl sm:text-4xl text-ink-900 text-center">Your Wedding Invitation</h1>
        <p className="mt-4 text-ink-500 text-center">
          Let us know who&rsquo;s celebrating with us, and any dietary needs — you can update this any time.
        </p>

        <div className="mt-12">
          <RsvpForm guests={household.guests} note={household.note?.note ?? null} />
        </div>
      </div>
    </section>
  );
}
