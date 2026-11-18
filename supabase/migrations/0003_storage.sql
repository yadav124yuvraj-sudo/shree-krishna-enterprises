-- =====================================================================
-- Shree Krishna Enterprises | Chapter 2 | 0003 storage buckets
--  public-media     : PUBLIC. Admin-uploaded project/design/service photos. 5 MB, images only.
--  customer-uploads : PRIVATE. Customer room photos, worker portfolio photos. 8 MB, images only.
--                     Only admins (and server code with the service role) can read it.
-- =====================================================================

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('public-media', 'public-media', true, 5242880,
    array['image/jpeg', 'image/png', 'image/webp', 'image/avif']),
  ('customer-uploads', 'customer-uploads', false, 8388608,
    array['image/jpeg', 'image/png', 'image/webp', 'image/heic'])
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

-- Public bucket files are served by URL without any policy, so there is deliberately
-- NO select policy: nobody can list the bucket. Only admins manage files.
create policy "admin manage public-media" on storage.objects
  for all to authenticated
  using (bucket_id = 'public-media' and (select public.is_admin()))
  with check (bucket_id = 'public-media' and (select public.is_admin()));

create policy "admin manage customer-uploads" on storage.objects
  for all to authenticated
  using (bucket_id = 'customer-uploads' and (select public.is_admin()))
  with check (bucket_id = 'customer-uploads' and (select public.is_admin()));

-- Customer uploads are written by server actions (service role) after validation,
-- so there is no anonymous or customer insert policy on purpose.
