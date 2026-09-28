/**
 * Metadata for the couple's real engagement photos, processed into
 * /public/images/gallery/full. Widths/heights are recorded up front so
 * next/image never has to guess (avoids layout shift). Replace or add
 * entries here as new photos arrive — see /public/images/README.md.
 *
 * Every photo lives in one place (gallery/full) and is reused across the
 * one-page site (hero + moments strip) — no duplicate files to keep in
 * sync.
 */

export const fullGallery = [
  { src: "/images/gallery/full/photo-01.jpg", width: 2200, height: 1467, alt: "Walking hand in hand along the Stockton Sand Dunes" },
  { src: "/images/gallery/full/photo-02.jpg", width: 2200, height: 1467, alt: "Following the ridge of the dunes at golden hour" },
  { src: "/images/gallery/full/photo-03.jpg", width: 1467, height: 2200, alt: "Laughing together in the afternoon sun" },
  { src: "/images/gallery/full/photo-04.jpg", width: 1467, height: 2200, alt: "A quiet moment together on the dunes" },
  { src: "/images/gallery/full/photo-05.jpg", width: 1467, height: 2200, alt: "A close-up of the engagement ring" },
  { src: "/images/gallery/full/photo-06.jpg", width: 2200, height: 1467, alt: "Popping champagne on the rocks at sunset" },
  { src: "/images/gallery/full/photo-07.jpg", width: 2200, height: 1467, alt: "A tender moment as the sun sets over the ocean" },
  { src: "/images/gallery/full/photo-08.jpg", width: 2200, height: 1467, alt: "Running along the shoreline at sunset" },
  { src: "/images/gallery/full/photo-09.jpg", width: 2200, height: 1467, alt: "A sunset portrait on the beach" },
  { src: "/images/gallery/full/photo-10.jpg", width: 2200, height: 1467, alt: "A gentle kiss as the sun goes down" },
  { src: "/images/gallery/full/photo-11.jpg", width: 2200, height: 1467, alt: "Dancing together, reflected in the wet sand at sunset" },
  { src: "/images/gallery/full/photo-12.jpg", width: 1467, height: 2200, alt: "A joyful lift in the shallows at sunset" },
];

// photo-11: dancing, reflected in the wet sand at sunset
export const heroPhoto = fullGallery[10];

// A small, varied set for the "Favourite Moments" strip on the one-pager.
export const momentsPhotos = [fullGallery[2], fullGallery[4], fullGallery[7], fullGallery[11]];
