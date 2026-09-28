/**
 * Bootstraps (or resets) the first admin account from environment variables.
 *
 * Usage:
 *   ADMIN_BOOTSTRAP_EMAIL=you@example.com \
 *   ADMIN_BOOTSTRAP_PASSWORD=a-strong-password \
 *   ADMIN_BOOTSTRAP_NAME="Brooke & Matt" \
 *   npm run seed:admin
 *
 * Safe to re-run: it upserts by email, so running it again just resets the
 * password to whatever ADMIN_BOOTSTRAP_PASSWORD currently is.
 */
import "dotenv/config";
import { createClient } from "@supabase/supabase-js";
import { hashPassword } from "../src/lib/auth/password";

async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const email = process.env.ADMIN_BOOTSTRAP_EMAIL;
  const password = process.env.ADMIN_BOOTSTRAP_PASSWORD;
  const name = process.env.ADMIN_BOOTSTRAP_NAME ?? "Admin";

  if (!url || !serviceKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in the environment."
    );
  }
  if (!email || !password) {
    throw new Error(
      "Set ADMIN_BOOTSTRAP_EMAIL and ADMIN_BOOTSTRAP_PASSWORD before running this script."
    );
  }
  if (password.length < 10) {
    throw new Error("Choose a password of at least 10 characters.");
  }

  const supabase = createClient(url, serviceKey, {
    auth: { persistSession: false },
  });

  const passwordHash = await hashPassword(password);

  const { error } = await supabase
    .from("admins")
    .upsert(
      { email: email.toLowerCase().trim(), password_hash: passwordHash, display_name: name },
      { onConflict: "email" }
    );

  if (error) {
    throw error;
  }

  console.log(`✔ Admin account ready for ${email}. You can now log in at /admin/login.`);
}

main().catch((err) => {
  console.error("✘ Failed to create admin:", err.message ?? err);
  process.exit(1);
});
