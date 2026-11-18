import { LegalPage } from "@/components/shared/legal-page";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Terms",
  description: "Terms for using the Shree Krishna Enterprises website and requesting quotations.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms"
      intro="Simple terms for using this website and asking us for a quotation."
      sections={[
        {
          heading: "Quotations and prices",
          paragraphs: [
            "Prices are not fixed on this website. The final quotation is given after we review your requirements and, where needed, visit the site. Price depends on the site, material, design and labour.",
            "Any online estimate, if shown, is only a rough guide and is not an offer.",
          ],
        },
        {
          heading: "Designs and photos",
          paragraphs: [
            "Designs and photos on the website are for reference. The finished work can look different because of room size, lighting, material and site conditions.",
            "Photos marked as inspiration are reference ideas and are not our completed work.",
          ],
        },
        {
          heading: "Work agreement",
          paragraphs: ["Work starts only after the scope, price and schedule are agreed with you. [Add your payment and warranty terms here.]"],
        },
        {
          heading: "Reviews",
          paragraphs: [
            "We check reviews before showing them. We may not show a review that is abusive, unrelated or false.",
          ],
        },
        {
          heading: "Using the website",
          paragraphs: [
            "Please do not misuse the forms or send false information. The content of this website belongs to Shree Krishna Enterprises unless marked otherwise.",
          ],
        },
      ]}
    />
  );
}
