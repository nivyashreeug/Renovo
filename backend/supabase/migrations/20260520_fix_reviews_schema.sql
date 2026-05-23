-- Ensure the reviews schema matches the dashboard composer and avoids schema-cache drift.
-- Apply this migration after earlier reviews table changes.

alter table public.reviews
  add column if not exists comment text;

alter table public.reviews
  add column if not exists review text;

update public.reviews
set comment = coalesce(comment, review, '')
where comment is null;

update public.reviews
set review = coalesce(review, comment, '')
where review is null;

alter table public.reviews
  alter column comment set not null;

alter table public.reviews
  alter column review set not null;

comment on column public.reviews.comment is 'Primary customer review text.';
comment on column public.reviews.review is 'Legacy duplicate of the review comment for compatibility with existing UI code.';
