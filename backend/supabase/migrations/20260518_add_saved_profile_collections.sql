-- Add persistent saved profile collections for the customer account center.
-- Run this in your Supabase SQL editor or via your migration pipeline.

alter table public.profiles
  add column if not exists saved_addresses jsonb not null default '[]'::jsonb,
  add column if not exists saved_payments jsonb not null default '[]'::jsonb;

comment on column public.profiles.saved_addresses is 'Saved customer service addresses for quick booking checkout.';
comment on column public.profiles.saved_payments is 'Saved customer payment methods for quick checkout.';
