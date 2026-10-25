
import { SITE_NAME, SITE_URL, whatsAppNumber } from "../../data/siteInfo";

/* =========================================
   CONTENT & PRICING DATA (edit here only)
   Keep monthly prices as multiples of 5 so the yearly
   discount always lands on clean whole numbers.
========================================= */
const YEARLY_DISCOUNT = 20; // percent

const CURRENCIES = [
  { id: "usd", code: "USD", symbol: "$", label: "US Dollar" },
  { id: "eur", code: "EUR", symbol: "€", label: "Euro" },
  { id: "gbp", code: "GBP", symbol: "£", label: "Pound Sterling" },
];

const PLANS = [
  {
    id: "basic",
    set: "01",
    tier: "Basic",
    name: "Show Up",
    tagline: "Walk in, lift heavy, leave stronger.",
    featured: false,
    prices: { usd: 20, eur: 20, gbp: 15 },
    features: [
      { label: "Full gym floor access", included: true },
      { label: "Free locker", included: true },
      { label: "Group classes", included: true },
      { label: "Personal trainer", included: false },
      { label: "Protein drinks", included: false },
    ],
  },
  {
    id: "standard",
    set: "02",
    tier: "Standard",
    name: "Level Up",
    tagline: "Add a coach and class energy to every rep.",
    featured: true,
    prices: { usd: 40, eur: 35, gbp: 30 },
    features: [
      { label: "Full gym floor access", included: true },
      { label: "Free locker", included: true },
      { label: "Group classes", included: true },
      { label: "Personal trainer", included: true },
      { label: "Protein drinks", included: false },
    ],
  },
  {
    id: "premium",
    set: "03",
    tier: "Premium",
    name: "Go All In",
    tagline: "Every perk, every session, zero excuses.",
    featured: false,
    prices: { usd: 60, eur: 55, gbp: 50 },
    features: [
      { label: "Full gym floor access", included: true },
      { label: "Free locker", included: true },
      { label: "Group classes", included: true },
      { label: "Personal trainer", included: true },
      { label: "Protein drinks", included: true },
    ],
  },
];

/* =========================================
   HELPERS
========================================= */
const yearlyOf = (monthly = 0) => {
  const perMonth = Math.round((monthly * (100 - YEARLY_DISCOUNT)) / 100);
  const total = perMonth * 12;
  return { perMonth, total, saved: monthly * 12 - total };
};

const n = (v = 0) => Number(v).toLocaleString("en-US");

const waLink = (message) =>
  `https://wa.me/${whatsAppNumber}?text=${encodeURIComponent(message)}`;

const joinLink = (plan, cycle) =>
  waLink(`Hello ${SITE_NAME},

I want to join the ${plan?.tier} plan (${plan?.name}) with ${cycle} billing.

Please share the joining steps and payment details.

Thank you.`);

const assessmentLink = waLink(`Hello ${SITE_NAME},

I would like to book a free fitness assessment and find the right membership for me.

Thank you.`);

/* =========================================
   CSS-ONLY TOGGLES (no client JS needed)
   Radios inside .pr drive which price/CTA is visible.
========================================= */
const TOGGLE_CSS = `
.pr [data-cur], .pr [data-bill] { display: none; }
.pr:has(#pr-cur-usd:checked) [data-cur="usd"],
.pr:has(#pr-cur-eur:checked) [data-cur="eur"],
.pr:has(#pr-cur-gbp:checked) [data-cur="gbp"],
.pr:has(#pr-bill-monthly:checked) [data-bill="monthly"],
.pr:has(#pr-bill-yearly:checked) [data-bill="yearly"] { display: revert; }
@supports not selector(:has(*)) {
  .pr [data-cur="usd"], .pr [data-bill="monthly"] { display: revert; }
}
`;

/* =========================================
   SCHEMA MARKUP
========================================= */
const schema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  "@id": `${SITE_URL}/#membership-plans`,
  name: `${SITE_NAME} Membership Plans`,
  itemListElement: PLANS.map((plan, i) => ({
    "@type": "ListItem",
    position: i + 1,
    item: {
      "@type": "Product",
      name: `${SITE_NAME} ${plan.tier} Membership`,
      description: `${plan.tagline} Includes: ${plan.features
        .filter((f) => f.included)
        .map((f) => f.label)
        .join(", ")}.`,
      brand: { "@type": "Brand", name: SITE_NAME },
      url: `${SITE_URL}/#membership`,
      offers: CURRENCIES.flatMap((c) => {
        const m = plan.prices[c.id];
        const y = yearlyOf(m);
        return [
          {
            "@type": "Offer",
            name: `${plan.tier} monthly (${c.code})`,
            price: String(m),
            priceCurrency: c.code,
            availability: "https://schema.org/InStock",
            url: `${SITE_URL}/#membership`,
            priceSpecification: {
              "@type": "UnitPriceSpecification",
              price: m,
              priceCurrency: c.code,
              billingDuration: 1,
              unitCode: "MON",
            },
          },
          {
            "@type": "Offer",
            name: `${plan.tier} yearly (${c.code}, ${YEARLY_DISCOUNT}% off)`,
            price: String(y.total),
            priceCurrency: c.code,
            availability: "https://schema.org/InStock",
            url: `${SITE_URL}/#membership`,
            priceSpecification: {
              "@type": "UnitPriceSpecification",
              price: y.total,
              priceCurrency: c.code,
              billingDuration: 1,
              unitCode: "ANN",
            },
          },
        ];
      }),
    },
  })),
};

const schemaJson = JSON.stringify(schema).replace(/</g, "\\u003c");

/* =========================================
   STYLE TOKENS
========================================= */
const OPTION_CLASS =
  "relative flex cursor-pointer items-center gap-2 rounded-md px-3.5 py-2 text-sm font-semibold text-text-secondary transition-colors hover:text-text-primary has-checked:bg-brand-secondary has-checked:text-white has-checked:hover:text-white has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-brand-primary";

const SLANT = "polygon(8% 0%, 100% 0%, 92% 100%, 0% 100%)";

const EYEBROW_CLASS =
  "text-xs font-bold uppercase tracking-widest text-brand-tertiary [[data-theme=light]_&]:text-brand-secondary";

const SaveTag = () => (
  <span className="rounded bg-warning px-1.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-black">
    Save {YEARLY_DISCOUNT}%
  </span>
);

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4 text-success" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 12.5l4.5 4.5L19 7.5" />
  </svg>
);

const CrossIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4 text-warning" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" aria-hidden="true">
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
);

/* =========================================
   COMPONENT (100% server component)
========================================= */
export default function Pricing() {
  return (
    <section
      id="membership"
      aria-labelledby="membership-heading"
      className="py-10"
    >
      <style>{TOGGLE_CSS}</style>

      <div className="sectionlayout">
        <div className="pr space-y-12">
          {/* Heading + toggles */}
          <header className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-xl space-y-3">
              <p className={EYEBROW_CLASS}>Membership</p>
              <h2
                id="membership-heading"
                className="font-display text-4xl font-bold uppercase leading-[1.1] tracking-tight text-text-primary sm:text-5xl"
              >
                Be Part Of The <span className="text-brand-primary">Movement</span>
              </h2>
              <p className="text-sm leading-relaxed text-text-secondary sm:text-base">
                Pick your set, tap Join Now and we will lock in your first session on
                WhatsApp. Train month to month, or commit yearly and keep{" "}
                {YEARLY_DISCOUNT}% in your pocket.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <fieldset className="m-0 min-w-0 border-0 p-0">
                <legend className="sr-only">Billing period</legend>
                <div className="inline-flex rounded-lg border border-border bg-surface p-0.5">
                  <label className={OPTION_CLASS}>
                    <input
                      type="radio"
                      name="pr-billing"
                      id="pr-bill-monthly"
                      value="monthly"
                      defaultChecked
                      className="sr-only"
                    />
                    Monthly
                  </label>
                  <label className={OPTION_CLASS}>
                    <input
                      type="radio"
                      name="pr-billing"
                      id="pr-bill-yearly"
                      value="yearly"
                      className="sr-only"
                    />
                    Yearly
                    <SaveTag />
                  </label>
                </div>
              </fieldset>

              <fieldset className="m-0 min-w-0 border-0 p-0">
                <legend className="sr-only">Currency</legend>
                <div className="inline-flex rounded-lg border border-border bg-surface p-0.5">
                  {CURRENCIES.map((c) => (
                    <label key={c.id} className={OPTION_CLASS}>
                      <input
                        type="radio"
                        name="pr-currency"
                        id={`pr-cur-${c.id}`}
                        value={c.id}
                        defaultChecked={c.id === "usd"}
                        className="sr-only"
                      />
                      <span aria-hidden="true">{c.symbol}</span>
                      <span>
                        {c.code}
                        <span className="sr-only"> ({c.label})</span>
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>
            </div>
          </header>

          {/* Plans */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 lg:items-center lg:gap-6">
            {PLANS.map((plan) => (
              <article
                key={plan.id}
                aria-labelledby={`plan-${plan.id}`}
                className={`section-bg relative flex flex-col gap-5 rounded-2xl p-6 ${plan.featured ? "shadow-2xl ring-2 ring-brand-primary lg:py-10" : ""
                  }`}
              >
                <header className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <p className="text-xs font-bold uppercase tracking-widest text-text-secondary">
                      Set {plan.set} · {plan.tier}
                    </p>
                    <h3
                      id={`plan-${plan.id}`}
                      className="font-display text-3xl font-bold uppercase tracking-tight text-text-primary"
                    >
                      {plan.name}
                    </h3>
                    <p className="text-sm text-text-secondary">{plan.tagline}</p>
                  </div>
                  {plan.featured && (
                    <span
                      className="shrink-0 bg-brand-secondary px-4 py-1.5 text-xs font-extrabold uppercase tracking-wider text-white"
                      style={{ clipPath: SLANT }}
                    >
                      Most Chosen
                    </span>
                  )}
                </header>

                {/* Price box: every currency x billing combo is rendered, CSS shows one */}
                <div className="rounded-xl border border-border bg-background/50 px-4 py-4">
                  {CURRENCIES.map((c) => {
                    const m = plan.prices?.[c.id] ?? 0;
                    const y = yearlyOf(m);
                    return (
                      <div key={c.id} data-cur={c.id}>
                        <div data-bill="monthly" className="space-y-1.5">
                          <p className="flex items-baseline gap-1.5">
                            <span className="text-xl text-text-secondary">{c.symbol}</span>
                            <span className="font-display text-5xl font-bold leading-[1.15] text-text-primary tabular-nums">
                              {n(m)}
                            </span>
                            <span className="text-sm text-text-secondary">/ mo</span>
                          </p>
                          <p className="text-xs text-text-secondary">Billed monthly</p>
                        </div>

                        <div data-bill="yearly" className="space-y-1.5">
                          <p className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                            <span className="text-xl text-text-secondary">{c.symbol}</span>
                            <span className="font-display text-5xl font-bold leading-[1.15] text-text-primary tabular-nums">
                              {n(y.perMonth)}
                            </span>
                            <span className="text-sm text-text-secondary">/ mo</span>
                            <del className="font-mono text-sm text-text-secondary">
                              <span className="sr-only">Was </span>
                              {c.symbol}
                              {n(m)}
                            </del>
                            <SaveTag />
                          </p>
                          <p className="text-xs text-text-secondary">
                            Billed {c.symbol}
                            {n(y.total)} once a year ·{" "}
                            <strong className="font-semibold text-text-primary">
                              you save {c.symbol}
                              {n(y.saved)}
                            </strong>
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Features */}
                <ul className="space-y-3 text-sm">
                  {plan.features.map((f) => (
                    <li
                      key={f.label}
                      className="flex items-center justify-between gap-3 text-text-secondary"
                    >
                      <span>{f.label}</span>
                      {f.included ? <CheckIcon /> : <CrossIcon />}
                      <span className="sr-only">{f.included ? "Included" : "Not included"}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA: one link per billing cycle so the WhatsApp message stays accurate */}
                <div className="pt-2">
                  {["monthly", "yearly"].map((cycle) => (
                    <div key={cycle} data-bill={cycle}>
                      <a
                        href={joinLink(plan, cycle)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`btn btn-block ${plan.featured ? "btn-primary" : "btn-dark"
                          }`}
                      >
                        Join Now
                        <span className="sr-only">
                          {" "}
                          {plan.tier} plan, {cycle} billing (opens WhatsApp in a new tab)
                        </span>
                      </a>
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>

          {/* Footer note + assessment prompt */}
          <footer className="flex flex-col items-center gap-3 text-center">
            <p className="text-xs text-text-secondary">
              Prices shown per month. Yearly plans are billed once for the full 12 months.
            </p>
            <p className="text-sm text-text-secondary">
              Not sure which set fits your goals?{" "}
              <a
                href={assessmentLink}
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-text-primary underline decoration-brand-primary decoration-2 underline-offset-4 hover:text-brand-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary"
              >
                Book a free fitness assessment
                <span className="sr-only"> (opens WhatsApp in a new tab)</span>
              </a>
            </p>
          </footer>
        </div>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: schemaJson }}
      />
    </section>
  );
}