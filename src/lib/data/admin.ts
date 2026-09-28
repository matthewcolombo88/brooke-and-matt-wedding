import "server-only";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import type { DashboardStats, Group, Guest } from "@/lib/types";

export async function getDashboardStats(): Promise<DashboardStats> {
  const supabase = getSupabaseAdmin();
  const { data: guests, error } = await supabase
    .from("guests")
    .select("rsvp_status, age_category, dietary_requirement, invited")
    .eq("invited", true);

  if (error || !guests) {
    return {
      totalInvited: 0,
      totalAttending: 0,
      totalDeclined: 0,
      totalAwaiting: 0,
      attendingAdults: 0,
      attendingChildren: 0,
      dietaryBreakdown: {},
    };
  }

  const stats: DashboardStats = {
    totalInvited: guests.length,
    totalAttending: 0,
    totalDeclined: 0,
    totalAwaiting: 0,
    attendingAdults: 0,
    attendingChildren: 0,
    dietaryBreakdown: {},
  };

  for (const g of guests) {
    if (g.rsvp_status === "attending") {
      stats.totalAttending++;
      if (g.age_category === "adult") stats.attendingAdults++;
      else stats.attendingChildren++;
      if (g.dietary_requirement && g.dietary_requirement !== "none") {
        stats.dietaryBreakdown[g.dietary_requirement] =
          (stats.dietaryBreakdown[g.dietary_requirement] ?? 0) + 1;
      }
    } else if (g.rsvp_status === "declined") {
      stats.totalDeclined++;
    } else {
      stats.totalAwaiting++;
    }
  }

  return stats;
}

export interface GuestFilters {
  status?: "all" | "pending" | "attending" | "declined";
  dietary?: string;
  search?: string;
}

export interface GuestRow extends Guest {
  groups: { group_name: string } | null;
}

export async function listGuests(filters: GuestFilters): Promise<GuestRow[]> {
  const supabase = getSupabaseAdmin();
  let query = supabase
    .from("guests")
    .select("*, groups(group_name)")
    .order("updated_at", { ascending: false });

  if (filters.status && filters.status !== "all") {
    query = query.eq("rsvp_status", filters.status);
  }
  if (filters.dietary) {
    query = query.eq("dietary_requirement", filters.dietary);
  }
  if (filters.search) {
    query = query.ilike("full_name", `%${filters.search}%`);
  }

  const { data, error } = await query;
  if (error || !data) return [];
  return data as unknown as GuestRow[];
}

export async function listGroups(): Promise<(Group & { guest_count: number })[]> {
  const supabase = getSupabaseAdmin();
  const { data: groups, error } = await supabase
    .from("groups")
    .select("*, guests(count)")
    .order("group_name", { ascending: true });

  if (error || !groups) return [];

  return groups.map((g: any) => ({
    ...g,
    guest_count: g.guests?.[0]?.count ?? 0,
  }));
}

export async function getGuestHistory(guestId: string) {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("rsvp_history")
    .select("*")
    .eq("guest_id", guestId)
    .order("changed_at", { ascending: false });
  if (error || !data) return [];
  return data;
}
