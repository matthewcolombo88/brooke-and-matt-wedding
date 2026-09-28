"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import { adminCookieName, adminSessionMaxAge, signAdminSession } from "@/lib/auth/session";
import { getClientIp } from "@/lib/request-ip";
import { isRateLimited, recordLoginAttempt } from "@/lib/rate-limit";
import { getCurrentAdmin } from "@/lib/auth/current";
import { normalizeGuestName, isPlausibleName } from "@/lib/auth/name-match";
import { verifyPassword } from "@/lib/auth/password";

export interface AdminLoginState {
  error?: string;
}

export async function adminLoginAction(
  _prevState: AdminLoginState,
  formData: FormData
): Promise<AdminLoginState> {
  const email = String(formData.get("email") ?? "").toLowerCase().trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Enter your email and password." };
  }

  const ip = getClientIp();

  if (await isRateLimited("admin", email, ip)) {
    return { error: "Too many attempts. Please wait a few minutes and try again." };
  }

  const supabase = getSupabaseAdmin();
  const { data: admin, error } = await supabase
    .from("admins")
    .select("id, email, password_hash, display_name")
    .eq("email", email)
    .maybeSingle();

  if (error || !admin) {
    await recordLoginAttempt("admin", email, ip, false);
    return { error: "Incorrect email or password." };
  }

  const valid = await verifyPassword(password, admin.password_hash);
  if (!valid) {
    await recordLoginAttempt("admin", email, ip, false);
    return { error: "Incorrect email or password." };
  }

  await recordLoginAttempt("admin", email, ip, true);

  const token = await signAdminSession({
    adminId: admin.id,
    email: admin.email,
    displayName: admin.display_name,
  });

  cookies().set({
    name: adminCookieName,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: adminSessionMaxAge,
  });

  redirect("/admin");
}

export async function adminLogoutAction(): Promise<void> {
  cookies().delete(adminCookieName);
  redirect("/admin/login");
}

async function requireAdmin() {
  const admin = await getCurrentAdmin();
  if (!admin) throw new Error("Not authorized.");
  return admin;
}

export interface FormActionState {
  error?: string;
  success?: boolean;
}

export async function createGroupAction(
  _prevState: FormActionState,
  formData: FormData
): Promise<FormActionState> {
  await requireAdmin();
  const groupName = String(formData.get("group_name") ?? "").trim();
  if (!groupName) return { error: "Group name is required." };

  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from("groups").insert({ group_name: groupName });
  if (error) return { error: "Could not create group. Please try again." };

  revalidatePath("/admin/groups");
  return { success: true };
}

export async function renameGroupAction(
  _prevState: FormActionState,
  formData: FormData
): Promise<FormActionState> {
  await requireAdmin();
  const groupId = String(formData.get("group_id") ?? "");
  const groupName = String(formData.get("group_name") ?? "").trim();
  if (!groupId || !groupName) return { error: "Missing group details." };

  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from("groups").update({ group_name: groupName }).eq("id", groupId);
  if (error) return { error: "Could not rename group." };

  revalidatePath("/admin/groups");
  return { success: true };
}

export async function deleteGroupAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const groupId = String(formData.get("group_id") ?? "");
  if (!groupId) return;
  const supabase = getSupabaseAdmin();
  await supabase.from("groups").delete().eq("id", groupId);
  revalidatePath("/admin/groups");
  revalidatePath("/admin/guests");
}

export interface GuestFormState {
  error?: string;
  success?: boolean;
}

export async function addGuestAction(
  _prevState: GuestFormState,
  formData: FormData
): Promise<GuestFormState> {
  await requireAdmin();

  const fullName = String(formData.get("full_name") ?? "").trim();
  const groupId = String(formData.get("group_id") ?? "");
  const ageCategory = String(formData.get("age_category") ?? "adult");
  const invitationType = String(formData.get("invitation_type") ?? "full");
  const email = String(formData.get("email") ?? "").trim() || null;
  const phone = String(formData.get("phone") ?? "").trim() || null;
  const altNamesRaw = String(formData.get("alt_names") ?? "");
  const preferredFirstName = String(formData.get("preferred_first_name") ?? "").trim() || null;
  const guestNotes = String(formData.get("guest_notes") ?? "").trim() || null;

  if (!isPlausibleName(fullName)) return { error: "Enter a valid full name." };
  if (!groupId) return { error: "Choose a group for this guest." };

  const altNames = altNamesRaw
    .split(",")
    .map((n) => normalizeGuestName(n))
    .filter(Boolean);

  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from("guests").insert({
    full_name: fullName,
    normalized_name: normalizeGuestName(fullName),
    alt_names: altNames,
    group_id: groupId,
    age_category: ageCategory,
    invitation_type: invitationType,
    email,
    phone,
    preferred_first_name: preferredFirstName,
    guest_notes: guestNotes,
  });

  if (error) {
    if (error.code === "23505") {
      return {
        error:
          "Someone with this exact name already exists. Add a middle name/initial, or add this spelling as an alternate name on the existing guest instead.",
      };
    }
    return { error: "Could not add guest. Please try again." };
  }

  revalidatePath("/admin/guests");
  revalidatePath("/admin/groups");
  revalidatePath("/admin");
  return { success: true };
}

export async function updateGuestAction(
  _prevState: GuestFormState,
  formData: FormData
): Promise<GuestFormState> {
  await requireAdmin();

  const guestId = String(formData.get("guest_id") ?? "");
  if (!guestId) return { error: "Missing guest id." };

  const fullName = String(formData.get("full_name") ?? "").trim();
  const groupId = String(formData.get("group_id") ?? "");
  const ageCategory = String(formData.get("age_category") ?? "adult");
  const invitationType = String(formData.get("invitation_type") ?? "full");
  const invited = formData.get("invited") === "on";
  const rsvpStatus = String(formData.get("rsvp_status") ?? "pending");
  const dietaryRequirement = String(formData.get("dietary_requirement") ?? "") || null;
  const dietaryNotes = String(formData.get("dietary_notes") ?? "").trim() || null;
  const email = String(formData.get("email") ?? "").trim() || null;
  const phone = String(formData.get("phone") ?? "").trim() || null;
  const altNamesRaw = String(formData.get("alt_names") ?? "");
  const preferredFirstName = String(formData.get("preferred_first_name") ?? "").trim() || null;
  const guestNotes = String(formData.get("guest_notes") ?? "").trim() || null;

  if (!isPlausibleName(fullName)) return { error: "Enter a valid full name." };

  const altNames = altNamesRaw
    .split(",")
    .map((n) => normalizeGuestName(n))
    .filter(Boolean);

  const supabase = getSupabaseAdmin();
  const { error } = await supabase
    .from("guests")
    .update({
      full_name: fullName,
      normalized_name: normalizeGuestName(fullName),
      alt_names: altNames,
      group_id: groupId,
      age_category: ageCategory,
      invitation_type: invitationType,
      invited,
      rsvp_status: rsvpStatus,
      dietary_requirement: dietaryRequirement,
      dietary_notes: dietaryNotes,
      email,
      phone,
      preferred_first_name: preferredFirstName,
      guest_notes: guestNotes,
    })
    .eq("id", guestId);

  if (error) {
    if (error.code === "23505") {
      return { error: "Another guest already has this exact name." };
    }
    return { error: "Could not update guest." };
  }

  revalidatePath("/admin/guests");
  revalidatePath("/admin/groups");
  revalidatePath("/admin");
  return { success: true };
}

export async function deleteGuestAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const guestId = String(formData.get("guest_id") ?? "");
  if (!guestId) return;
  const supabase = getSupabaseAdmin();
  await supabase.from("guests").delete().eq("id", guestId);
  revalidatePath("/admin/guests");
  revalidatePath("/admin/groups");
  revalidatePath("/admin");
}

export async function updateAnnouncementAction(
  _prevState: FormActionState,
  formData: FormData
): Promise<FormActionState> {
  await requireAdmin();
  const text = String(formData.get("announcement") ?? "").trim();
  const rsvpOpen = formData.get("rsvp_open") === "on";

  const supabase = getSupabaseAdmin();
  await supabase.from("site_settings").upsert([
    { key: "announcement", value: text ? JSON.stringify(text) : "null" },
    { key: "rsvp_open", value: JSON.stringify(rsvpOpen) },
  ]);

  revalidatePath("/");
  revalidatePath("/admin");
  return { success: true };
}
