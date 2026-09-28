export interface Hotel {
  name: string;
  brand: string;
  suburb: string;
  proximityNote: string;
  description: string;
  website: string;
  mapsQuery: string;
}

/**
 * Researched September 2026. Prices change constantly and aren't quoted
 * here for that reason — the "Check rates" link always shows current
 * availability. Re-check this list before the wedding in case a property
 * has closed, renamed, or a better option has opened nearby.
 */
export const hotels: Hotel[] = [
  {
    name: "Meriton Suites Liverpool",
    brand: "Meriton",
    suburb: "Liverpool",
    proximityNote: "A short drive from Doltone House Western Sydney",
    description:
      "Upmarket, self-contained apartment-style suites (studios up to three-bedroom) with kitchens and laundry facilities — a great option for families or anyone staying a few nights. Heated pool, spa and gym on site.",
    website: "https://www.meritonsuites.com.au/our-hotels/nsw/western-sydney/liverpool/",
    mapsQuery: "Meriton Suites Liverpool, 167 Northumberland Street, Liverpool NSW 2170",
  },
  {
    name: "Mercure Sydney Liverpool",
    brand: "Accor",
    suburb: "Prestons",
    proximityNote: "A short drive from Doltone House Western Sydney",
    description:
      "A modern 4-star hotel with an outdoor pool, gym and alfresco dining, close to South Western Sydney's motorway network — an easy, comfortable option for out-of-town guests.",
    website: "https://www.mercuresydneyliverpool.com.au/",
    mapsQuery: "Mercure Sydney Liverpool, Corner Joadja and Hoxton Park Roads, Prestons NSW 2170",
  },
  {
    name: "Novotel Sydney Cabramatta",
    brand: "Accor",
    suburb: "Canley Vale",
    proximityNote: "A short drive from Doltone House Western Sydney",
    description:
      "A newer 140-room hotel with an outdoor pool and on-site dining, right near Cabramatta and Canley Vale train stations if anyone prefers to travel by rail.",
    website: "https://all.accor.com/hotel/A2E6/index.en.shtml",
    mapsQuery: "Novotel Sydney Cabramatta, 1 Bartley Street, Canley Vale NSW 2166",
  },
];

export const accommodationNote =
  "Guests are responsible for booking their own accommodation. We've suggested a few reputable, nearby options below, but availability and prices change — please check directly with the hotel or your preferred booking site for current rates.";
