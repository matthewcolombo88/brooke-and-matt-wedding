import Image from "next/image";
import { googleMapsDirectionsUrl, googleMapsViewUrl } from "@/lib/maps";

interface Props {
  eyebrow: string;
  name: string;
  subName?: string;
  time?: string;
  addressLines: string[];
  mapsQuery: string;
  photo: string;
  parkingNote?: string;
  extraNote?: string;
  imageOnRight?: boolean;
}

export function LocationCard({
  eyebrow,
  name,
  subName,
  time,
  addressLines,
  mapsQuery,
  photo,
  parkingNote,
  extraNote,
  imageOnRight = false,
}: Props) {
  return (
    <div className="card overflow-hidden">
      <div className={`grid md:grid-cols-2 ${imageOnRight ? "" : "md:[direction:rtl]"}`}>
        <div className="relative aspect-[4/3] md:aspect-auto md:[direction:ltr]">
          <Image
            src={photo}
            alt={`${name}${subName ? ` — ${subName}` : ""}`}
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
        <div className="p-8 sm:p-10 flex flex-col justify-center md:[direction:ltr]">
          <p className="eyebrow">{eyebrow}</p>
          {time && <p className="mt-2 font-serif text-2xl text-wine-600">{time}</p>}
          <h3 className="mt-2 font-serif text-2xl sm:text-3xl text-ink-900">{name}</h3>
          {subName && <p className="mt-1 text-ink-500 text-sm uppercase tracking-widest2">{subName}</p>}

          <address className="mt-5 not-italic text-ink-600 leading-relaxed">
            {addressLines.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </address>

          {parkingNote && (
            <p className="mt-4 text-sm text-olive-700 flex items-start gap-2">
              <ParkingIcon />
              <span>{parkingNote}</span>
            </p>
          )}

          {extraNote && <p className="mt-3 text-sm text-ink-500 leading-relaxed">{extraNote}</p>}

          <div className="mt-7 flex flex-wrap gap-3">
            <a
              href={googleMapsViewUrl(mapsQuery)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary"
            >
              Open in Google Maps
            </a>
            <a
              href={googleMapsDirectionsUrl(mapsQuery)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
            >
              Get Directions
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function ParkingIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-5 w-5 flex-shrink-0 text-olive-600 mt-0.5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <rect x="3.5" y="3.5" width="17" height="17" rx="3" />
      <path d="M9.5 16V8h3.2a2.4 2.4 0 010 4.8H9.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
