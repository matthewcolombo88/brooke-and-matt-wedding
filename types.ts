export type AgeCategory = "adult" | "child";
export type InvitationType = "full" | "ceremony_only" | "reception_only";
export type RsvpStatus = "pending" | "attending" | "declined";
export type DietaryRequirement =
  | "none"
  | "vegetarian"
  | "vegan"
  | "gluten_free"
  | "halal"
  | "other"
  | null;

export interface Guest {
  id: string;
  group_id: string;
  full_name: string;
  normalized_name: string;
  alt_names: string[];
  preferred_first_name: string | null;
  email: string | null;
  phone: string | null;
  age_category: AgeCategory;
  invited: boolean;
  invitation_type: InvitationType;
  rsvp_status: RsvpStatus;
  dietary_requirement: DietaryRequirement;
  dietary_notes: string | null;
  guest_notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Group {
  id: string;
  group_name: string;
  created_at: string;
  updated_at: string;
}

export interface GroupNote {
  group_id: string;
  note: string | null;
  updated_at: string;
  updated_by_guest_id: string | null;
}

export interface RsvpHistoryEntry {
  id: string;
  guest_id: string;
  attending: boolean;
  dietary_requirement: DietaryRequirement;
  dietary_notes: string | null;
  changed_by_guest_id: string | null;
  changed_at: string;
}

export interface GuestSessionPayload {
  guestId: string;
  groupId: string;
  fullName: string;
}

export interface AdminSessionPayload {
  adminId: string;
  email: string;
  displayName: string | null;
}

export interface DashboardStats {
  totalInvited: number;
  totalAttending: number;
  totalDeclined: number;
  totalAwaiting: number;
  attendingAdults: number;
  attendingChildren: number;
  dietaryBreakdown: Record<string, number>;
}
