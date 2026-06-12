create extension if not exists "pgcrypto";

create table if not exists public.workspaces (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  plan text not null default 'pro',
  created_at timestamptz not null default now()
);

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  email text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.workspace_members (
  workspace_id uuid references public.workspaces(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete cascade,
  role text not null check (role in ('admin','manager','agent')),
  primary key (workspace_id, user_id)
);

create table if not exists public.roles (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid references public.workspaces(id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.role_permissions (
  role_id uuid references public.roles(id) on delete cascade,
  permission text not null,
  enabled boolean not null default true,
  primary key (role_id, permission)
);

create table if not exists public.channels (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid references public.workspaces(id) on delete cascade,
  kind text not null,
  label text not null,
  connected boolean not null default false,
  unread_count integer not null default 0
);

create table if not exists public.pipeline_stages (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid references public.workspaces(id) on delete cascade,
  key text not null,
  label text not null,
  position integer not null
);

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid references public.workspaces(id) on delete cascade,
  name text not null,
  company text not null,
  stage text not null,
  score integer not null default 50,
  value integer not null default 0,
  status text not null default 'warm',
  updated_at timestamptz not null default now()
);

create table if not exists public.conversations (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid references public.workspaces(id) on delete cascade,
  lead_id uuid references public.leads(id) on delete set null,
  channel_id uuid references public.channels(id) on delete set null,
  title text not null,
  unread boolean not null default false,
  updated_at timestamptz not null default now()
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid references public.conversations(id) on delete cascade,
  sender text not null,
  body text not null,
  direction text not null check (direction in ('inbound','outbound','internal')),
  sent_at timestamptz not null default now()
);

create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid references public.workspaces(id) on delete cascade,
  title text not null,
  status text not null default 'open',
  due_at timestamptz
);

create table if not exists public.ai_suggestions (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid references public.workspaces(id) on delete cascade,
  title text not null,
  body text not null,
  accepted boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.analytics_events (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid references public.workspaces(id) on delete cascade,
  event_name text not null,
  payload jsonb not null default '{}',
  created_at timestamptz not null default now()
);

create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid references public.workspaces(id) on delete cascade,
  title text not null,
  format text not null check (format in ('csv','pdf')),
  created_at timestamptz not null default now()
);

alter table public.workspaces enable row level security;
alter table public.profiles enable row level security;
alter table public.workspace_members enable row level security;
alter table public.roles enable row level security;
alter table public.role_permissions enable row level security;
alter table public.channels enable row level security;
alter table public.pipeline_stages enable row level security;
alter table public.leads enable row level security;
alter table public.conversations enable row level security;
alter table public.messages enable row level security;
alter table public.tasks enable row level security;
alter table public.ai_suggestions enable row level security;
alter table public.analytics_events enable row level security;
alter table public.reports enable row level security;

create or replace function public.is_workspace_member(target_workspace uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.workspace_members wm
    where wm.workspace_id = target_workspace and wm.user_id = auth.uid()
  );
$$;

create policy "users can read own profile" on public.profiles for select using (id = auth.uid());
create policy "members can read workspace" on public.workspaces for select using (public.is_workspace_member(id));
create policy "members can read memberships" on public.workspace_members for select using (public.is_workspace_member(workspace_id));
create policy "members can read roles" on public.roles for select using (public.is_workspace_member(workspace_id));
create policy "members can read channels" on public.channels for select using (public.is_workspace_member(workspace_id));
create policy "members can manage channels" on public.channels for update using (public.is_workspace_member(workspace_id)) with check (public.is_workspace_member(workspace_id));
create policy "members can read pipeline stages" on public.pipeline_stages for select using (public.is_workspace_member(workspace_id));
create policy "members can manage leads" on public.leads for all using (public.is_workspace_member(workspace_id)) with check (public.is_workspace_member(workspace_id));
create policy "members can manage conversations" on public.conversations for all using (public.is_workspace_member(workspace_id)) with check (public.is_workspace_member(workspace_id));
create policy "members can manage tasks" on public.tasks for all using (public.is_workspace_member(workspace_id)) with check (public.is_workspace_member(workspace_id));
create policy "members can read ai suggestions" on public.ai_suggestions for select using (public.is_workspace_member(workspace_id));
create policy "members can insert analytics" on public.analytics_events for insert with check (public.is_workspace_member(workspace_id));
create policy "members can read reports" on public.reports for select using (public.is_workspace_member(workspace_id));

create policy "members can read messages" on public.messages
for select using (
  exists (
    select 1 from public.conversations c
    where c.id = conversation_id and public.is_workspace_member(c.workspace_id)
  )
);

create policy "members can insert messages" on public.messages
for insert with check (
  exists (
    select 1 from public.conversations c
    where c.id = conversation_id and public.is_workspace_member(c.workspace_id)
  )
);
