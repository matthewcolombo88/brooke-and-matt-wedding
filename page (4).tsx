import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Image from "next/image";
import { PublicNav } from "@/components/PublicNav";
import { PublicFooter } from "@/components/PublicFooter";
import { Reveal } from "@/components/Reveal";
import { GuestLoginForm } from "@/components/GuestLoginForm";
import { getCurrentGuest } from "@/lib/auth/current";
import { fullGallery } from "@/lib/photos";

const loginPhoto = fullGallery[8];
import { couple } from "@/lib/config";

export const metadata: Metadata = { title: "RSVP — " + couple.displayNames };

export default async function RsvpLoginPage() {
  const guest = await getCurrentGuest();
  if (guest) redirect("/portal");

  return (
    <>
      <PublicNav />

      <section className="min-h-[100svh] grid lg:grid-cols-2">
        <div className="relative hidden lg:block">
          <Image src={loginPhoto.src} alt={loginPhoto.alt} fill sizes="50vw" className="object-cover" />
          <div className="absolute inset-0 bg-ink-900/25" />
        </div>

        <div className="flex items-center justify-center px-6 py-32 sm:py-36 bg-ivory-100">
          <Reveal className="w-full max-w-sm">
            <p className="eyebrow text-center">Your Invitation</p>
            <h1 className="mt-4 font-serif text-3xl sm:text-4xl text-ink-900 text-center text-balance">
              Welcome to Our Wedding Portal
            </h1>
            <p className="mt-4 text-ink-500 text-center text-sm">
              Log in with your name to view your invitation, RSVP, and see your wedding-day details.
            </p>

            <div className="mt-10">
              <GuestLoginForm />
            </div>

            <p className="mt-8 text-xs text-ink-400 text-center leading-relaxed">
              Only guests on our invitation list can access the portal. If you&rsquo;re having trouble, please
              reach out to us directly.
            </p>
          </Reveal>
        </div>
      </section>

      <PublicFooter />
    </>
  );
}
