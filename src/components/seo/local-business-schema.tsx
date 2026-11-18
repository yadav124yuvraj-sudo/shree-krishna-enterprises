import { getBusinessSettings } from "@/lib/business-settings";

export async function LocalBusinessSchema() {
  const settings = await getBusinessSettings();
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://shreekrishnaenterprises.in";

  const schema = {
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    name: settings.name || "Shree Krishna Enterprises",
    description:
      settings.tagline ||
      "Expert POP false ceiling, gypsum ceiling, decorative molding, and waterproof PVC wall panel contractors in Bayad and across Gujarat.",
    url: baseUrl,
    telephone: "+91-9428523958",
    email: settings.email || "yadav124yuvraj@gmail.com",
    priceRange: "₹₹",
    address: {
      "@type": "PostalAddress",
      streetAddress: "B-80 Shivalik Greens",
      addressLocality: "Bayad",
      addressRegion: "Gujarat",
      postalCode: "383325",
      addressCountry: "IN",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 23.2215,
      longitude: 73.2131,
    },
    areaServed: [
      { "@type": "City", name: "Bayad" },
      { "@type": "City", name: "Modasa" },
      { "@type": "City", name: "Himatnagar" },
      { "@type": "City", name: "Kapadvanj" },
      { "@type": "City", name: "Dehgam" },
      { "@type": "City", name: "Dhansura" },
      { "@type": "City", name: "Malpur" },
      { "@type": "City", name: "Gandhinagar" },
      { "@type": "City", name: "Ahmedabad" },
    ],
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ],
        opens: "09:00",
        closes: "18:00",
      },
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "POP & PVC Interior Services",
      itemListElement: [
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "POP False Ceiling Installation" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "PVC Wall & Ceiling Panels" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Gypsum & LED Cove Lighting Ceiling" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Decorative POP Cornice & Wall Molding" } },
      ],
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
