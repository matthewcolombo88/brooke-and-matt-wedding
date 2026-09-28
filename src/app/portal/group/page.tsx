import Link from "next/link";
import { getCurrentGuest } from "@/lib/auth/current";
import { getHouseholdByGroupId } from "@/lib/data/household";
import type { RsvpStatus } from "@/lib/types";
import clsx from "clsx";

export const metadata = { title: "My Group" };

const statusConfig: Record<RsvpStatus, { label: string; className: string }> = {
  pending: { label: "Awaiting RSVP", className: "bg-ivory-300 text-ink-600" },
  attending: { label: "Attending", className: "bg-olive-100 text-olive-800" },
  declined: { label: "Unable to Attend", className: "bg-wine-100 text-wine-700" },
};

const dietaryLabels: Record<string, string> = {
  none: "No dietary requirements",
  vegetarian: "Vegetarian",
  vegan: "Vegan",
  gluten_free: "Gluten free",
  halal: "Halal",
  other: "Other",
};

export default async function PortalGroupPage() {
  const session = await getCurrentGuest();
  if (!session) return null;
  const household = await getHouseholdByGroupId(session.groupId);

  return (
    <section className="pt-16 pb-24 sm:pt-20 sm:pb-28">
      <div className="container-content max-w-2xl">
        <p className="eyebrow text-center">{household?.group.group_name ?? "Your Group"}</p>
        <h1 className="mt-3 font-serif text-3xl sm:text-4xl text-ink-900 text-center">Your Invitation Party</h1>
        <p className="mt-4 text-ink-500 text-center">
          Everyone invited alongside you. Any of you can update the group&rsquo;s RSVP.
        </p>

        <div className="mt-12 space-y-4">
          {household?.guests.map((guest) => {
            const status = statusConfig[guest.rsvp_status];
            return (
              <div key={guest.id} className="card p-6 flex items-center justify-between gap-4">
                <div>
                  <p className="font-serif text-xl text-ink-900">{guest.full_name}</p>
                  {guest.rsvp_status === "attending" && guest.dietary_requirement && (
                    <p className="mt-1 text-sm text-ink-500">
                      {dietaryLabels[guest.dietary_requirement] ?? guest.dietary_requirement}
                    </p>
                  )}
                </div>
                <span
                  className={clsx(
                    "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[0.7rem] uppercase tracking-widest2 whitespace-nowrap",
                    status.className
                  )}
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden />
                  {status.label}
                </span>
              </div>
            );
          })}
        </div>

        <div className="mt-10 text-center">
          <Link href="/portal/rsvp" className="btn-primary">
            Update RSVP
          </Link>
        </div>
      </div>
    </section>
  );
}
