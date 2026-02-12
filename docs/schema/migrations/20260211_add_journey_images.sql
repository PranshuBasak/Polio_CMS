-- Add optional memory images for professional journey entries.
alter table public.journey
add column if not exists images text[] not null default '{}'::text[];

