import { createPublicClient } from "@/lib/supabase/public";
import { aboutContent } from "@/content/about";

export type FeatureFlags = {
  before_after: boolean;
  faq: boolean;
  favourites: boolean;
  video_gallery: boolean;
  referral: boolean;
  seasonal_offers: boolean;
  estimator: boolean;
  customer_accounts: boolean;
};

export type BusinessSettings = {
  name: string;
  tagline: string;
  phoneDisplay: string;
  phoneTel: string;
  whatsappNumber: string;
  email: string;
  address: string;
  workingHours: string;
  mapEmbedUrl: string;
  aboutIntro: string;
  aboutStory: string;
  aboutWorkmanship: string;
  aboutTeam: string;
  aboutDetails: string;
  siteUrl: string;
  features: FeatureFlags;
  usingPlaceholders: boolean;
};

const PLACEHOLDER_PHONE = "[Add phone number]";
const PLACEHOLDER_EMAIL = "[Add email address]";
const PLACEHOLDER_ADDRESS = "[Add business address]";
const PLACEHOLDER_HOURS = "[Add working hours]";

const DEFAULT_FEATURES: FeatureFlags = {
  before_after: true,
  faq: true,
  favourites: true,
  video_gallery: false,
  referral: false,
  seasonal_offers: false,
  estimator: false,
  customer_accounts: false,
};

const digits = (v: string | null | undefined) => (v ?? "").replace(/\D/g, "");
const pick = (...values: Array<string | null | undefined>) =>
  values.map((v) => v?.trim()).find((v) => v) ?? "";

type DbRow = {
  business_name: string | null;
  tagline: string | null;
  phone: string | null;
  whatsapp_number: string | null;
  email: string | null;
  address: string | null;
  working_hours: string | null;
  map_embed_url: string | null;
  about_intro: string | null;
  about_story: string | null;
  about_workmanship: string | null;
  about_team: string | null;
  about_details: string | null;
  features: Partial<FeatureFlags> | null;
};

async function readFromDatabase(): Promise<DbRow | null> {
  try {
    const supabase = createPublicClient();
    if (!supabase) return null;
    const { data, error } = await supabase
      .from("business_settings")
      .select(
        "business_name, tagline, phone, whatsapp_number, email, address, working_hours, map_embed_url, about_intro, about_story, about_workmanship, about_team, about_details, features",
      )
      .eq("id", true)
      .maybeSingle();
    if (error) return null;
    return data as DbRow | null;
  } catch {
    return null;
  }
}

export async function getBusinessSettings(): Promise<BusinessSettings> {
  const db = await readFromDatabase();

  const phone = pick(db?.phone, process.env.NEXT_PUBLIC_BUSINESS_PHONE);
  const rawWhatsapp = digits(pick(db?.whatsapp_number, process.env.NEXT_PUBLIC_WHATSAPP_NUMBER));
  const whatsapp = rawWhatsapp.length === 10 ? `91${rawWhatsapp}` : rawWhatsapp;
  const email = pick(db?.email, process.env.NEXT_PUBLIC_BUSINESS_EMAIL);
  const address = pick(db?.address, process.env.NEXT_PUBLIC_BUSINESS_ADDRESS);
  const hours = pick(db?.working_hours, process.env.NEXT_PUBLIC_WORKING_HOURS);

  return {
    name: pick(db?.business_name) || "Shree Krishna Enterprises",
    tagline: pick(db?.tagline) || "Transforming Spaces with Beautiful POP & PVC Designs",
    phoneDisplay: phone || PLACEHOLDER_PHONE,
    phoneTel: digits(phone),
    whatsappNumber: whatsapp,
    email: email || PLACEHOLDER_EMAIL,
    address: address || PLACEHOLDER_ADDRESS,
    workingHours: hours || PLACEHOLDER_HOURS,
    mapEmbedUrl: pick(db?.map_embed_url),
    aboutIntro: pick(db?.about_intro) || aboutContent.intro,
    aboutStory:
      pick(db?.about_story) ||
      "We started Shree Krishna Enterprises with a simple goal: to bring clean, durable, and modern POP false ceiling and PVC wall paneling work to homes, offices, and shops.",
    aboutWorkmanship: pick(db?.about_workmanship) || aboutContent.workmanship,
    aboutTeam:
      pick(db?.about_team) ||
      "Our work is personally supervised on site alongside experienced POP artisans, PVC installers, and trained helpers.",
    aboutDetails:
      pick(db?.about_details) ||
      "We serve Bayad and surrounding areas, offering on-site measurements, transparent quotations, and timely completion.",
    siteUrl: (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3005").replace(/\/$/, ""),
    features: { ...DEFAULT_FEATURES, ...(db?.features ?? {}) },
    usingPlaceholders: !phone || !whatsapp || !email,
  };
}

export const hasEmail = (s: BusinessSettings) => s.email !== PLACEHOLDER_EMAIL;
export const hasAddress = (s: BusinessSettings) => s.address !== PLACEHOLDER_ADDRESS;
export const hasHours = (s: BusinessSettings) => s.workingHours !== PLACEHOLDER_HOURS;

export function telHref(s: BusinessSettings): string | undefined {
  if (!s.phoneTel) return undefined;
  return s.phoneDisplay.trim().startsWith("+") ? `tel:+${s.phoneTel}` : `tel:${s.phoneTel}`;
}
