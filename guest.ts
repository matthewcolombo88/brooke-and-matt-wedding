"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import { isPlausibleName, normalizeGuestName } from "@/lib/auth/name-match";
import { guestCookieName, guestSessionMaxAge, signGuestSession } from "@/lib/auth/session";
import { getClientIp } from "@/lib/request-ip";
import { isRateLimited, recordLoginAttempt } from "@/lib/rate-limit";
import { getCurrentGuest } from "@/lib/auth/current";
import { dietaryOptions } from "@/lib/config";

export interface GuestLoginState {
  error?: string;
}

const GENERIC_NOT_FOUND =
  "We couldn't find that name on our guest list. Please make sure you've entered your full name exactly as it appears on your invitation.";
const GENERIC_TROUBLE = "We're having trouble loading your invitation right now. Please try again shortly.";
const RATE_LIMITED_MESSAGE = "Too many attempts. Please wait a few minutes and try again.";

export async function loginGuestAction(
  _prevState: GuestLoginState,
  formData: FormData
): Promise<GuestLoginState> {
  const rawName = String(formData.get("full_name") ?? "");

  if (!isPlausibleName(rawName)) {
    return { error: GENERIC_NOT_FOUND };
  }

  const normalized = normalizeGuestName(rawName);
  const ip = getClientIp();

  try {
    if (await isRateLimited("guest", normalized, ip)) {
      return { error: RATE_LIMITED_MESSAGE };
    }

    const supabase = getSupabaseAdmin();
    const { data: candidates, error } = await supabase
      .from("guests")
      .select("id, group_id, full_name, normalized_name, alt_names, invited")
      .or(`normalized_name.eq.${normalized},alt_names.cs.{${normalized}}`)
      .limit(2);

    if (error) {
      return { error: GENERIC_TROUBLE };
    }

    const match = candidates?.find((c) => c.invited);

    if (!match) {
      await recordLoginAttempt("guest", normalized, ip, false);
      return { error: GENERIC_NOT_FOUND };
    }

    await recordLoginAttempt("guest", normalized, ip, true);

    const token = await signGuestSession({
      guestId: match.id,
      groupId: match.group_id,
      fullName: match.full_name,
    });

    cookies().set({
      name: guestCookieName,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: guestSessionMaxAge,
    });
  } catch {
    return { error: GENERIC_TROUBLE };
  }

  redirect("/portal");
}

export async function logoutGuestAction(): Promise<void> {
  cookies().delete(guestCookieName);
  redirect("/");
}

export interface RsvpSubmitState {
  error?: string;
  success?: boolean;
}

const dietaryValues = new Set<string>(dietaryOptions.map((d) => d.value));

export async function submitRsvpAction(
  _prevState: RsvpSubmitState,
  formData: FormData
): Promise<RsvpSubmitState> {
  const session = await getCurrentGuest();
  if (!session) {
    return { error: "Your session has expired. Please log in again." };
  }

  const supabase = getSupabaseAdmin();

  // Only ever act on guests that genuinely belong to this session's group —
  // guest ids are never trusted from the form alone.
  const { data: householdGuests, error: householdError } = await supabase
    .from("guests")
    .select("id")
    .eq("group_id", session.groupId);

  if (householdError || !householdGuests) {
    return { error: GENERIC_TROUBLE };
  }

  const validIds = new Set(householdGuests.map((g) => g.id));
  const now = new Date().toISOString();

  for (const guestId of validIds) {
    const attendance = String(formData.get(`attendance_${guestId}`) ?? "pending");
    if (!["attending", "declined", "pending"].includes(attendance)) continue;

    let dietary: string | null = null;
    let dietaryNotes: string | null = null;

    if (attendance === "attending") {
      const rawDietary = String(formData.get(`dietary_${guestId}`) ?? "none");
      dietary = dietaryValues.has(rawDietary) ? rawDietary : "none";
      if (dietary === "other") {
        dietaryNotes = String(formData.get(`dietary_other_${guestId}`) ?? "").slice(0, 500) || null;
      }
    }

    const { error: updateError } = await supabase
      .from("guests")
      .update({
        rsvp_status: attendance,
        dietary_requirement: attendance === "attending" ? dietary : null,
        dietary_notes: attendance === "attending" ? dietaryNotes : null,
        updated_at: now,
      })
      .eq("id", guestId);

    if (updateError) {
      return { error: GENERIC_TROUBLE };
    }

    await supabase.from("rsvp_history").insert({
      guest_id: guestId,
      attending: attendance === "attending",
      dietary_requirement: dietary,
      dietary_notes: dietaryNotes,
      changed_by_guest_id: session.guestId,
    });
  }

  const groupNote = String(formData.get("group_note") ?? "").slice(0, 1000);
  await supabase.from("group_notes").upsert({
    group_id: session.groupId,
    note: groupNote || null,
    updated_at: now,
    updated_by_guest_id: session.guestId,
  });

  revalidatePath("/portal/rsvp");
  revalidatePath("/portal/group");
  revalidatePath("/portal");

  return { success: true };
}
