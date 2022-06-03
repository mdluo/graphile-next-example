--! Previous: -
--! Hash: sha1:7b0357a87da28706e1240f5e842277170fb84250

--! split: 0001-reset.sql
/**
 * Graphile Migrate will run our `current/...` migrations in one batch. Since
 * this is our first migration it's defining the entire database, so we first
 * drop anything that may have previously been created
 * (app_public/app_hidden/app_private) so that we can start from scratch.
 */
drop schema if exists app_public cascade;
drop schema if exists app_hidden cascade;
drop schema if exists app_private cascade;

--! split: 0010-public-permissions.sql
/**
 * The `public` *schema* contains things like PostgreSQL extensions. We
 * deliberately do not install application logic into the public schema
 * (instead storing it to app_public/app_hidden/app_private as appropriate),
 * but none the less we don't want untrusted roles to be able to install or
 * modify things into the public schema.
 *
 * The `public` *role* is automatically inherited by all other roles; we only
 * want specific roles to be able to access our database so we must revoke
 * access to the `public` role.
 */

revoke all on schema public from public;

alter default privileges revoke all on sequences from public;
alter default privileges revoke all on functions from public;

-- Of course we want our database owner to be able to do anything inside the
-- database, so we grant access to the `public` schema:
grant all on schema public to :DB_OWNER;

--! split: 0020-schemas.sql
/**
 * Read about our app_public/app_hidden/app_private schemas here:
 * https://www.graphile.org/postgraphile/namespaces/#advice
 *
 * Note this pattern is not required to use PostGraphile, it's merely the
 * preference of the author of this package.
 */

create schema app_public;
create schema app_hidden;
create schema app_private;

-- The 'visitor' role (used by PostGraphile to represent an end user) may
-- access the public, app_public and app_hidden schemas (but _NOT_ the
-- app_private schema).
grant usage on schema public, app_public, app_hidden to :DB_VISITOR;

-- We want the `visitor` role to be able to insert rows (`serial` data type
-- creates sequences, so we need to grant access to that).
alter default privileges in schema public, app_public, app_hidden
  grant usage, select on sequences to :DB_VISITOR;

-- And the `visitor` role should be able to call functions too.
alter default privileges in schema public, app_public, app_hidden
  grant execute on functions to :DB_VISITOR;

--! split: 0021-common-triggers.sql
/*
 * This trigger is used on tables with created_at and updated_at to ensure that
 * these timestamps are kept valid (namely: `created_at` cannot be changed, and
 * `updated_at` must be monotonically increasing).
 */
create function app_private.tg__timestamps() returns trigger as $$
begin
  NEW.created_at = (case when TG_OP = 'INSERT' then NOW() else OLD.created_at end);
  NEW.updated_at = (case when TG_OP = 'UPDATE' and OLD.updated_at >= NOW() then OLD.updated_at + interval '1 millisecond' else NOW() end);
  return NEW;
end;
$$ language plpgsql volatile set search_path to pg_catalog, public, pg_temp;
comment on function app_private.tg__timestamps() is
  E'This trigger should be called on all tables with created_at, updated_at - it ensures that they cannot be manipulated and that updated_at will always be larger than the previous updated_at.';

--! split: 0030-users.sql
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

--! split: 0031-accounts.sql
create table app_public.accounts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references app_public.users,
  provider text not null,
  provider_account_id text not null,
  account_details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table app_public.accounts enable row level security;

create index on app_public.accounts(user_id);

create trigger _100_timestamps
  before insert or update on app_public.accounts
  for each row
  execute procedure app_private.tg__timestamps();

-- Users may view and delete their social logins.
create policy select_own on app_public.accounts for select using (user_id = app_public.current_user_id());
create policy delete_own on app_public.accounts for delete using (user_id = app_public.current_user_id());
-- TODO: on delete, check this isn't the last one, or that they have a verified
-- email address or password. For now we're not worrying about that since all
-- the OAuth providers we use verify the email address.

grant select on app_public.accounts to :DB_VISITOR;
grant delete on app_public.accounts to :DB_VISITOR;

create function app_private.link_or_register_user(
  f_user_id uuid,
  f_provider character varying,
  f_provider_account_id character varying,
  f_user_details json,
  f_account_details json
) returns app_public.users as $$
declare
  v_matched_user_id uuid;
  v_matched_account_id uuid;
  v_name text;
  v_image text;
  v_user app_public.users;
begin
  select id, user_id
    into v_matched_account_id, v_matched_user_id
    from app_public.accounts
    where provider = f_provider
    and provider_account_id = f_provider_account_id
    limit 1;

  if v_matched_user_id is not null and f_user_id is not null and v_matched_user_id <> f_user_id then
    raise exception 'A different user already has this account linked.' using errcode = 'TAKEN';
  end if;

  v_name := f_user_details ->> 'name';
  v_image := f_user_details ->> 'image';

  if v_matched_account_id is null then
    if f_user_id is not null then
      -- Link new account to logged in user account
      insert into app_public.accounts
        (user_id, provider, provider_account_id, account_details)
      values
        (f_user_id, f_provider, f_provider_account_id, f_account_details)
      returning
        id, user_id into v_matched_account_id, v_matched_user_id;
    end if;
  end if;

  if v_matched_user_id is null and f_user_id is null and v_matched_account_id is null then
    -- Create a new user.
    insert into app_public.users
      (name, image)
    values
      (v_name, v_image)
    returning * into v_user;

    insert into app_public.accounts
      (user_id, provider, provider_account_id, account_details)
    values
      (v_user.id, f_provider, f_provider_account_id, f_account_details)
    returning
      id, user_id into v_matched_account_id, v_matched_user_id;

    return v_user;
  else
    if v_matched_account_id is not null then
      update app_public.accounts
        set account_details = f_account_details
        where id = v_matched_account_id;
      update app_public.users
        set
          name = coalesce(users.name, v_name),
          image = coalesce(users.image, v_image)
        where id = v_matched_user_id
        returning  * into v_user;
      return v_user;
    else
      -- v_matched_account_id is null
      -- -> v_matched_user_id is null (they're paired)
      -- -> f_user_id is not null (because the if clause above)
      -- -> v_matched_account_id is not null (because of the separate if block above creating a accounts)
      -- -> contradiction.
      raise exception 'This should not occur';
    end if;
  end if;
end
$$ language plpgsql volatile security definer set search_path to pg_catalog, public, pg_temp;

--! split: 0040-followings.sql
create table app_public.followings (
  follower_id uuid not null default app_public.current_user_id() references app_public.users on delete cascade,
  followee_id uuid not null references app_public.users on delete cascade,
  primary key (follower_id, followee_id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table app_public.followings enable row level security;

create index on app_public.followings(follower_id);
create index on app_public.followings(followee_id);

create trigger _100_timestamps
  before insert or update on app_public.followings
  for each row
  execute procedure app_private.tg__timestamps();

create policy select_all on app_public.followings for select using (true);
create policy insert_own on app_public.followings for insert with check (follower_id = app_public.current_user_id() and followee_id <> app_public.current_user_id());
create policy delete_own on app_public.followings for delete using (follower_id = app_public.current_user_id());

grant select on app_public.followings to :DB_VISITOR;
grant insert (followee_id) on app_public.followings to :DB_VISITOR;
grant delete on app_public.followings to :DB_VISITOR;

comment on constraint followings_follower_id_fkey on app_public.followings is
  E'@omit many\n@manyToManyFieldName followers';

comment on constraint followings_followee_id_fkey on app_public.followings is
  E'@omit many\n@manyToManyFieldName followees';

--! split: 0050-posts.sql
create table app_public.posts (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null default app_public.current_user_id() references app_public.users on delete cascade,
  text text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table app_public.posts enable row level security;

create index on app_public.posts(author_id);
create index on app_public.posts(created_at);

create trigger _100_timestamps
  before insert or update on app_public.posts
  for each row
  execute procedure app_private.tg__timestamps();

create policy select_all on app_public.posts for select using (true);
create policy insert_own on app_public.posts for insert with check (author_id = app_public.current_user_id());
create policy delete_own on app_public.posts for delete using (author_id = app_public.current_user_id());

grant select on app_public.posts to :DB_VISITOR;
grant insert (text) on app_public.posts to :DB_VISITOR;
grant delete on app_public.posts to :DB_VISITOR;

create function app_public.on_new_post() returns trigger as $$
begin
 perform pg_notify('postgraphile:newPost', json_build_object(
    '__node__', json_build_array(
      'posts',
      NEW.id
    )
  )::text);
  return new;
end;
$$ language plpgsql volatile;

create trigger _500_gql_update
  after insert on app_public.posts
  for each row
  execute procedure app_public.on_new_post();
