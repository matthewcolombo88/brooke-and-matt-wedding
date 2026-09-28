import "server-only";
import { getSupabaseAdmin } from "@/lib/supabase/server";

const WINDOW_MINUTES = 15;
const MAX_FAILED_ATTEMPTS = { guest: 8, admin: 6 } as const;

/**
 * Postgres-backed rate limiting (durable across serverless instances, unlike
 * an in-memory map). Checks failed attempts for this identifier AND this IP
 * independently — either one tripping the limit blocks the request.
 */
export async function isRateLimited(
  kind: "guest" | "admin",
  identifier: string,
  ip: string
): Promise<boolean> {
  const supabase = getSupabaseAdmin();
  const since = new Date(Date.now() - WINDOW_MINUTES * 60 * 1000).toISOString();
  const limit = MAX_FAILED_ATTEMPTS[kind];

  const [byIdentifier, byIp] = await Promise.all([
    supabase
      .from("login_attempts")
      .select("id", { count: "exact", head: true })
      .eq("kind", kind)
      .eq("identifier", identifier)
      .eq("success", false)
      .gte("created_at", since),
    supabase
      .from("login_attempts")
      .select("id", { count: "exact", head: true })
      .eq("kind", kind)
      .eq("ip", ip)
      .eq("success", false)
      .gte("created_at", since),
  ]);

  const identifierCount = byIdentifier.count ?? 0;
  const ipCount = byIp.count ?? 0;

  return identifierCount >= limit || ipCount >= limit * 3;
}

export async function recordLoginAttempt(
  kind: "guest" | "admin",
  identifier: string,
  ip: string,
  success: boolean
): Promise<void> {
  const supabase = getSupabaseAdmin();
  await supabase.from("login_attempts").insert({ kind, identifier, ip, success });
}
