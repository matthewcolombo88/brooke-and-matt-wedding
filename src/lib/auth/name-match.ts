/**
 * Guest name normalization.
 *
 * Mirrors `normalize_guest_name()` in supabase/migrations/0001_init.sql —
 * keep the two in sync. This performs ONLY safe, conservative normalization
 * (case, whitespace, punctuation) and deliberately does NOT do fuzzy or
 * partial matching: "Chris Smith" must not match "Christopher Michael
 * Smith" unless an admin has explicitly added "chris smith" to that guest's
 * alt_names.
 */
export function normalizeGuestName(raw: string): string {
  return raw
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "") // strip accents (José -> jose)
    .replace(/[^a-z0-9\s']/g, "") // drop punctuation except apostrophes
    .replace(/\s+/g, " ")
    .trim();
}

export function isPlausibleName(raw: string): boolean {
  const trimmed = raw.trim();
  if (trimmed.length < 2 || trimmed.length > 120) return false;
  // Require at least one letter.
  return /[a-zA-Z]/.test(trimmed);
}

export function deriveFirstName(fullName: string): string {
  const parts = fullName.trim().split(/\s+/);
  return parts[0] ?? fullName;
}
