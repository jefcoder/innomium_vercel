-- Daily-budget live leaderboards extension
alter table public.competitions
  add column if not exists daily_budget_cents int;

create table if not exists public.competition_daily_scores (
  id uuid primary key default gen_random_uuid(),
  competition_id uuid not null references public.competitions (id) on delete cascade,
  participant_id uuid not null references public.competition_participants (id) on delete cascade,
  score_date date not null default current_date,
  score numeric(10,4) not null default 0,
  reward_cents int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (competition_id, participant_id, score_date)
);

alter table public.competition_daily_scores enable row level security;

create policy "competition_daily_scores_read" on public.competition_daily_scores
  for select using (true);

create policy "competition_daily_scores_admin_write" on public.competition_daily_scores
  for all using (public.is_admin());

create policy "competition_daily_scores_talent_write" on public.competition_daily_scores
  for insert with check (
    participant_id in (
      select cp.id from public.competition_participants cp
      join public.talent_profiles tp on tp.id = cp.talent_profile_id
      where tp.user_id = auth.uid()
    )
  );

create policy "competition_daily_scores_talent_update" on public.competition_daily_scores
  for update using (
    participant_id in (
      select cp.id from public.competition_participants cp
      join public.talent_profiles tp on tp.id = cp.talent_profile_id
      where tp.user_id = auth.uid()
    )
  );

drop trigger if exists competition_daily_scores_updated_at on public.competition_daily_scores;
create trigger competition_daily_scores_updated_at
  before update on public.competition_daily_scores
  for each row execute function public.set_updated_at();

-- Enable realtime for live leaderboards
alter publication supabase_realtime add table public.competition_daily_scores;
alter publication supabase_realtime add table public.leaderboard_entries;
