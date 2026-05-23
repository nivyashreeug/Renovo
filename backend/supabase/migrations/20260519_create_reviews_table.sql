-- Add customer reviews storage for the dashboard review composer.
-- Run this in your Supabase SQL editor or via your migration pipeline.

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references auth.users(id) on delete cascade,
  customer_name text not null,
  service_name text not null,
  rating integer not null check (rating between 1 and 5),
  comment text not null,
  review text not null,
  booking_id text,
  technician_name text,
  created_at timestamptz not null default now()
);

alter table public.reviews enable row level security;

create policy "Customers can insert their own reviews"
  on public.reviews
  for insert
  to authenticated
  with check (auth.uid() = customer_id);

create policy "Customers can read their own reviews"
  on public.reviews
  for select
  to authenticated
  using (auth.uid() = customer_id);

comment on table public.reviews is 'Customer-submitted service reviews for the Renova dashboard.';
comment on column public.reviews.comment is 'Primary customer review text.';
comment on column public.reviews.review is 'Legacy duplicate of the review comment for compatibility with existing UI code.';