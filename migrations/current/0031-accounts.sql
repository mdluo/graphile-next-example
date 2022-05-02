create table app_public.accounts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references app_public.users(id),
  type text not null,
  provider text not null,
  provider_account_id text not null,
  refresh_token varchar,
  access_token varchar,
  expires_at timestamptz,
  token_type varchar,
  scope text
);

alter table app_public.accounts enable row level security;

create index on app_public.accounts(user_id);

create trigger _100_timestamps
  before insert or update on app_public.accounts
  for each row
  execute procedure app_private.tg__timestamps();
