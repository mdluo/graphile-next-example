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
