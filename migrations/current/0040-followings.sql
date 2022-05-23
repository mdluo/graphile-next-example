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
