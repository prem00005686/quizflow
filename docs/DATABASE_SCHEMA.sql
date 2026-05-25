-- MCQ Learning Platform - Supabase schema
-- Fresh install schema for the backend endpoints in this repo.

create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ------------------------------------------------------------
-- Users
-- ------------------------------------------------------------
create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  password_hash text,
  display_name text not null,
  avatar_url text,
  subscription_status text not null default 'free'
    check (subscription_status in ('free', 'premium', 'expired', 'cancelled')),
  total_xp integer not null default 0,
  level integer not null default 1,
  streak_count integer not null default 0,
  last_activity_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_users_updated_at on public.users;
create trigger trg_users_updated_at
before update on public.users
for each row execute function public.set_updated_at();

-- ------------------------------------------------------------
-- Sessions
-- ------------------------------------------------------------
create table if not exists public.sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  device_fingerprint text not null,
  ip_address inet,
  user_agent text,
  expires_at timestamptz not null,
  last_activity_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  unique (user_id, device_fingerprint)
);

create index if not exists idx_sessions_user_id on public.sessions(user_id);
create index if not exists idx_sessions_device_fingerprint on public.sessions(device_fingerprint);
create index if not exists idx_sessions_expires_at on public.sessions(expires_at);

-- ------------------------------------------------------------
-- Topics
-- ------------------------------------------------------------
create table if not exists public.topics (
  id text primary key,
  name text not null,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_topics_updated_at on public.topics;
create trigger trg_topics_updated_at
before update on public.topics
for each row execute function public.set_updated_at();

-- ------------------------------------------------------------
-- MCQs
-- ------------------------------------------------------------
create table if not exists public.mcqs (
  id uuid primary key default gen_random_uuid(),
  topic_id text not null references public.topics(id) on delete cascade,
  question_text text not null,
  code_snippet text,
  difficulty text not null default 'medium'
    check (difficulty in ('easy', 'medium', 'hard')),
  options jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_mcqs_topic_id on public.mcqs(topic_id);
create index if not exists idx_mcqs_difficulty on public.mcqs(difficulty);

drop trigger if exists trg_mcqs_updated_at on public.mcqs;
create trigger trg_mcqs_updated_at
before update on public.mcqs
for each row execute function public.set_updated_at();

insert into public.topics (id, name, description)
select 'topic_1', 'Logic & Data Structures', 'Starter practice set used by the current frontend flow'
where not exists (
  select 1 from public.topics where id = 'topic_1'
);

insert into public.mcqs (topic_id, question_text, code_snippet, difficulty, options)
select * from (
  values
    (
      'topic_1',
      'Given a directed acyclic graph (DAG) representing task dependencies, which algorithm is most appropriate for determining a valid execution order?',
      'function scheduleTasks(tasks, dependencies)\n  // inDegree and graph setup\n  // ...',
      'medium',
      '[
        {"id":"A","text":"Dijkstra\'s Shortest Path Algorithm","is_correct":false},
        {"id":"B","text":"Kruskal\'s Minimum Spanning Tree","is_correct":false},
        {"id":"C","text":"Topological Sorting using Kahn\'s Algorithm","is_correct":true},
        {"id":"D","text":"Breadth-First Search (BFS) from any arbitrary node","is_correct":false}
      ]'::jsonb
    ),
    (
      'topic_1',
      'Which data structure is most optimal for implementing a Least Recently Used (LRU) cache?',
      null,
      'easy',
      '[
        {"id":"A","text":"Array","is_correct":false},
        {"id":"B","text":"Hash Map combined with a Doubly Linked List","is_correct":true},
        {"id":"C","text":"Binary Search Tree","is_correct":false},
        {"id":"D","text":"Min-Heap","is_correct":false}
      ]'::jsonb
    ),
    (
      'topic_1',
      'What is the time complexity of searching for an element in a balanced Binary Search Tree (BST)?',
      null,
      'easy',
      '[
        {"id":"A","text":"O(1)","is_correct":false},
        {"id":"B","text":"O(log n)","is_correct":true},
        {"id":"C","text":"O(n)","is_correct":false},
        {"id":"D","text":"O(n log n)","is_correct":false}
      ]'::jsonb
    )
) as seed(topic_id, question_text, code_snippet, difficulty, options)
where not exists (
  select 1
  from public.mcqs existing
  where existing.topic_id = seed.topic_id
    and existing.question_text = seed.question_text
);

-- ------------------------------------------------------------
-- Test submissions
-- ------------------------------------------------------------
create table if not exists public.test_submissions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  topic_id text references public.topics(id) on delete set null,
  score integer not null default 0,
  total_questions integer not null default 0,
  time_taken_seconds integer,
  answers jsonb not null default '{}'::jsonb,
  submitted_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index if not exists idx_test_submissions_user_id on public.test_submissions(user_id);
create index if not exists idx_test_submissions_topic_id on public.test_submissions(topic_id);
create index if not exists idx_test_submissions_submitted_at on public.test_submissions(submitted_at);

-- ------------------------------------------------------------
-- Daily activity
-- ------------------------------------------------------------
create table if not exists public.user_activity (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  date date not null,
  questions_attempted integer not null default 0,
  questions_correct integer not null default 0,
  xp_earned integer not null default 0,
  created_at timestamptz not null default now(),
  unique (user_id, date)
);

create index if not exists idx_user_activity_user_id on public.user_activity(user_id);
create index if not exists idx_user_activity_date on public.user_activity(date);

-- ------------------------------------------------------------
-- Subscriptions
-- ------------------------------------------------------------
create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  plan_id text not null check (plan_id in ('free', 'premium')),
  status text not null default 'active'
    check (status in ('active', 'trialing', 'past_due', 'canceled', 'inactive')),
  current_period_start timestamptz not null default now(),
  current_period_end timestamptz,
  cancel_at_period_end boolean not null default false,
  stripe_customer_id text,
  stripe_subscription_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_subscriptions_updated_at on public.subscriptions;
create trigger trg_subscriptions_updated_at
before update on public.subscriptions
for each row execute function public.set_updated_at();

create index if not exists idx_subscriptions_user_id on public.subscriptions(user_id);
create index if not exists idx_subscriptions_status on public.subscriptions(status);

-- ------------------------------------------------------------
-- Stripe session tracking
-- ------------------------------------------------------------
create table if not exists public.stripe_sessions (
  id uuid primary key default gen_random_uuid(),
  session_id text not null unique,
  user_id uuid not null references public.users(id) on delete cascade,
  plan_id text not null check (plan_id in ('free', 'premium')),
  billing_cycle text check (billing_cycle in ('monthly', 'yearly')),
  status text not null default 'pending'
    check (status in ('pending', 'paid', 'failed', 'expired', 'completed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_stripe_sessions_updated_at on public.stripe_sessions;
create trigger trg_stripe_sessions_updated_at
before update on public.stripe_sessions
for each row execute function public.set_updated_at();

create index if not exists idx_stripe_sessions_user_id on public.stripe_sessions(user_id);
create index if not exists idx_stripe_sessions_status on public.stripe_sessions(status);

-- ------------------------------------------------------------
-- RLS
-- ------------------------------------------------------------
alter table public.users enable row level security;
alter table public.sessions enable row level security;
alter table public.topics enable row level security;
alter table public.mcqs enable row level security;
alter table public.test_submissions enable row level security;
alter table public.user_activity enable row level security;
alter table public.subscriptions enable row level security;
alter table public.stripe_sessions enable row level security;

-- Users
drop policy if exists users_select_own on public.users;
create policy users_select_own on public.users
for select using (auth.uid() = id);

drop policy if exists users_update_own on public.users;
create policy users_update_own on public.users
for update using (auth.uid() = id) with check (auth.uid() = id);

-- Sessions
drop policy if exists sessions_select_own on public.sessions;
create policy sessions_select_own on public.sessions
for select using (auth.uid() = user_id);

-- Topics and MCQs are readable for signed-in users
drop policy if exists topics_select_auth on public.topics;
create policy topics_select_auth on public.topics
for select using (auth.role() = 'authenticated');

drop policy if exists mcqs_select_auth on public.mcqs;
create policy mcqs_select_auth on public.mcqs
for select using (auth.role() = 'authenticated');

-- Test submissions, activity, subscriptions, stripe sessions are user-owned
drop policy if exists test_submissions_select_own on public.test_submissions;
create policy test_submissions_select_own on public.test_submissions
for select using (auth.uid() = user_id);

drop policy if exists test_submissions_insert_own on public.test_submissions;
create policy test_submissions_insert_own on public.test_submissions
for insert with check (auth.uid() = user_id);

drop policy if exists user_activity_select_own on public.user_activity;
create policy user_activity_select_own on public.user_activity
for select using (auth.uid() = user_id);

drop policy if exists user_activity_insert_own on public.user_activity;
create policy user_activity_insert_own on public.user_activity
for insert with check (auth.uid() = user_id);

drop policy if exists user_activity_update_own on public.user_activity;
create policy user_activity_update_own on public.user_activity
for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists subscriptions_select_own on public.subscriptions;
create policy subscriptions_select_own on public.subscriptions
for select using (auth.uid() = user_id);

drop policy if exists subscriptions_insert_own on public.subscriptions;
create policy subscriptions_insert_own on public.subscriptions
for insert with check (auth.uid() = user_id);

drop policy if exists subscriptions_update_own on public.subscriptions;
create policy subscriptions_update_own on public.subscriptions
for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists stripe_sessions_select_own on public.stripe_sessions;
create policy stripe_sessions_select_own on public.stripe_sessions
for select using (auth.uid() = user_id);

drop policy if exists stripe_sessions_insert_own on public.stripe_sessions;
create policy stripe_sessions_insert_own on public.stripe_sessions
for insert with check (auth.uid() = user_id);

drop policy if exists stripe_sessions_update_own on public.stripe_sessions;
create policy stripe_sessions_update_own on public.stripe_sessions
for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
