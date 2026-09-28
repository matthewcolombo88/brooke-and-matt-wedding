import { NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/auth/current";
import { getSupabaseAdmin } from "@/lib/supabase/server";

function csvEscape(value: string | null | undefined): string {
  const v = value ?? "";
  if (/[",\n]/.test(v)) {
    return `"${v.replace(/"/g, '""')}"`;
  }
  return v;
}

export async function GET() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Not authorized" }, { status: 401 });
  }

  const supabase = getSupabaseAdmin();
  const { data: guests, error } = await supabase
    .from("guests")
    .select("full_name, groups(group_name), rsvp_status, dietary_requirement, dietary_notes, guest_notes, updated_at")
    .order("full_name", { ascending: true });

  if (error || !guests) {
    return NextResponse.json({ error: "Could not load guest list" }, { status: 500 });
  }

  const header = ["Name", "Group", "RSVP", "Dietary Requirements", "Dietary Notes", "Notes", "Last Updated"];
  const rows = guests.map((g: any) => [
    csvEscape(g.full_name),
    csvEscape(g.groups?.group_name),
    csvEscape(g.rsvp_status),
    csvEscape(g.dietary_requirement),
    csvEscape(g.dietary_notes),
    csvEscape(g.guest_notes),
    csvEscape(new Date(g.updated_at).toLocaleString("en-AU")),
  ]);

  const csv = [header.join(","), ...rows.map((r) => r.join(","))].join("\n");
  const filename = `wedding-guest-list-${new Date().toISOString().slice(0, 10)}.csv`;

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
