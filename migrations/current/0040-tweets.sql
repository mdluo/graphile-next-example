create table app_public.tweets (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null default app_public.current_user_id() references app_public.users on delete cascade,
  text text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table app_public.tweets enable row level security;

create index on app_public.tweets(author_id);
create index on app_public.tweets(created_at);

create trigger _100_timestamps
  before insert or update on app_public.tweets
  for each row
  execute procedure app_private.tg__timestamps();

create policy select_all on app_public.tweets for select using (true);
create policy insert_own on app_public.tweets for insert with check (author_id = app_public.current_user_id());
create policy delete_own on app_public.tweets for delete using (author_id = app_public.current_user_id());

grant select on app_public.tweets to :DB_VISITOR;
grant insert (text) on app_public.tweets to :DB_VISITOR;
grant delete on app_public.tweets to :DB_VISITOR;
