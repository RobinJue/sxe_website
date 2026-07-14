-- Newsletter subscribers. Run once against the Railway Postgres database.
create extension if not exists pgcrypto;

create table if not exists subscribers (
	id uuid primary key default gen_random_uuid(),
	email text not null unique,
	consent_at timestamptz not null default now(),
	confirmed boolean not null default false,
	confirmed_at timestamptz,
	unsubscribe_token uuid not null default gen_random_uuid(),
	source text
);
