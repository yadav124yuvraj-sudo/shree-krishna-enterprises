-- =====================================================================
-- Shree Krishna Enterprises | Chapter 2 | 0002 Row Level Security
-- Rules:
--  * Public: read published/approved content only. No direct writes.
--  * Public form submissions go through Next.js server actions (validated,
--    rate-limited) that use the service-role key on the server only.
--  * Logged-in customers: only their own rows.
--  * Admins (verified in the database via is_admin()): everything.
-- =====================================================================

-- Turn on RLS for every table in public.
do $$
declare r record;
begin
  for r in select tablename from pg_tables where schemaname = 'public' loop
    execute format('alter table public.%I enable row level security', r.tablename);
  end loop;
end $$;

-- ---------- Admin: full access (not for rate_limits, which is server-only) ----------
do $$
declare t text;
begin
  foreach t in array array[
    'roles','business_settings','private_settings','service_areas','services','design_categories',
    'designs','design_category_links','design_images','projects','project_images','inspiration_sources',
    'enquiries','enquiry_images','enquiry_status_history','quotations','reviews','review_images',
    'job_roles','worker_applications','worker_application_images','favourites','faqs',
    'notifications','admin_activity_logs'
  ] loop
    execute format(
      'create policy "admin full access" on public.%I for all to authenticated
         using ((select public.is_admin())) with check ((select public.is_admin()))', t);
  end loop;
end $$;

-- Logs are append-only, even for admins.
drop policy "admin full access" on public.admin_activity_logs;
create policy "admin read logs" on public.admin_activity_logs
  for select to authenticated using ((select public.is_admin()));
create policy "admin write logs" on public.admin_activity_logs
  for insert to authenticated with check ((select public.is_admin()));

-- rate_limits: no policies at all, and no grants. Only the service role touches it.
revoke all on public.rate_limits from anon, authenticated;

-- ---------- Profiles ----------
create policy "read own profile" on public.profiles
  for select to authenticated using (id = (select auth.uid()));
create policy "admin read profiles" on public.profiles
  for select to authenticated using ((select public.is_admin()));
create policy "update own profile" on public.profiles
  for update to authenticated
  using (id = (select auth.uid())) with check (id = (select auth.uid()));
create policy "super admin update profiles" on public.profiles
  for update to authenticated
  using ((select public.is_super_admin())) with check ((select public.is_super_admin()));

-- ---------- Public read: published content only ----------
create policy "public read settings" on public.business_settings
  for select to anon, authenticated using (true);
create policy "public read active areas" on public.service_areas
  for select to anon, authenticated using (is_active);
create policy "public read published services" on public.services
  for select to anon, authenticated using (is_published);
create policy "public read categories" on public.design_categories
  for select to anon, authenticated using (true);
create policy "public read published designs" on public.designs
  for select to anon, authenticated using (is_published);
create policy "public read design category links" on public.design_category_links
  for select to anon, authenticated
  using (exists (select 1 from public.designs d where d.id = design_id and d.is_published));
create policy "public read design images" on public.design_images
  for select to anon, authenticated
  using (exists (select 1 from public.designs d where d.id = design_id and d.is_published));
create policy "public read published projects" on public.projects
  for select to anon, authenticated using (is_published);
create policy "public read project images" on public.project_images
  for select to anon, authenticated
  using (exists (select 1 from public.projects p where p.id = project_id and p.is_published));
create policy "public read published inspiration" on public.inspiration_sources
  for select to anon, authenticated using (is_published and usage_permission_confirmed);
create policy "public read approved reviews" on public.reviews
  for select to anon, authenticated using (status = 'approved');
create policy "public read approved review images" on public.review_images
  for select to anon, authenticated
  using (exists (select 1 from public.reviews r where r.id = review_id and r.status = 'approved'));
create policy "public read active job roles" on public.job_roles
  for select to anon, authenticated using (is_active);
create policy "public read published faqs" on public.faqs
  for select to anon, authenticated using (is_published);

-- ---------- Logged-in customers: own rows only ----------
create policy "customer read own enquiries" on public.enquiries
  for select to authenticated using (user_id = (select auth.uid()));
create policy "customer create own enquiries" on public.enquiries
  for insert to authenticated
  with check (user_id = (select auth.uid()) and status = 'new' and privacy_consent);

create policy "customer read own enquiry images" on public.enquiry_images
  for select to authenticated
  using (exists (select 1 from public.enquiries e where e.id = enquiry_id and e.user_id = (select auth.uid())));

create policy "customer read own enquiry history" on public.enquiry_status_history
  for select to authenticated
  using (exists (select 1 from public.enquiries e where e.id = enquiry_id and e.user_id = (select auth.uid())));

-- Customers only see quotations once the admin has sent them.
create policy "customer read own sent quotations" on public.quotations
  for select to authenticated
  using (
    status <> 'draft'
    and exists (select 1 from public.enquiries e where e.id = enquiry_id and e.user_id = (select auth.uid()))
  );

create policy "customer read own reviews" on public.reviews
  for select to authenticated using (user_id = (select auth.uid()));
create policy "customer create own reviews" on public.reviews
  for insert to authenticated
  with check (
    user_id = (select auth.uid()) and status = 'pending' and not is_verified and privacy_consent
  );

create policy "customer manage own favourites" on public.favourites
  for all to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));

-- Sequences used in column defaults must be usable by customers inserting enquiries.
grant usage on sequence public.enquiry_seq to authenticated;
