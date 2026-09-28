-- ============================================================================
-- Brooke & Matt — Wedding guest database schema
-- ============================================================================
-- Design notes:
--   * All application access goes through the Next.js server using the
--     Supabase SERVICE ROLE key. That key bypasses RLS by design.
--   * Row Level Security is still enabled on every table with NO policies
--     granted to `anon` / `authenticated`, so if the anon/public key were
--     ever used (e.g. accidentally shipped client-side), it would see
--     nothing at all. This is a deliberate defence-in-depth backstop.
--   * Guest login is name-based (not Supabase Auth) so matching, sessions
--     and rate limiting are handled in application code (see /src/lib/auth).
-- ============================================================================

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- groups: a household / party invited together
-- ---------------------------------------------------------------------------
create table if not exists groups (
  id uuid primary key default gen_random_uuid(),
  group_name text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- guests: every named, invited individual
-- ---------------------------------------------------------------------------
create table if not exists guests (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references groups(id) on delete cascade,

  full_name text not null,                 -- canonical name as invited, e.g. "Christopher Michael Smith"
  normalized_name text not null,           -- lowercase, trimmed, single-spaced, punctuation-stripped
  alt_names text[] not null default '{}',  -- explicit, admin-approved alternate names (already normalized)
  preferred_first_name text,               -- used for "Welcome, John" greetings; derived if not set

  email text,
  phone text,

  age_category text not null default 'adult'
    check (age_category in ('adult', 'child')),

  invited boolean not null default true,
  invitation_type text not null default 'full'
    check (invitation_type in ('full', 'ceremony_only', 'reception_only')),

  rsvp_status text not null default 'pending'
    check (rsvp_status in ('pending', 'attending', 'declined')),

  dietary_requirement text
    check (dietary_requirement in ('none', 'vegetarian', 'vegan', 'gluten_free', 'halal', 'other')),
  dietary_notes text,

  guest_notes text,       -- admin-only internal notes, never shown to the guest

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint guests_normalized_name_unique unique (normalized_name)
);

create index if not exists idx_guests_group_id on guests(group_id);
create index if not exists idx_guests_normalized_name on guests(normalized_name);
create index if not exists idx_guests_rsvp_status on guests(rsvp_status);
create index if not exists idx_guests_dietary on guests(dietary_requirement);

-- ---------------------------------------------------------------------------
-- group_notes: one free-text "anything else we should know" per household
-- ---------------------------------------------------------------------------
create table if not exists group_notes (
  group_id uuid primary key references groups(id) on delete cascade,
  note text,
  updated_at timestamptz not null default now(),
  updated_by_guest_id uuid references guests(id) on delete set null
);

-- ---------------------------------------------------------------------------
-- rsvp_history: append-only audit trail of every RSVP change, for admin
-- "view RSVP history" and for peace of mind if something needs correcting
-- ---------------------------------------------------------------------------
create table if not exists rsvp_history (
  id uuid primary key default gen_random_uuid(),
  guest_id uuid not null references guests(id) on delete cascade,
  attending boolean not null,
  dietary_requirement text,
  dietary_notes text,
  changed_by_guest_id uuid references guests(id) on delete set null,
  changed_at timestamptz not null default now()
);

create index if not exists idx_rsvp_history_guest_id on rsvp_history(guest_id);

-- ---------------------------------------------------------------------------
-- admins: Brooke & Matt's login for the hidden dashboard
-- ---------------------------------------------------------------------------
create table if not exists admins (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  password_hash text not null,
  display_name text,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- login_attempts: brute-force protection & auditing for BOTH login types
-- ---------------------------------------------------------------------------
create table if not exists login_attempts (
  id bigserial primary key,
  kind text not null check (kind in ('guest', 'admin')),
  identifier text not null,     -- normalized name (guest) or email (admin)
  ip text,
  success boolean not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_login_attempts_lookup on login_attempts(kind, identifier, created_at);
create index if not exists idx_login_attempts_ip on login_attempts(ip, created_at);

-- ---------------------------------------------------------------------------
-- site_settings: a handful of admin-editable, live values (kept intentionally
-- small — structural details like venue/date live in the app config file,
-- per project scope; this table is for things worth changing without a
-- redeploy, e.g. a homepage announcement banner or pausing RSVPs).
-- ---------------------------------------------------------------------------
create table if not exists site_settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

insert into site_settings (key, value) values
  ('rsvp_open', 'true'),
  ('announcement', 'null')
on conflict (key) do nothing;

-- ---------------------------------------------------------------------------
-- updated_at triggers
-- ---------------------------------------------------------------------------
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_groups_updated_at on groups;
create trigger trg_groups_updated_at before update on groups
  for each row execute function set_updated_at();

drop trigger if exists trg_guests_updated_at on guests;
create trigger trg_guests_updated_at before update on guests
  for each row execute function set_updated_at();

-- ---------------------------------------------------------------------------
-- name normalization helper (mirrors the TypeScript logic in
-- src/lib/auth/name-match.ts — kept here too for DB-side dedupe checks)
-- ---------------------------------------------------------------------------
create or replace function normalize_guest_name(raw text)
returns text as $$
  select trim(regexp_replace(
    regexp_replace(lower(coalesce(raw, '')), '[^a-z0-9\s'']', '', 'g'),
    '\s+', ' ', 'g'
  ));
$$ language sql immutable;

-- ---------------------------------------------------------------------------
-- Row Level Security — deny by default for anon & authenticated.
-- The Next.js server talks to Supabase with the SERVICE ROLE key, which
-- bypasses RLS entirely, so the app is unaffected. This exists purely as a
-- safety net against ever using the anon key against these tables.
-- ---------------------------------------------------------------------------
alter table groups enable row level security;
alter table guests enable row level security;
alter table group_notes enable row level security;
alter table rsvp_history enable row level security;
alter table admins enable row level security;
alter table login_attempts enable row level security;
alter table site_settings enable row level security;

-- (No policies are created — default-deny for anon/authenticated roles.)

-- ---------------------------------------------------------------------------
-- Realtime: let the server (service role) subscribe to changes on `guests`
-- so the admin dashboard can push live updates over SSE. This does NOT
-- expose data to the browser — only the Next.js server subscribes, using
-- the service role key (see /src/app/api/admin/live/route.ts).
-- ---------------------------------------------------------------------------
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and tablename = 'guests'
  ) then
    alter publication supabase_realtime add table guests;
  end if;
end $$;
