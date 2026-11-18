import type { Metadata, Viewport } from "next";
import "@fontsource-variable/fraunces";
import "@fontsource-variable/figtree";
import "./globals.css";

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Shree Krishna Enterprises | POP & PVC Interior Designs",
    template: "%s | Shree Krishna Enterprises",
  },
  description:
    "Transforming Spaces with Beautiful POP & PVC Designs. POP false ceilings, LED cove lighting, PVC ceilings and PVC wall panels.",
  openGraph: {
    type: "website",
    siteName: "Shree Krishna Enterprises",
    title: "Shree Krishna Enterprises | POP & PVC Interior Designs",
    description: "Transforming Spaces with Beautiful POP & PVC Designs.",
    url: siteUrl,
  },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  themeColor: "#faf7f2",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html data-scroll-behavior="smooth" lang="en">
      <body className="flex min-h-screen flex-col">{children}</body>
    </html>
  );
}
