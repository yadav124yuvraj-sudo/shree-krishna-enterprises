import { LegalPage } from "@/components/shared/legal-page";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Privacy Policy",
  description: "How Shree Krishna Enterprises uses the details you share with us.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      intro="What we collect when you contact us, and what we do with it."
      sections={[
        {
          heading: "What we collect",
          paragraphs: [
            "When you send an enquiry, a quotation request, a design request, a review or a job application, we collect the details you type: your name, phone number, address or area, room details and any photos you upload.",
            "If you message or call us on WhatsApp or phone, we see the number and the messages you send.",
          ],
        },
        {
          heading: "How we use it",
          paragraphs: [
            "We use your details only to reply to you, visit your site, prepare a quotation, do the work you ask for, or consider your job application.",
            "We do not sell your details or share them for advertising.",
          ],
        },
        {
          heading: "Photos you upload",
          paragraphs: [
            "Photos of your room or reference designs are kept private and are seen only by us. We do not show them on the website without asking you first.",
          ],
        },
        {
          heading: "Reviews",
          paragraphs: [
            "A review is shown on the website only after we approve it. Your name and the review text are shown. Your phone number is never shown.",
          ],
        },
        {
          heading: "How long we keep it",
          paragraphs: ["We keep enquiry details for as long as we need them to serve you and for our records. [Add how long you keep them.]"],
        },
        {
          heading: "Your choices",
          paragraphs: [
            "You can ask us to correct or delete your details at any time by calling or messaging us on the contact details shown on the Contact page.",
          ],
        },
        {
          heading: "Cookies and storage",
          paragraphs: [
            "The website saves your favourite designs in your own browser so you can find them later. This stays on your device.",
          ],
        },
      ]}
    />
  );
}
