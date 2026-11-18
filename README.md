# Shree Krishna Enterprises: Website

Next.js (App Router) + TypeScript + Tailwind + Supabase. Built in chapters.

## Chapters
1. Foundation: layout, design system, header/footer, floating WhatsApp, homepage (done)
2. Database + Auth: Supabase schema, RLS, storage, admin login, settings (done)
3. Public pages: home, about, services, projects, designs, inspiration, reviews, contact, FAQ, privacy, terms, sitemap (this update)
4. Forms + workflows (quote, custom design, join team, reviews, uploads)
5. Admin modules, extras, SEO, final README

## Run locally
```bash
npm install
copy .env.example .env.local     # Mac/Linux: cp .env.example .env.local
npm run dev
```
Windows PowerShell, if port 3000 is busy: `npm run dev -- -p 3005`

## Chapter 2 setup: Supabase (about 10 minutes)

1. **Create project.** supabase.com, New project. Region: Mumbai (ap-south-1). Save the database password.
2. **Create the database.** Supabase, SQL Editor, New query. Paste the full contents of `supabase/setup.sql`, click Run. It must finish with "Success".
   (The same SQL is split into `supabase/migrations/0001..0004` if you later use the Supabase CLI. Do not run both.)
3. **Connect the site.** Supabase, Project Settings, API. Copy the Project URL and the anon/publishable key into `.env.local`:
   `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`. Restart `npm run dev`.
4. **Create your admin login.** Supabase, Authentication, Users, Add user, Create new user. Enter your email and a strong password, tick "Auto Confirm User".
5. **Make that user an admin.** SQL Editor, run (change the email):
   ```sql
   update public.profiles set role = 'super_admin'
   where id = (select id from auth.users where email = 'your@email.com');
   ```
6. Open http://localhost:3000/admin/login and sign in. Go to Business settings and enter the real phone, WhatsApp, email, address and hours.

## How security works
- **Database (RLS):** the public can read only published/approved content. They cannot read enquiries, applications, logs or private settings. Customers can see only their own rows. Admin rights are checked inside the database (`is_admin()`).
- **Server:** every admin page and action calls `requireAdmin()` on the server. Hiding a menu link is never the protection.
- **Roles:** new sign-ups are always `customer`. Nobody can promote themselves; only a super admin (or the SQL editor) can change roles.
- **Public forms (Chapter 4):** go through server actions with validation and rate limiting, using the service-role key on the server only.
- **Uploads:** `public-media` (public, admin-only upload) and `customer-uploads` (private). Images only, size limited.
- **Reference images:** an inspiration item cannot be published until usage permission is confirmed (database constraint).

## What the owner must supply before launch
Real phone, WhatsApp number, email, address, working hours, map link (Admin, Business settings). Services are created unpublished; publish only what the business really offers (Chapter 5 admin). Add real project photos. No sample projects, reviews or prices are included.

## Notes
- Never commit `.env.local`. Never put `SUPABASE_SERVICE_ROLE_KEY` in frontend code. Never share it in screenshots.
- Add shadcn/ui components any time: `npx shadcn@latest add dialog`.

## Chapter 3: public pages
- Pages show **only real data from the database**. With an empty database every page shows a friendly empty state. No sample projects, reviews or prices exist.
- **About page text** is in `src/content/about.ts`. Replace every `[Add ...]` placeholder with real facts before launch.
- **Privacy and Terms** are drafts. Read and edit them (`src/app/(site)/privacy/page.tsx`, `terms/page.tsx`) before launch.
- **Photos:** upload to the public Supabase bucket `public-media` and save the path (for example `projects/living-room/1.jpg`) in the table column (`cover_image_path`, `project_images.storage_path`, and so on). The admin screens that do this come in Chapter 5. Until then you can test with Supabase, Table Editor and Storage.
- **Before/after:** add two `project_images` rows for a project, one with `kind = 'before'` and one with `kind = 'after'`.
- **Optional features** are switched with `business_settings.features` (before_after, faq, favourites, video_gallery). Admin switches come in Chapter 5.
- Pages refresh from the database every minute. Saving Business settings refreshes them immediately.
- /quote, /custom-design and /join-our-team show "coming soon" with WhatsApp and call buttons. The forms are Chapter 4.

## Chapter 5 Part A: admin content management
Admin can now add, edit and delete **Services**, **Projects** (with gallery, before/after and video) and **Designs** (with categories and extra photos), each with photo upload to the `public-media` bucket.

- Admin, Services: add/edit title, descriptions, cover photo, publish toggle, sort order.
- Admin, Projects: add/edit details, link a service, mark Featured, then add Gallery / Before / After photos on the same screen. Add a video link (YouTube/Vimeo) to show it on the project page.
- Admin, Designs: add/edit details, tick categories (POP/PVC, room, style...), cover photo, then add extra photos.
- Deleting a project or design also deletes its uploaded photos from storage.
- Photos: JPG/PNG/WEBP/AVIF, up to 5 MB. Uploads use the server-only service-role key, so `SUPABASE_SERVICE_ROLE_KEY` must be set in `.env.local` from this chapter onward.

### New setup step: add the service-role key
1. Supabase, Project Settings, API Keys. Copy the **secret** key (starts `sb_secret_...`) — not the publishable one.
2. Open `.env.local` and set:
   ```
   SUPABASE_SERVICE_ROLE_KEY=sb_secret_xxxxxxxx
   ```
3. Never commit this file, never paste this key in chat or screenshots. It bypasses all security rules.
4. Restart `npm run dev`.

## Chapter 5 Part B: reviews, enquiries, applications, FAQs, service areas
New admin menu items (the gold number shows how many are waiting):

- **Enquiries:** list with filters (status, type). Open one to see all details and the customer's photos, call or WhatsApp the customer, change the status (new, contacted, site visit, quotation sent, confirmed, in progress, completed, closed), set a follow-up date, and write private notes. Enquiries with a follow-up date that has arrived show "Follow up due". Status changes are kept in a history.
- **Applications:** people who applied from Join Our Team. Change status (new, reviewing, contacted, selected, rejected), add private notes, see their work photos.
- **Reviews:** new reviews wait for you. Read, then Approve or Reject. Only approved reviews show on the website. "Mark as verified customer" only if the person really was your customer.
- **FAQs:** add, edit, delete, publish, and set the order.
- **Service areas:** add, rename, reorder, hide or remove the areas shown on the website.

Notes:
- Customer photos are in the private bucket `customer-uploads`. Admin sees them through temporary links (valid 1 hour), so reload the page if a photo link has expired.
- Deleting an enquiry, application or review also deletes its photos. Use this if a customer asks you to remove their data.
- No new packages and no new SQL are needed for Part B.

## Chapter 4 Part A: Quote and Custom Design forms
- **/quote** (Free Quotation) and **/custom-design** (Custom Design Request) are now real forms. The "Request This Design" button on a design page opens the custom design form with that design already attached.
- Every request is saved in the database and shows up in **Admin, Enquiries** (and in the dashboard notifications). Photos go to the private bucket `customer-uploads`; only admins can open them.
- Photos are made smaller in the customer's browser before sending (up to 4 photos, JPG/PNG/WEBP). `next.config.ts` now allows form uploads up to 6 MB.
- **Protection against spam and misuse:** server-side checks on every field, real file type check on photos, a hidden spam-trap field, and limits (6 requests per hour per visitor, 3 per day per phone number). The customer must tick the privacy consent box.
- Email notifications are not added yet. For now check Admin, Enquiries. They can be added later.
- No new packages and no new SQL.

## WhatsApp notify on enquiries
On an enquiry's page (Admin, Enquiries, open one), under "Let the customer know" there is now a WhatsApp
message box. Pick what you want to tell the customer (new, contacted, site visit, quotation sent, confirmed,
in progress, completed, closed) — a suggested message fills in automatically, in English. You can edit the
words before sending. Clicking "Open WhatsApp with this message" opens WhatsApp **on the customer's own number**
with the message ready to send; nothing is sent by itself, and nothing is sent until you press send inside WhatsApp.

Still to come: Chapter 4 Part B (Join Our Team form and Write a Review form). Later: analytics, estimator, final README.
