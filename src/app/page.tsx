import Image from "next/image";
import Link from "next/link";
import { PublicNav } from "@/components/PublicNav";
import { PublicFooter } from "@/components/PublicFooter";
import { Countdown } from "@/components/Countdown";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { LocationCard } from "@/components/LocationCard";
import { Timeline } from "@/components/Timeline";
import { GalleryLightbox } from "@/components/GalleryLightbox";
import { FaqItem } from "@/components/Faq";
import { heroPhoto, momentsPhotos } from "@/lib/photos";
import { hotels, accommodationNote } from "@/lib/accommodation";
import {
  ceremony,
  childFree,
  clubMarconi,
  couple,
  dressCode,
  gifts,
  itinerary,
  reception,
  transport,
  wedding,
} from "@/lib/config";

export default function HomePage() {
  return (
    <>
      <PublicNav />

      {/* HERO */}
      <section id="top" className="relative min-h-[100svh] flex items-end sm:items-center justify-center overflow-hidden">
        <Image
          src={heroPhoto.src}
          alt={heroPhoto.alt}
          fill
          priority
          sizes="100vw"
          className="object-cover object-[center_62%]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-900/80 via-ink-900/25 to-ink-900/45" />

        <div className="relative z-10 container-content pb-16 pt-40 sm:py-10 text-center flex flex-col items-center">
          <p className="eyebrow !text-ivory-100/80 fade-up">We&rsquo;re Getting Married</p>
          <h1 className="mt-6 font-script text-6xl sm:text-8xl md:text-9xl text-ivory-100 fade-up leading-none">
            {couple.displayNames}
          </h1>
          <p
            className="mt-7 font-sans text-sm sm:text-base uppercase tracking-widest2 text-ivory-100/90 fade-up"
            style={{ animationDelay: "0.1s" }}
          >
            {wedding.dateDisplay} &middot; {wedding.location}
          </p>

          <div className="mt-12 fade-up" style={{ animationDelay: "0.2s" }}>
            <p className="font-serif italic text-lg sm:text-xl text-ivory-200/80 mb-4">
              Counting down to forever
            </p>
            <Countdown targetISO={wedding.dateISO} />
          </div>

          <div
            className="mt-12 flex flex-col sm:flex-row gap-4 fade-up"
            style={{ animationDelay: "0.3s" }}
          >
            <Link href="/rsvp" className="btn-primary">
              RSVP
            </Link>
            <a href="#details" className="btn-outline-light">
              See the Details
            </a>
          </div>
        </div>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 hidden sm:block animate-fadeIn" style={{ animationDelay: "1s" }}>
          <span className="block h-8 w-px bg-ivory-100/50" />
        </div>
      </section>

      {/* WEDDING DAY ESSENTIALS */}
      <section id="details" className="section-pad bg-ivory-100 scroll-mt-20">
        <div className="container-content">
          <Reveal>
            <SectionHeading
              eyebrow={wedding.dateDisplay}
              title="Everything You Need to Know"
              subtitle="The essentials for our wedding day, all in one place — save this page for the day itself."
            />
          </Reveal>

          <div className="mt-16 grid gap-8">
            <Reveal>
              <LocationCard
                eyebrow="Ceremony"
                time={ceremony.time}
                name={ceremony.name}
                addressLines={ceremony.addressLines}
                mapsQuery={ceremony.mapsQuery}
                photo={ceremony.photo}
                parkingNote={ceremony.parkingNote}
              />
            </Reveal>
            <Reveal delayMs={120}>
              <LocationCard
                eyebrow="Reception"
                time={reception.receptionTime}
                name={reception.venueName}
                subName={reception.roomName}
                addressLines={reception.addressLines}
                mapsQuery={reception.mapsQuery}
                photo={reception.photo}
                parkingNote={reception.parkingNote}
                extraNote={reception.arrivalNote}
                imageOnRight
              />
            </Reveal>
          </div>
        </div>
      </section>

      {/* VISUAL TIMELINE */}
      <section id="timeline" className="section-pad bg-ivory-200 texture-grain scroll-mt-20">
        <div className="container-content">
          <Reveal>
            <SectionHeading eyebrow="The Day at a Glance" title="Our Wedding Day Timeline" />
          </Reveal>
          <div className="mt-16">
            <Timeline items={itinerary} />
          </div>
        </div>
      </section>

      {/* MOMENTS STRIP */}
      <section id="moments" className="section-pad bg-ivory-100 scroll-mt-20">
        <div className="container-content">
          <Reveal>
            <SectionHeading eyebrow="Us" title="A Few of Our Favourite Moments" />
          </Reveal>
          <div className="mt-14 max-w-3xl mx-auto">
            <GalleryLightbox photos={momentsPhotos} />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="section-pad bg-ivory-200 texture-grain scroll-mt-20">
        <div className="container-content max-w-2xl">
          <Reveal>
            <SectionHeading eyebrow="Good to Know" title="Frequently Asked Questions" />
          </Reveal>

          <Reveal delayMs={100} className="mt-14 card px-6 sm:px-10">
            <FaqItem question={dressCode.heading}>
              <p>{dressCode.note}</p>
              <dl className="mt-4 space-y-2">
                <div className="flex gap-3">
                  <dt className="w-16 flex-shrink-0 uppercase text-xs tracking-widest2 text-wine-600 pt-0.5">
                    Men
                  </dt>
                  <dd>{dressCode.men}</dd>
                </div>
                <div className="flex gap-3">
                  <dt className="w-16 flex-shrink-0 uppercase text-xs tracking-widest2 text-wine-600 pt-0.5">
                    Women
                  </dt>
                  <dd>{dressCode.women}</dd>
                </div>
              </dl>
            </FaqItem>

            <FaqItem question={childFree.heading}>
              {childFree.body.map((p) => (
                <p key={p} className="mt-3 first:mt-0">
                  {p}
                </p>
              ))}
            </FaqItem>

            <FaqItem question="Where should we stay?">
              <p>{accommodationNote}</p>
              <ul className="mt-4 space-y-4">
                {hotels.map((hotel) => (
                  <li key={hotel.name}>
                    <a
                      href={hotel.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-serif text-lg text-ink-900 hover:text-wine-600 transition-colors"
                    >
                      {hotel.name}
                    </a>
                    <p className="text-sm text-ink-500">
                      {hotel.suburb} &middot; {hotel.proximityNote}
                    </p>
                  </li>
                ))}
              </ul>
            </FaqItem>

            <FaqItem question="Are gifts expected?">
              {gifts.body.map((p) => (
                <p key={p} className="mt-3 first:mt-0">
                  {p}
                </p>
              ))}
            </FaqItem>

            <FaqItem question="What happens between the ceremony and reception?">
              <p>{clubMarconi.intro}</p>
              <p className="mt-3">{clubMarconi.beforeReception}</p>
              <p className="mt-3">{clubMarconi.nearby}</p>
            </FaqItem>

            <FaqItem question="Parking &amp; getting there">
              <p>
                <span className="font-medium text-ink-800">Ceremony —</span> {ceremony.parkingNote}
              </p>
              <p className="mt-3">
                <span className="font-medium text-ink-800">Reception —</span> {reception.parkingNote}
              </p>
              <p className="mt-3">{transport.note}</p>
              <p className="mt-1 text-sm text-ink-400">{transport.travelTimeNote}</p>
            </FaqItem>
          </Reveal>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="section-pad bg-wine-700 text-center">
        <div className="container-content">
          <Reveal>
            <p className="font-script text-5xl sm:text-6xl text-ivory-100 mb-4">We can&rsquo;t wait</p>
            <h2 className="font-serif text-3xl sm:text-4xl text-ivory-100">To celebrate with you</h2>
            <div className="mt-9">
              <Link href="/rsvp" className="btn-outline-light">
                RSVP Now
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <PublicFooter />
    </>
  );
}
