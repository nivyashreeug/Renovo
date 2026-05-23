-- Allow dashboard users to view posted reviews while keeping insert ownership checks.

drop policy if exists "Customers can read their own reviews" on public.reviews;

create policy "Authenticated users can read dashboard reviews"
  on public.reviews
  for select
  to authenticated
  using (true);