import { notFound } from "next/navigation";
import { PageHeader } from "@/components/layout/page-header";
import { Section } from "@/components/layout/section";
import { ErrorState } from "@/components/states/error-state";
import { getBusinessSettings } from "@/lib/business-settings";
import { getDesigns } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { SavedDesignsGrid } from "./saved-designs-grid";

export const revalidate = 60;
export const metadata = pageMetadata({
  title: "Saved Designs",
  description: "Designs you saved on this device.",
  path: "/designs/saved",
  noindex: true,
});

export default async function SavedDesignsPage() {
  const settings = await getBusinessSettings();
  if (!settings.features.favourites) notFound();
  const designs = await getDesigns();
  return (
    <>
      <PageHeader title="Saved designs" description="Designs you saved on this device." />
      <Section>{designs.failed ? <ErrorState /> : <SavedDesignsGrid designs={designs.data} />}</Section>
    </>
  );
}
