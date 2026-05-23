-- Add payment lifecycle metadata for the Renova billing flow.

alter table public.bookings
  add column if not exists payment_status text not null default 'Pending';

comment on column public.bookings.payment_status is 'Customer payment state for repair bookings: Pending, Processing, Paid, or Refunded.';
