import { PageHeader } from "@/components/layout/page-header";
import { Section } from "@/components/layout/section";
import { JoinTeamForm } from "@/components/forms/join-team-form";
import { WhatsAppLink } from "@/components/shared/contact-buttons";
import { SectionHeading } from "@/components/shared/section-heading";
import { getBusinessSettings } from "@/lib/business-settings";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Join Our Team",
  description: "Work with Shree Krishna Enterprises as a helper, POP expert, PVC installer or skilled worker.",
  path: "/join-our-team",
});

export default async function JoinPage() {
  const settings = await getBusinessSettings();

  return (
    <>
      <PageHeader
        title="Join Our Team"
        description="We look for reliable helpers and skilled workers for POP false ceiling and PVC wall/ceiling work."
      />

      <Section>
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHeading
              title="Apply online"
              description="Fill in your name, mobile number, and work experience. We will call you when site work is available."
            />
            <div className="mt-6">
              <p className="mb-3 text-sm text-stone">Or send your details directly on WhatsApp:</p>
              <WhatsAppLink settings={settings} label="Apply on WhatsApp" />
            </div>
          </div>

          <div className="lg:col-span-7">
            <JoinTeamForm />
          </div>
        </div>
      </Section>
    </>
  );
}
