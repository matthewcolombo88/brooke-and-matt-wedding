import "server-only";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import type { Group, GroupNote, Guest } from "@/lib/types";

export interface HouseholdData {
  group: Group;
  guests: Guest[];
  note: GroupNote | null;
}

/**
 * Loads a household by group id. Always scope this call to the group_id
 * that came from a verified session token — never from client input.
 */
export async function getHouseholdByGroupId(groupId: string): Promise<HouseholdData | null> {
  const supabase = getSupabaseAdmin();

  const [{ data: group, error: groupError }, { data: guests, error: guestsError }, { data: note }] =
    await Promise.all([
      supabase.from("groups").select("*").eq("id", groupId).single(),
      supabase
        .from("guests")
        .select("*")
        .eq("group_id", groupId)
        .order("age_category", { ascending: false }) // adults first
        .order("full_name", { ascending: true }),
      supabase.from("group_notes").select("*").eq("group_id", groupId).maybeSingle(),
    ]);

  if (groupError || !group) return null;
  if (guestsError || !guests) return null;

  return { group, guests, note: note ?? null };
}
