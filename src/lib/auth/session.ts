import "server-only";
import { SignJWT, jwtVerify } from "jose";
import type { AdminSessionPayload, GuestSessionPayload } from "@/lib/types";

const GUEST_COOKIE = "wg_session";
const ADMIN_COOKIE = "wa_session";
const GUEST_MAX_AGE_SECONDS = 60 * 60 * 24 * 180; // 180 days — this is a "remember me" style portal
const ADMIN_MAX_AGE_SECONDS = 60 * 60 * 12; // 12 hours

function getSecret(): Uint8Array {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error(
      "SESSION_SECRET is missing or too short. Set a long random value in your environment."
    );
  }
  return new TextEncoder().encode(secret);
}

export const guestCookieName = GUEST_COOKIE;
export const adminCookieName = ADMIN_COOKIE;
export const guestSessionMaxAge = GUEST_MAX_AGE_SECONDS;
export const adminSessionMaxAge = ADMIN_MAX_AGE_SECONDS;

export async function signGuestSession(payload: GuestSessionPayload): Promise<string> {
  return new SignJWT({ ...payload, kind: "guest" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${GUEST_MAX_AGE_SECONDS}s`)
    .sign(getSecret());
}

export async function verifyGuestSession(token: string): Promise<GuestSessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    if (payload.kind !== "guest") return null;
    return {
      guestId: payload.guestId as string,
      groupId: payload.groupId as string,
      fullName: payload.fullName as string,
    };
  } catch {
    return null;
  }
}

export async function signAdminSession(payload: AdminSessionPayload): Promise<string> {
  return new SignJWT({ ...payload, kind: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${ADMIN_MAX_AGE_SECONDS}s`)
    .sign(getSecret());
}

export async function verifyAdminSession(token: string): Promise<AdminSessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    if (payload.kind !== "admin") return null;
    return {
      adminId: payload.adminId as string,
      email: payload.email as string,
      displayName: (payload.displayName as string) ?? null,
    };
  } catch {
    return null;
  }
}
