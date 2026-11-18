import { PageHeader } from "@/components/layout/page-header";
import { Section } from "@/components/layout/section";
import { ItemImage } from "@/components/shared/item-image";
import { WhatsAppLink } from "@/components/shared/contact-buttons";
import { EmptyState } from "@/components/states/empty-state";
import { ErrorState } from "@/components/states/error-state";
import { getBusinessSettings } from "@/lib/business-settings";
import { getInspiration } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { toPinterestEmbed } from "@/lib/video";

export const revalidate = 60;
export const metadata = pageMetadata({
  title: "Inspiration",
  description: "Reference ideas for POP and PVC interiors. These are not our completed work.",
  path: "/inspiration",
});

const LICENCE: Record<string, string> = {
  own_image: "Our own image",
  licensed: "Licensed image",
  permitted_embed: "Embedded with the platform’s official embed",
  permission_granted: "Used with the owner’s permission",
};

export default async function InspirationPage() {
  const [settings, items] = await Promise.all([getBusinessSettings(), getInspiration()]);
  return (
    <>
      <PageHeader
        title="Inspiration"
        description="Reference ideas to help you decide what you like. These are not our completed work. For our own work, see Our Projects."
      />
      <Section>
        {items.failed ? (
          <ErrorState />
        ) : items.data.length === 0 ? (
          <EmptyState
            title="Inspiration will appear here soon"
            description="Send us a photo of a design you like on WhatsApp and we will tell you if we can do it."
            action={<WhatsAppLink settings={settings} />}
          />
        ) : (
          <ul className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {items.data.map((item) => {
              const pin = toPinterestEmbed(item.embed_url);
              return (
                <li key={item.id}>
                  {item.image_path ? (
                    <ItemImage path={item.image_path} alt={item.title} className="aspect-[4/3]" />
                  ) : pin ? (
                    <iframe
                      src={pin}
                      title={item.title}
                      loading="lazy"
                      height={420}
                      className="w-full max-w-[345px] border-0"
                    />
                  ) : item.embed_url ? (
                    <a
                      href={item.embed_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex aspect-[4/3] items-center justify-center bg-beige text-charcoal underline"
                    >
                      View on Pinterest
                    </a>
                  ) : null}

                  <p className="mt-3 inline-block rounded-sm bg-beige px-2 py-1 text-xs text-stone">
                    Inspiration / reference, not our work
                  </p>
                  <h3 className="mt-2 text-xl text-charcoal">{item.title}</h3>
                  <p className="mt-1 text-sm text-stone">{LICENCE[item.license_type]}</p>
                  {item.attribution ? <p className="mt-1 text-sm text-stone">{item.attribution}</p> : null}
                  {item.source_name ? (
                    <p className="mt-1 text-sm text-stone">
                      Source:{" "}
                      {item.source_url ? (
                        <a
                          href={item.source_url}
                          target="_blank"
                          rel="noopener noreferrer nofollow"
                          className="underline hover:text-charcoal"
                        >
                          {item.source_name}
                        </a>
                      ) : (
                        item.source_name
                      )}
                    </p>
                  ) : null}
                </li>
              );
            })}
          </ul>
        )}
      </Section>
    </>
  );
}
