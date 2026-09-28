import { LocationCard } from "@/components/LocationCard";
import { Timeline } from "@/components/Timeline";
import { ceremony, reception, itinerary, dressCode, childFree } from "@/lib/config";

export const metadata = { title: "Wedding Details" };

export default function PortalDetailsPage() {
  return (
    <section className="pt-16 pb-24 sm:pt-20 sm:pb-28">
      <div className="container-content max-w-3xl">
        <p className="eyebrow text-center">Everything in One Place</p>
        <h1 className="mt-3 font-serif text-3xl sm:text-4xl text-ink-900 text-center">Wedding Details</h1>

        <div className="mt-14 space-y-8">
          <LocationCard
            eyebrow="Ceremony"
            time={ceremony.time}
            name={ceremony.name}
            addressLines={ceremony.addressLines}
            mapsQuery={ceremony.mapsQuery}
            photo={ceremony.photo}
            parkingNote={ceremony.parkingNote}
          />
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
        </div>

        <div className="mt-20">
          <h2 className="font-serif text-2xl sm:text-3xl text-ink-900 text-center mb-14">The Day at a Glance</h2>
          <Timeline items={itinerary} />
        </div>

        <div className="mt-16 grid sm:grid-cols-2 gap-6">
          <div className="card p-7">
            <p className="eyebrow">Dress Code</p>
            <p className="mt-2 font-serif text-xl text-ink-900">{dressCode.heading}</p>
            <p className="mt-2 text-sm text-ink-500">{dressCode.men} &middot; {dressCode.women}</p>
          </div>
          <div className="card p-7">
            <p className="eyebrow">A Small Note</p>
            <p className="mt-2 font-serif text-xl text-ink-900">{childFree.heading}</p>
            <p className="mt-2 text-sm text-ink-500">Adults-only, with close family children welcome.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
