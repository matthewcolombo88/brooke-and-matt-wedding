/**
 * Central wedding configuration.
 *
 * This is the one file to edit if a date, time, address or piece of core
 * wording changes. Everything here is plain data — no logic — so it's safe
 * to hand to a non-developer to tweak later.
 */

export const couple = {
  partnerOneFirstName: "Matthew",
  partnerOneKnownAs: "Matt",
  partnerTwoFirstName: "Brooke",
  displayNames: "Matt & Brooke",
  casualNames: "Matt & Brooke",
};

export const wedding = {
  // ISO 8601 with the venue's local offset (Sydney, AEDT in October is +11:00)
  dateISO: "2027-10-09T00:00:00+11:00",
  dateDisplay: "Saturday, 9 October 2027",
  dateShort: "9 October 2027",
  location: "Sydney, NSW",
  timezone: "Australia/Sydney",
};

export const ceremony = {
  name: "Holy Family Catholic Church",
  time: "1:30 PM",
  timeISO: "2027-10-09T13:30:00+11:00",
  addressLines: ["136 Oxford Rd", "Ingleburn NSW 2565"],
  addressSingleLine: "136 Oxford Rd, Ingleburn NSW 2565",
  mapsQuery: "Holy Family Catholic Church, 136 Oxford Rd, Ingleburn NSW 2565",
  parkingNote: "Complimentary onsite parking is available at the Church.",
  photo: "/images/venues/church-placeholder.svg",
};

export const reception = {
  venueName: "Doltone House Western Sydney",
  roomName: "La Boheme",
  // Guests are asked to arrive at reception time for canapés — there is no
  // separate, later "reception start" — so this is the one time we display.
  arrivalTime: "5:30 PM",
  arrivalTimeISO: "2027-10-09T17:30:00+11:00",
  receptionTime: "5:30 PM",
  receptionTimeISO: "2027-10-09T17:30:00+11:00",
  addressLines: ["121–133 Prairie Vale Rd", "Bossley Park NSW 2176"],
  addressSingleLine: "121–133 Prairie Vale Rd, Bossley Park NSW 2176",
  mapsQuery: "Doltone House Western Sydney, 121-133 Prairie Vale Road, Bossley Park NSW 2176",
  parkingNote: "Complimentary onsite parking is available at the venue.",
  arrivalNote: "Please join us from 5:30 PM for canapés and cocktails, followed by dinner and dancing.",
  photo: "/images/venues/doltone-house-placeholder.svg",
};

export const clubMarconi = {
  intro:
    "Doltone House Western Sydney — La Boheme sits within the Club Marconi complex in Bossley Park.",
  beforeReception:
    "Between the ceremony and reception, guests are welcome to spend some time at Club Marconi, where there are coffee and food facilities available.",
  nearby:
    "Stockland Wetherill Park is also close by for anyone who would like to grab a coffee, food, or browse the shops beforehand.",
};

export const dressCode = {
  heading: "Formal Attire",
  men: "Suit and tie",
  women: "Formal dresses / elegant formal attire",
  note: "We would love to see everyone dressed up for the occasion.",
  palette: ["Wine", "Olive", "Ivory"],
};

export const childFree = {
  heading: "A Grown-Up Celebration",
  body: [
    "With love, we have chosen to make our wedding an adults-only celebration, with the exception of a small number of children within our immediate family.",
    "We completely understand that little ones — particularly newborns — can make wedding plans a little more complicated. If you are expecting, have a newborn, or have circumstances you'd like to discuss with us, please reach out. We would love to chat and make things as easy as possible.",
  ],
};

export const gifts = {
  heading: "Wishing Well",
  body: [
    "Your presence at our wedding is truly the greatest gift.",
    "For those who would like to give something, we would be very grateful for a contribution to our wishing well as we begin this next chapter together.",
  ],
};

export const transport = {
  note: "Taxis and Uber are available if required.",
  travelTimeNote: "Please allow additional travel time between the ceremony and reception.",
};

// A short, single-stage itinerary — ceremony, then reception at 5:30 PM.
export const itinerary = [
  {
    time: "1:30 PM",
    title: "Wedding Ceremony",
    location: "Holy Family Catholic Church, Ingleburn",
  },
  {
    time: "5:30 PM",
    title: "Reception — Canapés, Dinner & Dancing",
    location: "Doltone House Western Sydney, La Boheme",
  },
];

export const dietaryOptions = [
  { value: "none", label: "No dietary requirements" },
  { value: "vegetarian", label: "Vegetarian" },
  { value: "vegan", label: "Vegan" },
  { value: "gluten_free", label: "Gluten free" },
  { value: "halal", label: "Halal" },
  { value: "other", label: "Other" },
] as const;

// Everything now lives on one page — this nav just scrolls to a section.
export const nav = {
  public: [
    { href: "#details", label: "Details" },
    { href: "#timeline", label: "The Day" },
    { href: "#moments", label: "Moments" },
    { href: "#faq", label: "FAQ" },
  ],
  portal: [
    { href: "/portal", label: "Home" },
    { href: "/portal/rsvp", label: "My RSVP" },
    { href: "/portal/group", label: "My Group" },
    { href: "/portal/details", label: "Wedding Details" },
    { href: "/portal/gallery", label: "Gallery" },
  ],
};

export const siteMeta = {
  title: "Matt & Brooke — 9 October 2027",
  description: "Join us as we celebrate our wedding in Sydney, NSW on 9 October 2027.",
};
