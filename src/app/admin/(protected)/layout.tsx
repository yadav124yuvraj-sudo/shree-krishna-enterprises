import Link from "next/link";
import {
  Briefcase,
  Inbox,
  LayoutDashboard,
  Image as ImageIcon,
  MapPin,
  MessageSquare,
  Settings,
  Star,
  Users,
} from "lucide-react";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { signOut } from "../actions";

const adminNav = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/enquiries", label: "Enquiries", icon: Inbox },
  { href: "/admin/applications", label: "Applications", icon: Users },
  { href: "/admin/reviews", label: "Reviews", icon: Star },
  { href: "/admin/services", label: "Services", icon: Briefcase },
  { href: "/admin/projects", label: "Projects", icon: ImageIcon },
  { href: "/admin/designs", label: "Designs", icon: ImageIcon },
  { href: "/admin/faqs", label: "FAQs", icon: MessageSquare },
  { href: "/admin/service-areas", label: "Service areas", icon: MapPin },
  { href: "/admin/settings", label: "Business settings", icon: Settings },
];

export default async function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  // Server-side check on every request. Hiding links in the UI is not security.
  const session = await requireAdmin();

  // Small "needs attention" numbers next to the menu items. If a count fails, no number is shown.
  const sb = await createClient();
  const head = { count: "exact" as const, head: true };
  const [newEnquiries, newApplications, pendingReviews] = await Promise.all([
    sb.from("enquiries").select("*", head).eq("status", "new"),
    sb.from("worker_applications").select("*", head).eq("status", "new"),
    sb.from("reviews").select("*", head).eq("status", "pending"),
  ]);
  const badges: Record<string, number | null> = {
    "/admin/enquiries": newEnquiries.count,
    "/admin/applications": newApplications.count,
    "/admin/reviews": pendingReviews.count,
  };

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <aside className="border-b border-line bg-charcoal text-warm-white md:w-64 md:border-b-0 md:border-r">
        <div className="flex items-center justify-between px-5 py-4 md:block">
          <p className="font-serif text-xl">Admin</p>
          <p className="hidden text-sm text-warm-white/60 md:mt-1 md:block">{session.email}</p>
        </div>
        <nav aria-label="Admin" className="flex gap-1 overflow-x-auto px-3 pb-3 md:flex-col md:pb-0">
          {adminNav.map(({ href, label, icon: Icon }) => {
            const count = badges[href];
            return (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-3 whitespace-nowrap rounded-sm px-3 py-2.5 text-sm text-warm-white/85 hover:bg-white/10"
              >
                <Icon className="size-4" aria-hidden="true" />
                {label}
                {count ? (
                  <span
                    className="ml-auto rounded-full bg-gold px-2 text-xs font-medium text-charcoal"
                    aria-label={`${count} waiting`}
                  >
                    {count}
                  </span>
                ) : null}
              </Link>
            );
          })}
        </nav>
        <form action={signOut} className="hidden px-3 py-4 md:block">
          <Button type="submit" variant="outline" size="sm" className="w-full border-warm-white/40 text-warm-white hover:bg-warm-white hover:text-charcoal">
            Sign out
          </Button>
        </form>
      </aside>
      <div className="flex-1 bg-warm-white">
        <div className="mx-auto max-w-5xl px-5 py-8 sm:px-8">{children}</div>
        <form action={signOut} className="px-5 pb-8 md:hidden">
          <Button type="submit" variant="outline" size="sm">Sign out</Button>
        </form>
      </div>
    </div>
  );
}
