create table app_public.users (
  id uuid primary key default gen_random_uuid(),
  username citext unique check(length(username) >= 2 and length(username) <= 24 and username ~ '^[a-zA-Z]([_]?[a-zA-Z0-9])+$'),
  name text,
  image text check(image ~ '^https?://[^/]+'),
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table app_public.users enable row level security;

create index on app_public.users(username);

create function app_public.current_user_id() returns uuid as $$
  select id from app_public.users where id = (select nullif(pg_catalog.current_setting('jwt.claims.user_id', true), '')::uuid);
$$ language sql stable security definer set search_path to pg_catalog, public, pg_temp;
comment on function app_public.current_user_id() is
  E'Handy method to get the current user ID for use in RLS policies, etc; in GraphQL, use `currentUser{id}` instead.';

-- Users are publicly visible, like on GitHub, Twitter, Facebook, Trello, etc.
create policy select_all on app_public.users for select using (true);
-- You can only update yourself.
create policy update_self on app_public.users for update using (id = app_public.current_user_id());

-- NOTE: `insert` is not granted, because we'll handle that separately
grant select on app_public.users to :DB_VISITOR;
grant update(username, name, description) on app_public.users to :DB_VISITOR;
-- NOTE: `delete` is not granted, because we require confirmation via request_account_deletion/confirm_account_deletion

create trigger _100_timestamps
  before insert or update on app_public.users
  for each row
  execute procedure app_private.tg__timestamps();

comment on table app_public.users is
  E'A user who can log in to the application.';
comment on column app_public.users.username is
  E'Unique name.';

create function app_public.current_user() returns app_public.users as $$
  select users.* from app_public.users where id = app_public.current_user_id();
$$ language sql stable;
comment on function app_public.current_user() is
  E'The currently logged in user (or null if not logged in).';
