-- Run in the Supabase SQL editor (Dashboard → SQL Editor).

create table if not exists brackets (
	id bigint generated always as identity primary key,
	username text not null unique,
	pin text not null, -- sha256 hash of the submitter's 4-6 digit pin
	data text not null,
	created_at timestamptz not null default now()
);

-- If the table already exists from before, run this instead of recreating:
-- alter table brackets add column pin text not null default '';
-- alter table brackets drop column if exists user_id;

alter table brackets enable row level security;

-- Lightweight public contest: anyone can read and submit brackets.
create policy "brackets are readable by everyone"
	on brackets for select
	using (true);

create policy "anyone can submit a bracket"
	on brackets for insert
	with check (true);

-- Needed so resubmitting under the same username overwrites the old bracket.
-- The PIN is verified in the app before issuing the update.
create policy "anyone can update a bracket"
	on brackets for update
	using (true);
