import { getCurrentAdmin } from "@/lib/auth/current";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import { getDashboardStats } from "@/lib/data/admin";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * Server-Sent Events stream of live dashboard stats.
 *
 * Why SSE + a server-side Realtime subscription (rather than the browser
 * subscribing to Supabase Realtime directly): the admin session here is a
 * custom signed cookie, not a Supabase Auth session, so there's no safe way
 * to let the browser hold a Supabase client with read access to the guests
 * table. Instead, THIS route (running with the service role key, server
 * side only) subscribes to Postgres changes and re-broadcasts nothing but
 * aggregate counts down to the already-authenticated admin's browser. No
 * guest names or personal details ever leave the server for this feed.
 */
export async function GET() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return new Response("Not authorized", { status: 401 });
  }

  const supabase = getSupabaseAdmin();
  const encoder = new TextEncoder();
  let cleanup: (() => void) | undefined;

  const stream = new ReadableStream({
    async start(controller) {
      const send = async () => {
        try {
          const stats = await getDashboardStats();
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(stats)}\n\n`));
        } catch {
          // If a single push fails, the next DB change or heartbeat will retry.
        }
      };

      await send();

      const channel = supabase
        .channel("admin-dashboard-stats")
        .on("postgres_changes", { event: "*", schema: "public", table: "guests" }, send)
        .subscribe();

      const heartbeat = setInterval(() => {
        controller.enqueue(encoder.encode(`: keep-alive\n\n`));
      }, 20000);

      cleanup = () => {
        clearInterval(heartbeat);
        supabase.removeChannel(channel);
      };
    },
    cancel() {
      cleanup?.();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
