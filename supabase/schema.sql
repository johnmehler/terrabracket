-- Run in the Supabase SQL editor (Dashboard → SQL Editor).

create table if not exists brackets (
	id bigint generated always as identity primary key,
	username text not null unique,
	data text not null,
	user_id uuid,
	created_at timestamptz not null default now()
);

alter table brackets enable row level security;

-- Lightweight public contest: anyone can read and submit brackets.
create policy "brackets are readable by everyone"
	on brackets for select
	using (true);

create policy "anyone can submit a bracket"
	on brackets for insert
	with check (true);

-- Needed so resubmitting under the same username overwrites the old bracket.
create policy "anyone can update a bracket"
	on brackets for update
	using (true);
