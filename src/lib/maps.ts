/**
 * Universal Google Maps links — these work as real navigation links on
 * desktop (opens Google Maps web) and on mobile (opens the Google Maps or
 * Apple Maps app via the OS's link handling), no API key required.
 */
export function googleMapsViewUrl(query: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

export function googleMapsDirectionsUrl(query: string): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(query)}`;
}
