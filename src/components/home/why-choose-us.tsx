import { Hammer, FileText, ShieldCheck, CheckCircle2 } from "lucide-react";
import { Section } from "@/components/layout/section";

export function WhyChooseUs({ businessName }: { businessName: string }) {
  return (
    <Section tone="beige" id="why-choose-us">
      <div className="max-w-2xl">
        <span className="text-xs font-semibold uppercase tracking-wider text-gold-deep">
          Our Standard
        </span>
        <h2 className="mt-2 text-3xl text-charcoal sm:text-4xl">
          Why Choose {businessName}
        </h2>
        <p className="mt-3 text-stone">
          Focused strictly on Plaster of Paris and PVC interior craftsmanship. We believe in direct communication, honest measurements, and tidy job sites.
        </p>
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-sm border border-line bg-warm-white p-6 shadow-xs">
          <Hammer className="size-8 text-gold" aria-hidden="true" />
          <h3 className="mt-4 font-serif text-xl text-charcoal">Direct Artisans</h3>
          <p className="mt-2 text-sm leading-relaxed text-stone">
            Work performed directly by dedicated POP masters and PVC installers, avoiding intermediary commissions.
          </p>
        </div>

        <div className="rounded-sm border border-line bg-warm-white p-6 shadow-xs">
          <FileText className="size-8 text-gold" aria-hidden="true" />
          <h3 className="mt-4 font-serif text-xl text-charcoal">Transparent Quotes</h3>
          <p className="mt-2 text-sm leading-relaxed text-stone">
            Clear scope, material grades, and square-footage estimates provided before work commences. No surprise charges.
          </p>
        </div>

        <div className="rounded-sm border border-line bg-warm-white p-6 shadow-xs">
          <ShieldCheck className="size-8 text-gold" aria-hidden="true" />
          <h3 className="mt-4 font-serif text-xl text-charcoal">Quality Materials</h3>
          <p className="mt-2 text-sm leading-relaxed text-stone">
            Standard-weight GI channels, pure Plaster of Paris, and moisture-resistant PVC panels engineered to prevent sagging.
          </p>
        </div>

        <div className="rounded-sm border border-line bg-warm-white p-6 shadow-xs">
          <CheckCircle2 className="size-8 text-gold" aria-hidden="true" />
          <h3 className="mt-4 font-serif text-xl text-charcoal">Clean Handover</h3>
          <p className="mt-2 text-sm leading-relaxed text-stone">
            Careful floor protection during installation, straight ceiling levels, and post-work site cleanup.
          </p>
        </div>
      </div>
    </Section>
  );
}
