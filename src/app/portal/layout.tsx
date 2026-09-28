import { redirect } from "next/navigation";
import { getCurrentGuest } from "@/lib/auth/current";
import { deriveFirstName } from "@/lib/auth/name-match";
import { PortalNav } from "@/components/PortalNav";
import { PublicFooter } from "@/components/PublicFooter";

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  const guest = await getCurrentGuest();
  if (!guest) redirect("/rsvp");

  const firstName = deriveFirstName(guest.fullName);

  return (
    <>
      <PortalNav firstName={firstName} />
      <main className="min-h-[70vh]">{children}</main>
      <PublicFooter />
    </>
  );
}
