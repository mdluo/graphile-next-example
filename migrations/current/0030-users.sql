create table app_public.users (
  id uuid primary key default gen_random_uuid(),
  username text unique not null,
  name text,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table
  app_public.users enable row level security;

grant
select
  (id, username, name, description),
insert
  (username, name, description),
update
  (username, name, description) on app_public.users to :DB_VISITOR;

create index on app_public.users(username);

create trigger _100_timestamps before
insert
  or
update
  on app_public.users for each row execute procedure app_private.tg__timestamps();

comment on table app_public.users is
  E'A user who can log in to the application.';

comment on column app_public.users.username is
  E'Unique name.';
