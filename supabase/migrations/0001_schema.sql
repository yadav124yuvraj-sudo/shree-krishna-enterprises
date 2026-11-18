-- =====================================================================
-- Shree Krishna Enterprises | Chapter 2 | 0001 schema
-- Tables, constraints, indexes, triggers. RLS is in 0002.
-- =====================================================================

create or replace function public.set_updated_at() returns trigger
language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

-- ---------- Roles and profiles ----------
create table public.roles (
  key text primary key,
  label text not null,
  created_at timestamptz not null default now()
);

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  role text not null default 'customer' references public.roles(key),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.is_active and p.role in ('admin', 'super_admin')
  );
$$;

create or replace function public.is_super_admin() returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.is_active and p.role = 'super_admin'
  );
$$;

-- New sign-ups always become 'customer'. Admins are promoted manually (see README).
create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, nullif(new.raw_user_meta_data ->> 'full_name', ''));
  return new;
end $$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Nobody can change roles or deactivate accounts from the app unless super admin.
-- (The SQL editor has no logged-in user, so it is still allowed: that is how the first admin is created.)
create or replace function public.protect_profile_privileges() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  if auth.uid() is not null and not public.is_super_admin() then
    if new.role is distinct from old.role or new.is_active is distinct from old.is_active then
      raise exception 'Only a super admin can change roles or account status';
    end if;
  end if;
  return new;
end $$;

create trigger protect_profile_privileges
  before update on public.profiles
  for each row execute function public.protect_profile_privileges();

-- ---------- Business settings (single row, public-safe fields only) ----------
create table public.business_settings (
  id boolean primary key default true check (id),
  business_name text not null default 'Shree Krishna Enterprises',
  tagline text not null default 'Transforming Spaces with Beautiful POP & PVC Designs',
  phone text check (phone is null or phone ~ '^[+0-9][0-9 -]{5,19}$'),
  whatsapp_number text check (whatsapp_number is null or whatsapp_number ~ '^[0-9]{10,15}$'),
  email text check (email is null or email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  address text,
  map_embed_url text check (map_embed_url is null or map_embed_url like 'https://www.google.com/maps/embed%'),
  working_hours text,
  seo_title text,
  seo_description text,
  og_image_path text,
  -- Optional features, switched on/off from admin.
  features jsonb not null default '{
    "before_after": true, "faq": true, "favourites": true,
    "video_gallery": false, "referral": false, "seasonal_offers": false,
    "estimator": false, "customer_accounts": false
  }'::jsonb,
  -- Estimator stays off until real rates are entered. null = not set.
  estimator_rates jsonb not null default '{"pop_per_sqft": null, "pvc_per_sqft": null}'::jsonb,
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

-- Private settings: never readable by the public.
create table public.private_settings (
  id boolean primary key default true check (id),
  notification_email text check (notification_email is null or notification_email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  email_notifications_enabled boolean not null default false,
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

-- ---------- Catalogue ----------
create table public.service_areas (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  is_active boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.services (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title text not null,
  short_description text,
  description text,
  cover_image_path text,
  is_published boolean not null default false,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.design_categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  name text not null,
  kind text not null default 'other' check (kind in ('service', 'room', 'type', 'style', 'other')),
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.designs (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title text not null,
  description text,
  service_id uuid references public.services(id) on delete set null,
  cover_image_path text,
  is_published boolean not null default false,
  is_featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index designs_service_idx on public.designs(service_id);
create index designs_published_idx on public.designs(is_published, created_at desc);

create table public.design_category_links (
  design_id uuid not null references public.designs(id) on delete cascade,
  category_id uuid not null references public.design_categories(id) on delete cascade,
  primary key (design_id, category_id)
);
create index design_category_links_category_idx on public.design_category_links(category_id);

create table public.design_images (
  id uuid primary key default gen_random_uuid(),
  design_id uuid not null references public.designs(id) on delete cascade,
  storage_path text not null,
  alt_text text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);
create index design_images_design_idx on public.design_images(design_id, sort_order);

create table public.projects (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title text not null,
  location text,
  service_id uuid references public.services(id) on delete set null,
  description text,
  completed_on date,
  video_url text check (video_url is null or video_url ~* '^https://'),
  is_published boolean not null default false,
  is_featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index projects_service_idx on public.projects(service_id);
create index projects_published_idx on public.projects(is_published, completed_on desc);

create table public.project_images (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  storage_path text not null,
  kind text not null default 'gallery' check (kind in ('gallery', 'before', 'after')),
  alt_text text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);
create index project_images_project_idx on public.project_images(project_id, sort_order);

-- Reference images. Cannot be published until usage permission is confirmed.
create table public.inspiration_sources (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  image_path text,
  embed_url text check (embed_url is null or embed_url ~* '^https://([a-z0-9-]+\.)?pinterest\.[a-z.]+/'),
  license_type text not null check (license_type in ('own_image', 'licensed', 'permitted_embed', 'permission_granted')),
  source_name text,
  source_url text check (source_url is null or source_url ~* '^https?://'),
  attribution text,
  permission_notes text,
  usage_permission_confirmed boolean not null default false,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint inspiration_publish_rules check (
    not is_published
    or (usage_permission_confirmed and (image_path is not null or embed_url is not null))
  )
);
create index inspiration_published_idx on public.inspiration_sources(is_published);

-- ---------- Enquiries, quotations ----------
create sequence public.enquiry_seq;
create sequence public.quotation_seq;

create table public.enquiries (
  id uuid primary key default gen_random_uuid(),
  ref_code text not null unique default ('SKE-' || lpad(nextval('public.enquiry_seq')::text, 5, '0')),
  kind text not null default 'general' check (kind in ('quotation', 'custom_design', 'design', 'project', 'general')),
  status text not null default 'new' check (status in ('new', 'contacted', 'site_visit', 'quotation_sent', 'confirmed', 'in_progress', 'completed', 'closed')),
  user_id uuid references auth.users(id) on delete set null,
  name text not null check (char_length(name) between 2 and 100),
  phone text not null check (phone ~ '^[+0-9][0-9 -]{5,19}$'),
  email text check (email is null or email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  address text check (address is null or char_length(address) <= 500),
  service_type text,
  room_type text,
  length_ft numeric(7,2) check (length_ft is null or (length_ft > 0 and length_ft < 1000)),
  width_ft numeric(7,2) check (width_ft is null or (width_ft > 0 and width_ft < 1000)),
  budget_range text,
  style text,
  description text check (description is null or char_length(description) <= 4000),
  preferred_visit_date date,
  preferred_location text,
  design_id uuid references public.designs(id) on delete set null,
  project_id uuid references public.projects(id) on delete set null,
  privacy_consent boolean not null check (privacy_consent),
  admin_notes text,
  follow_up_on date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index enquiries_status_idx on public.enquiries(status, created_at desc);
create index enquiries_kind_idx on public.enquiries(kind);
create index enquiries_user_idx on public.enquiries(user_id);
create index enquiries_follow_up_idx on public.enquiries(follow_up_on) where follow_up_on is not null;

create table public.enquiry_images (
  id uuid primary key default gen_random_uuid(),
  enquiry_id uuid not null references public.enquiries(id) on delete cascade,
  storage_path text not null,   -- lives in the PRIVATE bucket customer-uploads
  created_at timestamptz not null default now()
);
create index enquiry_images_enquiry_idx on public.enquiry_images(enquiry_id);

create table public.enquiry_status_history (
  id uuid primary key default gen_random_uuid(),
  enquiry_id uuid not null references public.enquiries(id) on delete cascade,
  from_status text,
  to_status text not null,
  note text,
  changed_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);
create index enquiry_history_enquiry_idx on public.enquiry_status_history(enquiry_id, created_at);

create table public.quotations (
  id uuid primary key default gen_random_uuid(),
  quote_number text not null unique default ('Q-' || lpad(nextval('public.quotation_seq')::text, 5, '0')),
  enquiry_id uuid not null references public.enquiries(id) on delete cascade,
  status text not null default 'draft' check (status in ('draft', 'sent', 'accepted', 'rejected')),
  scope text,
  amount numeric(12,2) check (amount is null or amount >= 0),
  valid_until date,
  notes text,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index quotations_enquiry_idx on public.quotations(enquiry_id);

-- ---------- Reviews ----------
create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects(id) on delete set null,
  user_id uuid references auth.users(id) on delete set null,
  reviewer_name text not null check (char_length(reviewer_name) between 2 and 100),
  reviewer_location text,
  rating smallint not null check (rating between 1 and 5),
  body text not null check (char_length(body) between 10 and 2000),
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  is_verified boolean not null default false,
  privacy_consent boolean not null check (privacy_consent),
  moderated_by uuid references auth.users(id) on delete set null,
  moderated_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index reviews_status_idx on public.reviews(status, created_at desc);
create index reviews_project_idx on public.reviews(project_id);

create table public.review_images (
  id uuid primary key default gen_random_uuid(),
  review_id uuid not null references public.reviews(id) on delete cascade,
  storage_path text not null,
  created_at timestamptz not null default now()
);
create index review_images_review_idx on public.review_images(review_id);

-- ---------- Recruitment ----------
create table public.job_roles (
  id uuid primary key default gen_random_uuid(),
  title text not null unique,
  is_active boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.worker_applications (
  id uuid primary key default gen_random_uuid(),
  job_role_id uuid references public.job_roles(id) on delete set null,
  role_title text not null,
  name text not null check (char_length(name) between 2 and 100),
  phone text not null check (phone ~ '^[+0-9][0-9 -]{5,19}$'),
  location text,
  experience_years numeric(4,1) check (experience_years is null or (experience_years >= 0 and experience_years <= 60)),
  skills text check (skills is null or char_length(skills) <= 1000),
  expected_salary text,
  availability text,
  introduction text check (introduction is null or char_length(introduction) <= 2000),
  status text not null default 'new' check (status in ('new', 'reviewing', 'contacted', 'selected', 'rejected')),
  admin_notes text,
  privacy_consent boolean not null check (privacy_consent),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index worker_applications_status_idx on public.worker_applications(status, created_at desc);

create table public.worker_application_images (
  id uuid primary key default gen_random_uuid(),
  application_id uuid not null references public.worker_applications(id) on delete cascade,
  storage_path text not null,
  created_at timestamptz not null default now()
);
create index worker_app_images_idx on public.worker_application_images(application_id);

-- ---------- Misc ----------
create table public.favourites (
  user_id uuid not null references auth.users(id) on delete cascade,
  design_id uuid not null references public.designs(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, design_id)
);

create table public.faqs (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  answer text not null,
  is_published boolean not null default false,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('enquiry', 'quotation', 'review', 'application')),
  title text not null,
  body text,
  link text,
  entity_id uuid,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);
create index notifications_unread_idx on public.notifications(is_read, created_at desc);

create table public.admin_activity_logs (
  id uuid primary key default gen_random_uuid(),
  admin_id uuid references auth.users(id) on delete set null,
  action text not null,
  entity_type text,
  entity_id uuid,
  details jsonb,
  created_at timestamptz not null default now()
);
create index admin_logs_created_idx on public.admin_activity_logs(created_at desc);

-- Used by server code to rate-limit public form submissions.
create table public.rate_limits (
  key text primary key,
  window_start timestamptz not null default now(),
  hits int not null default 1
);

-- ---------- updated_at triggers ----------
do $$
declare t text;
begin
  foreach t in array array[
    'profiles','business_settings','private_settings','service_areas','services',
    'design_categories','designs','projects','inspiration_sources','enquiries',
    'quotations','reviews','job_roles','worker_applications','faqs'
  ] loop
    execute format(
      'create trigger set_updated_at before update on public.%I for each row execute function public.set_updated_at()', t);
  end loop;
end $$;

-- ---------- Enquiry status history ----------
create or replace function public.log_enquiry_status_change() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  if new.status is distinct from old.status then
    insert into public.enquiry_status_history (enquiry_id, from_status, to_status, changed_by)
    values (new.id, old.status, new.status, auth.uid());
  end if;
  return new;
end $$;

create trigger log_enquiry_status_change
  after update of status on public.enquiries
  for each row execute function public.log_enquiry_status_change();

-- ---------- Admin notifications ----------
create or replace function public.notify_new_enquiry() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  insert into public.notifications (type, title, body, link, entity_id)
  values (
    case when new.kind = 'quotation' then 'quotation' else 'enquiry' end,
    case when new.kind = 'quotation' then 'New quotation request' else 'New enquiry' end,
    new.name || ' (' || new.ref_code || ')',
    '/admin/enquiries/' || new.id,
    new.id
  );
  return new;
end $$;
create trigger notify_new_enquiry after insert on public.enquiries
  for each row execute function public.notify_new_enquiry();

create or replace function public.notify_new_review() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  insert into public.notifications (type, title, body, link, entity_id)
  values ('review', 'New review to moderate', new.reviewer_name || ': ' || new.rating || ' stars', '/admin/reviews', new.id);
  return new;
end $$;
create trigger notify_new_review after insert on public.reviews
  for each row execute function public.notify_new_review();

create or replace function public.notify_new_application() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  insert into public.notifications (type, title, body, link, entity_id)
  values ('application', 'New worker application', new.name || ' for ' || new.role_title, '/admin/applications', new.id);
  return new;
end $$;
create trigger notify_new_application after insert on public.worker_applications
  for each row execute function public.notify_new_application();

-- ---------- Rate limit helper (server only) ----------
create or replace function public.check_rate_limit(p_key text, p_max int, p_window_seconds int)
returns boolean language plpgsql security definer set search_path = '' as $$
declare v_hits int;
begin
  insert into public.rate_limits as r (key, window_start, hits)
  values (p_key, now(), 1)
  on conflict (key) do update set
    hits = case when r.window_start < now() - make_interval(secs => p_window_seconds) then 1 else r.hits + 1 end,
    window_start = case when r.window_start < now() - make_interval(secs => p_window_seconds) then now() else r.window_start end
  returning r.hits into v_hits;
  return v_hits <= p_max;
end $$;

revoke execute on function public.check_rate_limit(text, int, int) from public, anon, authenticated;
grant execute on function public.check_rate_limit(text, int, int) to service_role;

revoke execute on function public.handle_new_user() from public, anon, authenticated;
revoke execute on function public.log_enquiry_status_change() from public, anon, authenticated;
revoke execute on function public.notify_new_enquiry() from public, anon, authenticated;
revoke execute on function public.notify_new_review() from public, anon, authenticated;
revoke execute on function public.notify_new_application() from public, anon, authenticated;
