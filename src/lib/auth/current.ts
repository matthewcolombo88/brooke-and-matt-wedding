import "server-only";
import { cookies } from "next/headers";
import { adminCookieName, guestCookieName, verifyAdminSession, verifyGuestSession } from "@/lib/auth/session";
import type { AdminSessionPayload, GuestSessionPayload } from "@/lib/types";

export async function getCurrentGuest(): Promise<GuestSessionPayload | null> {
  const token = cookies().get(guestCookieName)?.value;
  if (!token) return null;
  return verifyGuestSession(token);
}

export async function getCurrentAdmin(): Promise<AdminSessionPayload | null> {
  const token = cookies().get(adminCookieName)?.value;
  if (!token) return null;
  return verifyAdminSession(token);
}
