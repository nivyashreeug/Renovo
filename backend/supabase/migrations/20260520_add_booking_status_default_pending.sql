alter table public.bookings
add column if not exists status text default 'Pending';

alter table public.bookings
alter column status set default 'Pending';

update public.bookings
set status = 'Pending'
where status is null;

comment on column public.bookings.status is 'Repair workflow state: Pending, Assigned, On The Way, Repairing, Completed, Rejected, Cancelled, or Rescheduled.';
