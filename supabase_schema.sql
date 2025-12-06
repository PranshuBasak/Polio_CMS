-- Create languages table
create table public.languages (
  id uuid not null default gen_random_uuid (),
  name text not null,
  proficiency text not null,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone null,
  constraint languages_pkey primary key (id)
);

-- Create interests table
create table public.interests (
  id uuid not null default gen_random_uuid (),
  name text not null,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone null,
  constraint interests_pkey primary key (id)
);

-- Enable RLS (Row Level Security)
alter table public.languages enable row level security;
alter table public.interests enable row level security;

-- Create policies (assuming public read, authenticated write for portfolio owner)
-- Adjust 'authenticated' to your specific auth needs if different
create policy "Allow public read access" on public.languages for select using (true);
create policy "Allow authenticated insert" on public.languages for insert with check (auth.role() = 'authenticated');
create policy "Allow authenticated update" on public.languages for update using (auth.role() = 'authenticated');
create policy "Allow authenticated delete" on public.languages for delete using (auth.role() = 'authenticated');

create policy "Allow public read access" on public.interests for select using (true);
create policy "Allow authenticated insert" on public.interests for insert with check (auth.role() = 'authenticated');
create policy "Allow authenticated update" on public.interests for update using (auth.role() = 'authenticated');
create policy "Allow authenticated delete" on public.interests for delete using (auth.role() = 'authenticated');
