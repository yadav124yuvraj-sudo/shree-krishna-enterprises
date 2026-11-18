import type { Metadata } from "next";

// Admin pages are always rendered per request (they depend on who is logged in).
export const dynamic = "force-dynamic";

// Admin pages must never appear in Google.
export const metadata: Metadata = {
  title: { default: "Admin", template: "%s | Admin" },
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
