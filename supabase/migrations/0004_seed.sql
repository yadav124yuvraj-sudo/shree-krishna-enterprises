-- =====================================================================
-- Shree Krishna Enterprises | Chapter 2 | 0004 starter data
-- STARTER CONTENT ONLY. No fake projects, reviews, prices or contact details.
-- Services are created UNPUBLISHED. Turn on only what the business really offers.
-- =====================================================================

insert into public.roles (key, label) values
  ('super_admin', 'Super admin'),
  ('admin', 'Admin'),
  ('customer', 'Customer')
on conflict (key) do nothing;

insert into public.business_settings (id) values (true) on conflict (id) do nothing;
insert into public.private_settings (id) values (true) on conflict (id) do nothing;

insert into public.design_categories (slug, name, kind, sort_order) values
  ('pop', 'POP', 'service', 10),
  ('pvc', 'PVC', 'service', 20),
  ('living-room', 'Living room', 'room', 30),
  ('bedroom', 'Bedroom', 'room', 40),
  ('hall', 'Hall', 'room', 50),
  ('office', 'Office', 'room', 60),
  ('ceiling', 'Ceiling', 'type', 70),
  ('wall-panels', 'Wall panels', 'type', 80),
  ('modern', 'Modern', 'style', 90),
  ('simple', 'Simple', 'style', 100),
  ('premium', 'Premium', 'style', 110)
on conflict (slug) do nothing;

insert into public.services (slug, title, short_description, is_published, sort_order) values
  ('pop-false-ceiling', 'POP false ceiling', 'False ceilings in Plaster of Paris.', false, 10),
  ('pop-wall-designs', 'POP wall designs', 'Decorative wall designs in Plaster of Paris.', false, 20),
  ('decorative-mouldings', 'Decorative mouldings', 'Cornices and mouldings for ceilings and walls.', false, 30),
  ('pvc-ceiling', 'PVC ceiling', 'PVC ceiling installation.', false, 40),
  ('pvc-wall-panels', 'PVC wall panels', 'PVC panels for interior walls.', false, 50),
  ('pvc-interior-work', 'PVC interior work', 'Other PVC interior finishing work.', false, 60)
on conflict (slug) do nothing;

insert into public.job_roles (title, sort_order) values
  ('Helper', 10),
  ('POP Expert', 20),
  ('PVC Installer', 30),
  ('Skilled Worker', 40)
on conflict (title) do nothing;
