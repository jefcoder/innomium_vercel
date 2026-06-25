-- Innomium Talent Platform — destructive reset + full schema
-- Run in Supabase SQL Editor. Wipes agency tables and data.

-- ---------------------------------------------------------------------------
-- Step 1: Drop agency artifacts
-- ---------------------------------------------------------------------------
drop policy if exists "Users can delete own avatar" on storage.objects;
drop policy if exists "Users can update own avatar" on storage.objects;
drop policy if exists "Users can upload own avatar" on storage.objects;
drop policy if exists "Avatar images are publicly accessible" on storage.objects;

drop table if exists public.requested_tasks cascade;
drop table if exists public.launched_competitions cascade;
drop table if exists public.builder_activity cascade;
drop table if exists public.client_profiles cascade;
drop table if exists public.profiles cascade;

drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.handle_new_user() cascade;

-- ---------------------------------------------------------------------------
-- Helpers
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.account_type = 'admin'
  );
$$;

-- ---------------------------------------------------------------------------
-- profiles
-- ---------------------------------------------------------------------------
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  display_name text,
  account_type text not null default 'client'
    check (account_type in ('client', 'talent_applicant', 'talent', 'admin')),
  headline text,
  bio text,
  avatar_url text,
  location text,
  timezone text,
  website_url text,
  linkedin_url text,
  github_url text,
  notification_preferences jsonb not null default '{}'::jsonb,
  stripe_customer_id text,
  stripe_connect_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- organizations & client_profiles
-- ---------------------------------------------------------------------------
create table public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  website text,
  industry text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.client_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references public.profiles (id) on delete cascade,
  organization_id uuid references public.organizations (id),
  company_name text,
  company_website text,
  industry text,
  company_size text,
  location text,
  description text,
  primary_contact_name text,
  primary_contact_email text,
  verified boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- talent
-- ---------------------------------------------------------------------------
create table public.talent_applications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references public.profiles (id) on delete cascade,
  status text not null default 'submitted'
    check (status in ('submitted', 'under_review', 'more_info_needed', 'approved', 'rejected')),
  engagement_types text[] not null default '{}',
  visibility_preference text not null default 'limited'
    check (visibility_preference in ('hidden', 'public', 'limited', 'contribution')),
  submitted_at timestamptz,
  reviewed_at timestamptz,
  reviewer_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.talent_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references public.profiles (id) on delete cascade,
  application_id uuid references public.talent_applications (id),
  professional_headline text,
  years_experience int,
  current_role text,
  visibility text not null default 'limited'
    check (visibility in ('hidden', 'public', 'limited', 'contribution')),
  availability jsonb not null default '{"consulting":false,"proprietary":false,"tasks":false,"competitions":false}'::jsonb,
  hourly_rate_cents int,
  reputation_overall numeric(4,2) not null default 0,
  reputation_consulting numeric(4,2) not null default 0,
  reputation_tasks numeric(4,2) not null default 0,
  reputation_competitions numeric(4,2) not null default 0,
  verified_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- skills
-- ---------------------------------------------------------------------------
create table public.skills (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  category text not null,
  slug text not null unique,
  created_at timestamptz not null default now()
);

create table public.skill_claims (
  id uuid primary key default gen_random_uuid(),
  talent_profile_id uuid references public.talent_profiles (id) on delete cascade,
  application_id uuid references public.talent_applications (id) on delete cascade,
  skill_id uuid not null references public.skills (id),
  level int not null default 2 check (level between 1 and 5),
  status text not null default 'pending'
    check (status in ('pending', 'verified', 'rejected', 'partial')),
  explanation text,
  visibility text not null default 'public',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.skill_evidence (
  id uuid primary key default gen_random_uuid(),
  skill_claim_id uuid not null references public.skill_claims (id) on delete cascade,
  evidence_type text not null,
  title text,
  url text,
  description text,
  file_path text,
  created_at timestamptz not null default now()
);

create table public.skill_verifications (
  id uuid primary key default gen_random_uuid(),
  skill_claim_id uuid not null references public.skill_claims (id) on delete cascade,
  reviewer_id uuid references public.profiles (id),
  outcome text not null check (outcome in ('verified', 'rejected', 'partial')),
  notes text,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- client requests
-- ---------------------------------------------------------------------------
create table public.client_requests (
  id uuid primary key default gen_random_uuid(),
  client_profile_id uuid not null references public.client_profiles (id) on delete cascade,
  request_type text not null
    check (request_type in ('consult', 'proprietary', 'task', 'competition', 'matching')),
  title text not null,
  summary text,
  description text,
  domain text,
  required_skills uuid[] default '{}',
  visibility text not null default 'innomium_only',
  visibility_config jsonb not null default '{}'::jsonb,
  status text not null default 'draft'
    check (status in ('draft', 'submitted', 'under_review', 'published', 'active', 'completed', 'closed', 'cancelled')),
  timing_type text,
  timing_config jsonb default '{}'::jsonb,
  payment_model text,
  budget_cents int,
  match_preference text default 'innomium_recommend',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.consult_requests (
  id uuid primary key default gen_random_uuid(),
  client_request_id uuid not null unique references public.client_requests (id) on delete cascade,
  consult_type text default 'mentor',
  duration_minutes int,
  hourly_rate_cents int,
  lifecycle_status text not null default 'open'
    check (lifecycle_status in ('open', 'matching', 'talent_selected', 'scheduled', 'in_progress', 'completed', 'cancelled')),
  selected_talent_id uuid references public.talent_profiles (id),
  scheduled_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.proprietary_consult_requests (
  id uuid primary key default gen_random_uuid(),
  client_request_id uuid not null unique references public.client_requests (id) on delete cascade,
  client_anonymity text not null default 'anonymous',
  talent_anonymity text not null default 'anonymous',
  disclosure_stage text not null default 'pre_nda',
  lifecycle_status text not null default 'open',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.task_requests (
  id uuid primary key default gen_random_uuid(),
  client_request_id uuid not null unique references public.client_requests (id) on delete cascade,
  task_type text,
  payment_type text check (payment_type in ('hourly', 'milestone', 'fixed')),
  lifecycle_status text not null default 'draft'
    check (lifecycle_status in ('draft', 'published', 'talent_invited', 'talent_accepted', 'client_approved', 'active', 'submitted', 'revision_requested', 'completed', 'reviewed', 'closed', 'disputed')),
  assigned_talent_id uuid references public.talent_profiles (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.task_milestones (
  id uuid primary key default gen_random_uuid(),
  task_request_id uuid not null references public.task_requests (id) on delete cascade,
  title text not null,
  deliverable text,
  due_at timestamptz,
  amount_cents int not null,
  acceptance_criteria text,
  status text not null default 'pending'
    check (status in ('pending', 'in_progress', 'submitted', 'approved', 'paid')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.time_logs (
  id uuid primary key default gen_random_uuid(),
  task_request_id uuid not null references public.task_requests (id) on delete cascade,
  talent_profile_id uuid not null references public.talent_profiles (id),
  hours numeric(6,2) not null,
  description text,
  logged_at timestamptz not null default now(),
  approved boolean not null default false,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- competitions
-- ---------------------------------------------------------------------------
create table public.competitions (
  id uuid primary key default gen_random_uuid(),
  client_request_id uuid references public.client_requests (id),
  client_profile_id uuid not null references public.client_profiles (id) on delete cascade,
  title text not null,
  description text,
  domain text,
  reward_model text not null default 'final_score',
  prize_pool_cents int,
  status text not null default 'draft'
    check (status in ('draft', 'under_review', 'published', 'registration_open', 'active', 'evaluation', 'finalized', 'completed', 'archived')),
  rules text,
  evaluation_method text,
  starts_at timestamptz,
  ends_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.competition_participants (
  id uuid primary key default gen_random_uuid(),
  competition_id uuid not null references public.competitions (id) on delete cascade,
  talent_profile_id uuid not null references public.talent_profiles (id),
  status text not null default 'registered',
  created_at timestamptz not null default now(),
  unique (competition_id, talent_profile_id)
);

create table public.competition_submissions (
  id uuid primary key default gen_random_uuid(),
  competition_id uuid not null references public.competitions (id) on delete cascade,
  participant_id uuid not null references public.competition_participants (id) on delete cascade,
  submission_url text,
  submission_notes text,
  score numeric(10,4),
  judge_notes text,
  status text not null default 'submitted',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.leaderboard_entries (
  id uuid primary key default gen_random_uuid(),
  competition_id uuid not null references public.competitions (id) on delete cascade,
  participant_id uuid not null references public.competition_participants (id) on delete cascade,
  rank int,
  score numeric(10,4) not null,
  finalized boolean not null default false,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- contracts, payments, NDA
-- ---------------------------------------------------------------------------
create table public.contracts (
  id uuid primary key default gen_random_uuid(),
  client_profile_id uuid not null references public.client_profiles (id),
  talent_profile_id uuid not null references public.talent_profiles (id),
  reference_type text not null,
  reference_id uuid not null,
  status text not null default 'active',
  terms jsonb default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.payments (
  id uuid primary key default gen_random_uuid(),
  client_profile_id uuid references public.client_profiles (id),
  reference_type text,
  reference_id uuid,
  stripe_payment_intent_id text,
  stripe_checkout_session_id text,
  amount_cents int not null,
  currency text not null default 'usd',
  status text not null default 'pending'
    check (status in ('pending', 'processing', 'succeeded', 'failed', 'refunded')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.payouts (
  id uuid primary key default gen_random_uuid(),
  talent_profile_id uuid not null references public.talent_profiles (id),
  payment_id uuid references public.payments (id),
  stripe_transfer_id text,
  amount_cents int not null,
  currency text not null default 'usd',
  status text not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.nda_agreements (
  id uuid primary key default gen_random_uuid(),
  proprietary_consult_id uuid references public.proprietary_consult_requests (id),
  user_id uuid not null references public.profiles (id),
  accepted_at timestamptz not null default now(),
  ip_address text,
  created_at timestamptz not null default now()
);

create table public.conflict_checks (
  id uuid primary key default gen_random_uuid(),
  proprietary_consult_id uuid not null references public.proprietary_consult_requests (id) on delete cascade,
  talent_profile_id uuid not null references public.talent_profiles (id),
  status text not null default 'pending'
    check (status in ('pending', 'clear', 'blocked', 'review')),
  notes text,
  checked_by uuid references public.profiles (id),
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- messaging & notifications
-- ---------------------------------------------------------------------------
create table public.message_threads (
  id uuid primary key default gen_random_uuid(),
  subject text,
  thread_type text not null,
  reference_id uuid,
  participant_ids uuid[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.messages (
  id uuid primary key default gen_random_uuid(),
  thread_id uuid not null references public.message_threads (id) on delete cascade,
  sender_id uuid not null references public.profiles (id),
  body text not null,
  created_at timestamptz not null default now()
);

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  title text not null,
  body text,
  link text,
  read boolean not null default false,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- reviews, reports, reputation
-- ---------------------------------------------------------------------------
create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  reviewer_id uuid not null references public.profiles (id),
  reviewee_id uuid not null references public.profiles (id),
  reference_type text,
  reference_id uuid,
  rating int not null check (rating between 1 and 5),
  comment text,
  dimension text,
  created_at timestamptz not null default now()
);

create table public.reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid not null references public.profiles (id),
  reported_id uuid not null references public.profiles (id),
  category text not null,
  description text,
  reference_type text,
  reference_id uuid,
  status text not null default 'submitted'
    check (status in ('submitted', 'under_review', 'confirmed', 'dismissed')),
  admin_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.reputation_events (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles (id) on delete cascade,
  event_type text not null,
  dimension text,
  delta numeric(4,2) not null,
  reference_type text,
  reference_id uuid,
  created_at timestamptz not null default now()
);

create table public.admin_notes (
  id uuid primary key default gen_random_uuid(),
  admin_id uuid not null references public.profiles (id),
  target_type text not null,
  target_id uuid not null,
  note text not null,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- request invitations & opportunities
-- ---------------------------------------------------------------------------
create table public.request_invitations (
  id uuid primary key default gen_random_uuid(),
  client_request_id uuid not null references public.client_requests (id) on delete cascade,
  talent_profile_id uuid not null references public.talent_profiles (id),
  status text not null default 'pending'
    check (status in ('pending', 'accepted', 'declined', 'withdrawn')),
  response_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (client_request_id, talent_profile_id)
);

-- ---------------------------------------------------------------------------
-- updated_at triggers
-- ---------------------------------------------------------------------------
do $$ declare t text; begin
  foreach t in array array[
    'profiles','organizations','client_profiles','talent_applications','talent_profiles',
    'skill_claims','client_requests','consult_requests','proprietary_consult_requests',
    'task_requests','task_milestones','competitions','competition_submissions',
    'contracts','payments','payouts','reports','message_threads','request_invitations'
  ] loop
    execute format('drop trigger if exists %I_updated_at on public.%I', t, t);
    execute format(
      'create trigger %I_updated_at before update on public.%I for each row execute function public.set_updated_at()',
      t, t
    );
  end loop;
end $$;

-- ---------------------------------------------------------------------------
-- handle_new_user
-- ---------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  meta jsonb := coalesce(new.raw_user_meta_data, '{}'::jsonb);
  resolved_name text := coalesce(
    nullif(meta ->> 'full_name', ''),
    nullif(meta ->> 'name', ''),
    nullif(meta ->> 'display_name', '')
  );
  resolved_account_type text := coalesce(
    nullif(meta ->> 'account_type', ''),
    'client'
  );
begin
  insert into public.profiles (id, full_name, display_name, avatar_url, account_type)
  values (
    new.id,
    resolved_name,
    coalesce(nullif(meta ->> 'display_name', ''), nullif(meta ->> 'name', '')),
    coalesce(nullif(meta ->> 'avatar_url', ''), nullif(meta ->> 'picture', '')),
    resolved_account_type
  )
  on conflict (id) do nothing;

  if resolved_account_type = 'client' then
    insert into public.client_profiles (user_id, primary_contact_email)
    values (new.id, new.email)
    on conflict (user_id) do nothing;
  end if;

  if resolved_account_type = 'talent_applicant' then
    insert into public.talent_applications (user_id, status)
    values (new.id, 'submitted')
    on conflict (user_id) do nothing;
  end if;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.organizations enable row level security;
alter table public.client_profiles enable row level security;
alter table public.talent_applications enable row level security;
alter table public.talent_profiles enable row level security;
alter table public.skills enable row level security;
alter table public.skill_claims enable row level security;
alter table public.skill_evidence enable row level security;
alter table public.skill_verifications enable row level security;
alter table public.client_requests enable row level security;
alter table public.consult_requests enable row level security;
alter table public.proprietary_consult_requests enable row level security;
alter table public.task_requests enable row level security;
alter table public.task_milestones enable row level security;
alter table public.time_logs enable row level security;
alter table public.competitions enable row level security;
alter table public.competition_participants enable row level security;
alter table public.competition_submissions enable row level security;
alter table public.leaderboard_entries enable row level security;
alter table public.contracts enable row level security;
alter table public.payments enable row level security;
alter table public.payouts enable row level security;
alter table public.nda_agreements enable row level security;
alter table public.conflict_checks enable row level security;
alter table public.message_threads enable row level security;
alter table public.messages enable row level security;
alter table public.notifications enable row level security;
alter table public.reviews enable row level security;
alter table public.reports enable row level security;
alter table public.reputation_events enable row level security;
alter table public.admin_notes enable row level security;
alter table public.request_invitations enable row level security;

-- profiles
create policy "profiles_select_own" on public.profiles for select using (auth.uid() = id or public.is_admin());
create policy "profiles_select_public_talent" on public.profiles for select using (
  exists (select 1 from public.talent_profiles tp where tp.user_id = profiles.id and tp.visibility in ('public', 'limited'))
);
create policy "profiles_update_own" on public.profiles for update using (auth.uid() = id);
create policy "profiles_insert_own" on public.profiles for insert with check (auth.uid() = id);

-- client_profiles
create policy "client_profiles_own" on public.client_profiles for all using (auth.uid() = user_id or public.is_admin());

-- talent_applications
create policy "talent_applications_own" on public.talent_applications for all using (auth.uid() = user_id or public.is_admin());

-- talent_profiles
create policy "talent_profiles_public_read" on public.talent_profiles for select using (
  visibility in ('public', 'limited') or auth.uid() = user_id or public.is_admin()
);
create policy "talent_profiles_own_write" on public.talent_profiles for all using (auth.uid() = user_id or public.is_admin());

-- skills (public read)
create policy "skills_public_read" on public.skills for select using (true);
create policy "skills_admin_write" on public.skills for all using (public.is_admin());

-- skill_claims
create policy "skill_claims_read" on public.skill_claims for select using (
  public.is_admin() or exists (
    select 1 from public.talent_profiles tp
    join public.talent_applications ta on ta.user_id = tp.user_id
    where (tp.id = skill_claims.talent_profile_id and tp.user_id = auth.uid())
       or (ta.id = skill_claims.application_id and ta.user_id = auth.uid())
  ) or exists (
    select 1 from public.talent_profiles tp where tp.id = skill_claims.talent_profile_id and tp.visibility = 'public'
  )
);
create policy "skill_claims_write" on public.skill_claims for all using (
  public.is_admin() or exists (
    select 1 from public.talent_applications ta where ta.id = skill_claims.application_id and ta.user_id = auth.uid()
  ) or exists (
    select 1 from public.talent_profiles tp where tp.id = skill_claims.talent_profile_id and tp.user_id = auth.uid()
  )
);

-- skill_evidence
create policy "skill_evidence_via_claim" on public.skill_evidence for all using (
  public.is_admin() or exists (
    select 1 from public.skill_claims sc
    join public.talent_applications ta on ta.id = sc.application_id
    where sc.id = skill_evidence.skill_claim_id and ta.user_id = auth.uid()
  )
);

-- skill_verifications (admin)
create policy "skill_verifications_admin" on public.skill_verifications for all using (public.is_admin());
create policy "skill_verifications_read" on public.skill_verifications for select using (true);

-- client_requests
create policy "client_requests_owner" on public.client_requests for all using (
  public.is_admin() or exists (
    select 1 from public.client_profiles cp where cp.id = client_profile_id and cp.user_id = auth.uid()
  )
);
create policy "client_requests_talent_read" on public.client_requests for select using (
  status in ('published', 'active') and visibility = 'all_talents'
);

-- consult, proprietary, task (via client_request ownership or admin)
create policy "consult_requests_access" on public.consult_requests for all using (
  public.is_admin() or exists (
    select 1 from public.client_requests cr
    join public.client_profiles cp on cp.id = cr.client_profile_id
    where cr.id = consult_requests.client_request_id and cp.user_id = auth.uid()
  ) or selected_talent_id in (
    select tp.id from public.talent_profiles tp where tp.user_id = auth.uid()
  )
);

create policy "proprietary_consult_access" on public.proprietary_consult_requests for all using (
  public.is_admin() or exists (
    select 1 from public.client_requests cr
    join public.client_profiles cp on cp.id = cr.client_profile_id
    where cr.id = proprietary_consult_requests.client_request_id and cp.user_id = auth.uid()
  )
);

create policy "task_requests_access" on public.task_requests for all using (
  public.is_admin() or exists (
    select 1 from public.client_requests cr
    join public.client_profiles cp on cp.id = cr.client_profile_id
    where cr.id = task_requests.client_request_id and cp.user_id = auth.uid()
  ) or assigned_talent_id in (
    select tp.id from public.talent_profiles tp where tp.user_id = auth.uid()
  )
);

create policy "task_milestones_access" on public.task_milestones for all using (
  public.is_admin() or exists (
    select 1 from public.task_requests tr
    join public.client_requests cr on cr.id = tr.client_request_id
    join public.client_profiles cp on cp.id = cr.client_profile_id
    where tr.id = task_milestones.task_request_id and cp.user_id = auth.uid()
  )
);

create policy "time_logs_access" on public.time_logs for all using (
  public.is_admin() or talent_profile_id in (
    select tp.id from public.talent_profiles tp where tp.user_id = auth.uid()
  )
);

-- competitions
create policy "competitions_public_read" on public.competitions for select using (
  status in ('published', 'registration_open', 'active', 'evaluation', 'finalized', 'completed') or public.is_admin()
  or exists (select 1 from public.client_profiles cp where cp.id = competitions.client_profile_id and cp.user_id = auth.uid())
);
create policy "competitions_client_write" on public.competitions for all using (
  public.is_admin() or exists (
    select 1 from public.client_profiles cp where cp.id = competitions.client_profile_id and cp.user_id = auth.uid()
  )
);

create policy "competition_participants_access" on public.competition_participants for all using (
  public.is_admin() or talent_profile_id in (select id from public.talent_profiles where user_id = auth.uid())
  or exists (select 1 from public.competitions c join public.client_profiles cp on cp.id = c.client_profile_id where c.id = competition_id and cp.user_id = auth.uid())
);

create policy "competition_submissions_access" on public.competition_submissions for all using (
  public.is_admin() or exists (
    select 1 from public.competition_participants cp
    join public.talent_profiles tp on tp.id = cp.talent_profile_id
    where cp.id = competition_submissions.participant_id and tp.user_id = auth.uid()
  )
);

create policy "leaderboard_public_read" on public.leaderboard_entries for select using (true);

-- payments & payouts
create policy "payments_client" on public.payments for all using (
  public.is_admin() or exists (
    select 1 from public.client_profiles cp where cp.id = payments.client_profile_id and cp.user_id = auth.uid()
  )
);
create policy "payouts_talent" on public.payouts for all using (
  public.is_admin() or talent_profile_id in (select id from public.talent_profiles where user_id = auth.uid())
);

-- messaging
create policy "message_threads_participant" on public.message_threads for all using (
  public.is_admin() or auth.uid() = any(participant_ids)
);
create policy "messages_thread" on public.messages for all using (
  public.is_admin() or exists (
    select 1 from public.message_threads mt where mt.id = messages.thread_id and auth.uid() = any(mt.participant_ids)
  )
);

-- notifications
create policy "notifications_own" on public.notifications for all using (auth.uid() = user_id);

-- reviews & reports
create policy "reviews_participant" on public.reviews for all using (
  auth.uid() = reviewer_id or auth.uid() = reviewee_id or public.is_admin()
);
create policy "reports_access" on public.reports for all using (
  auth.uid() = reporter_id or public.is_admin()
);
create policy "reputation_read" on public.reputation_events for select using (
  auth.uid() = profile_id or public.is_admin()
);
create policy "admin_notes_admin" on public.admin_notes for all using (public.is_admin());

-- request invitations
create policy "request_invitations_access" on public.request_invitations for all using (
  public.is_admin() or talent_profile_id in (select id from public.talent_profiles where user_id = auth.uid())
  or exists (
    select 1 from public.client_requests cr join public.client_profiles cp on cp.id = cr.client_profile_id
    where cr.id = request_invitations.client_request_id and cp.user_id = auth.uid()
  )
);

-- nda & conflict
create policy "nda_own" on public.nda_agreements for all using (auth.uid() = user_id or public.is_admin());
create policy "conflict_checks_admin" on public.conflict_checks for all using (public.is_admin());

-- contracts
create policy "contracts_participant" on public.contracts for all using (
  public.is_admin() or exists (select 1 from public.client_profiles cp where cp.id = contracts.client_profile_id and cp.user_id = auth.uid())
  or talent_profile_id in (select id from public.talent_profiles where user_id = auth.uid())
);

-- organizations (admin)
create policy "organizations_admin" on public.organizations for all using (public.is_admin());

-- ---------------------------------------------------------------------------
-- Storage buckets
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public) values
  ('avatars', 'avatars', true),
  ('evidence', 'evidence', false),
  ('request-attachments', 'request-attachments', false),
  ('competition-submissions', 'competition-submissions', false)
on conflict (id) do nothing;

create policy "avatars_public" on storage.objects for select using (bucket_id = 'avatars');
create policy "avatars_own" on storage.objects for insert with check (
  bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1]
);
create policy "avatars_update_own" on storage.objects for update using (
  bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1]
);

create policy "evidence_own" on storage.objects for all using (
  bucket_id = 'evidence' and auth.uid()::text = (storage.foldername(name))[1]
);

-- ---------------------------------------------------------------------------
-- Seed skills taxonomy
-- ---------------------------------------------------------------------------
insert into public.skills (name, category, slug) values
  ('LLM Pretraining', 'Foundation Models', 'llm-pretraining'),
  ('LLM Fine-Tuning', 'Foundation Models', 'llm-fine-tuning'),
  ('RLHF / Alignment', 'Foundation Models', 'rlhf-alignment'),
  ('Distributed Training', 'Foundation Models', 'distributed-training'),
  ('Model Evaluation', 'Model Evaluation', 'model-evaluation'),
  ('Benchmark Design', 'Model Evaluation', 'benchmark-design'),
  ('Inference Optimization', 'Inference Systems', 'inference-optimization'),
  ('RAG Systems', 'Foundation Models', 'rag-systems'),
  ('Synthetic Data', 'Data Engineering', 'synthetic-data'),
  ('Data Pipeline Design', 'Data Engineering', 'data-pipeline-design'),
  ('PyTorch', 'Machine Learning Engineering', 'pytorch'),
  ('JAX / Flax', 'Machine Learning Engineering', 'jax-flax'),
  ('MLOps', 'MLOps', 'mlops'),
  ('Kubernetes for ML', 'MLOps', 'kubernetes-ml'),
  ('Computer Vision', 'Computer Vision', 'computer-vision'),
  ('Object Detection', 'Computer Vision', 'object-detection'),
  ('NLP / Text Classification', 'NLP', 'nlp-text-classification'),
  ('Reinforcement Learning', 'Reinforcement Learning', 'reinforcement-learning'),
  ('AI Safety', 'AI Safety and Security', 'ai-safety'),
  ('Red Teaming', 'AI Safety and Security', 'red-teaming'),
  ('AI Product Engineering', 'AI Product Engineering', 'ai-product-engineering'),
  ('Feature Engineering', 'Machine Learning Engineering', 'feature-engineering'),
  ('Hyperparameter Optimization', 'Machine Learning Engineering', 'hyperparameter-optimization'),
  ('Time Series Forecasting', 'Machine Learning Engineering', 'time-series'),
  ('Graph Neural Networks', 'Machine Learning Engineering', 'graph-neural-networks'),
  ('Multimodal Models', 'Foundation Models', 'multimodal-models'),
  ('Speech / Audio ML', 'NLP', 'speech-audio-ml'),
  ('Vector Databases', 'Inference Systems', 'vector-databases'),
  ('Model Quantization', 'Inference Systems', 'model-quantization'),
  ('LLM Agents', 'Foundation Models', 'llm-agents'),
  ('Prompt Engineering', 'Foundation Models', 'prompt-engineering'),
  ('Data Labeling Strategy', 'Data Engineering', 'data-labeling'),
  ('A/B Testing for ML', 'Model Evaluation', 'ab-testing-ml'),
  ('Causal Inference', 'AI Research', 'causal-inference'),
  ('Bayesian Methods', 'AI Research', 'bayesian-methods'),
  ('Federated Learning', 'Machine Learning Engineering', 'federated-learning'),
  ('Edge ML Deployment', 'Inference Systems', 'edge-ml'),
  ('GPU Cluster Management', 'MLOps', 'gpu-cluster-management'),
  ('Experiment Tracking', 'MLOps', 'experiment-tracking')
on conflict (slug) do nothing;

-- Enable realtime for messages and notifications
alter publication supabase_realtime add table public.messages;
alter publication supabase_realtime add table public.notifications;
