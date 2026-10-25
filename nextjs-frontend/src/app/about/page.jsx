// src/app/about/page.js  (server component)
import Link from "next/link";
import { Quote, Dumbbell, Activity, Layers, Move, ArrowUpRight } from "lucide-react";
import PageHero from "../../components/PageHero";
import JourneyWithUs2 from "../../components/about/JourneyWithUs2"; // adjust path if different
import { WhatsAppIcon } from "../../utils/icons";
import {
  SITE_NAME,
  SITE_URL,
  SITE_TWITTER_HANDLE,
  SITE_LOGO_URL,
  SITE_OG_IMAGE,
  SITE_KEYWORDS,
  whatsAppNumber,
  whatsappMessage1,
} from "../../data/siteInfo";

/* =========================================
   SEO
========================================= */
const PAGE_URL = `${SITE_URL}/about`;
const PAGE_TITLE = `About Us | ${SITE_NAME}`;
const PAGE_DESCRIPTION = `Meet the team behind ${SITE_NAME}. Learn our story, our principles and the equipment we train with, then book a free assessment.`;

export const metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  keywords: SITE_KEYWORDS || undefined,
  alternates: { canonical: PAGE_URL },
  robots: { index: true, follow: true },
  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    url: PAGE_URL,
    siteName: SITE_NAME,
    type: "website",
    locale: "en_US",
    images: [{ url: SITE_OG_IMAGE, alt: `About ${SITE_NAME}` }],
  },
  twitter: {
    card: "summary_large_image",
    site: SITE_TWITTER_HANDLE,
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    images: [SITE_OG_IMAGE],
  },
};

/* =========================================
   EDITABLE CONTENT (no numbers anywhere)
========================================= */
const OWNER_MESSAGE = {
  heading: "A Message From The Owner",
  paragraphs: [
    `We built ${SITE_NAME} for people who want a gym that feels welcoming from the first minute. No ego, no pressure, just honest coaching and a floor that is always ready for your session.`,
    "Every machine, every program and every coach here exists for one reason: to help you get stronger, healthier and more confident than you were yesterday.",
    "Walk in, say hello and let us show you what is possible. We would love to be part of your journey.",
  ],
  signature: `The Owner, ${SITE_NAME}`,
};

const EQUIPMENT = [
  { title: "Free Weights", text: "Dumbbells, barbells and plates for every level, from first lift to personal best.", Icon: Dumbbell },
  { title: "Strength Machines", text: "Guided, joint-friendly machines that target every major muscle group.", Icon: Layers },
  { title: "Cardio Zone", text: "Treadmills, bikes and rowers to build stamina at your own pace.", Icon: Activity },
  { title: "Functional Area", text: "Open space, ropes and mats for mobility, conditioning and core work.", Icon: Move },
];

// Add the brands you actually stock, for example ["Brand One", "Brand Two"].
// The brands strip hides itself while this list is empty.
const BRANDS = [];

const WHATSAPP_HREF = `https://wa.me/${whatsAppNumber}?text=${whatsappMessage1}`;

const HERO_BADGES = [
  { label: "Welcoming for every level" },
  { label: "Coached sessions" },
  { label: "Quality equipment" },
];

/* =========================================
   SCHEMA
========================================= */
const schema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "AboutPage",
      "@id": `${PAGE_URL}#webpage`,
      url: PAGE_URL,
      name: PAGE_TITLE,
      description: PAGE_DESCRIPTION,
      inLanguage: "en",
      isPartOf: { "@type": "WebSite", name: SITE_NAME, url: SITE_URL },
      about: { "@id": `${SITE_URL}/#organization` },
    },
    {
      "@type": "HealthClub",
      "@id": `${SITE_URL}/#organization`,
      name: SITE_NAME,
      url: SITE_URL,
      logo: SITE_LOGO_URL,
      image: SITE_OG_IMAGE,
    },
  ],
};
const schemaJson = JSON.stringify(schema).replace(/</g, "\\u003c");

const FOCUS_CLASS =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary";
const H2_CLASS =
  "font-display text-2xl font-bold tracking-tight text-text-primary sm:text-4xl";

/* =========================================
   PAGE
========================================= */
export default function AboutPage() {
  return (
    <main>
      <PageHero
        headingId="about-heading"
        breadcrumbItems={[{ label: "About", href: "/about" }]}
        title="Built For People"
        highlight="Who Show Up"
        description={`${SITE_NAME} is a gym where coaching, equipment and community come together. Here is who we are and what we stand for.`}
        primaryCta={{ label: "Book a free assessment", href: "/contact#book-session" }}
        secondaryCta={{ label: "Chat on WhatsApp", href: WHATSAPP_HREF, external: true }}
        badges={HERO_BADGES}
      />

      {/* Story + animated image (second version) */}
      <JourneyWithUs2
        sectionId="our-story"
        headingId="our-story-heading"
        title="Where Strong"
        highlight="Starts For Everyone"
        intro={`At ${SITE_NAME} every member gets a plan, a coach in their corner and a space that makes showing up easy. Here is how we train and why it works.`}
      />

      {/* Owner message (no name) */}
      <section aria-labelledby="owner-heading" className="py-14 sm:py-20">
        <div className="sectionlayout">
          <figure className="section-bg relative mx-auto max-w-3xl rounded-2xl p-6 sm:p-10">
            <Quote
              className="absolute right-6 top-6 h-8 w-8 text-brand-primary/30 sm:h-10 sm:w-10"
              aria-hidden="true"
            />
            <h2 id="owner-heading" className={H2_CLASS}>
              {OWNER_MESSAGE.heading}
            </h2>
            <blockquote className="mt-6 space-y-4 text-sm leading-relaxed text-text-secondary sm:text-base">
              {OWNER_MESSAGE.paragraphs.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </blockquote>
            <figcaption className="mt-6 border-t border-border pt-4 text-sm font-semibold text-text-primary">
              {OWNER_MESSAGE.signature}
            </figcaption>
          </figure>
        </div>
      </section>

      {/* Equipment (no counts) */}
      <section aria-labelledby="equipment-heading" className="border-t border-border py-14 sm:py-20">
        <div className="sectionlayout">
          <header className="mx-auto max-w-2xl text-center">
            <h2 id="equipment-heading" className={H2_CLASS}>
              Equipment &amp; <span className="text-brand-primary">Brands</span>
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-text-secondary sm:text-base">
              Quality gear for every kind of session, chosen for safety, comfort and long-term performance.
            </p>
          </header>

          <ul className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
            {EQUIPMENT.map(({ title, text, Icon }) => (
              <li key={title} className="section-bg rounded-2xl p-5 sm:p-6">
                <div className="flex items-center gap-3.5">
                  <Icon className="h-7 w-7 shrink-0 text-brand-primary" strokeWidth={1.7} aria-hidden="true" />
                  <h3 className="font-display text-lg font-bold leading-tight tracking-tight text-text-primary sm:text-xl">
                    {title}
                  </h3>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-text-secondary">{text}</p>
              </li>
            ))}
          </ul>

          {BRANDS.length > 0 && (
            <div className="mt-10">
              <h3 className="text-center text-[11px] font-semibold uppercase tracking-widest text-text-secondary">
                Brands we train with
              </h3>
              <ul className="mt-4 flex flex-wrap items-center justify-center gap-2.5">
                {BRANDS.map((b) => (
                  <li
                    key={b}
                    className="rounded-full border border-border bg-surface px-4 py-2 font-display text-sm font-bold tracking-tight text-text-primary"
                  >
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>

      {/* Closing CTA */}
      <section aria-labelledby="about-cta-heading" className="border-t border-border py-14 sm:py-20">
        <div className="sectionlayout flex flex-col items-center gap-5 text-center">
          <h2 id="about-cta-heading" className={H2_CLASS}>
            Ready To Meet <span className="text-brand-primary">The Crew?</span>
          </h2>
          <p className="max-w-lg text-sm leading-relaxed text-text-secondary sm:text-base">
            Book a free assessment or send us a quick message. We will help you pick the right start.
          </p>
          <div className="flex w-full flex-col items-stretch justify-center gap-3 sm:w-auto sm:flex-row">
            <Link href="/contact#book-session" className="btn btn-primary">
              Book a Free Assessment
            </Link>
            <a
              href={WHATSAPP_HREF}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Quick chat on WhatsApp (opens in a new tab)"
              className={`inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-surface px-6 py-3 text-base font-semibold text-text-primary transition-colors hover:border-[#25D366] hover:bg-surface-hover ${FOCUS_CLASS}`}
            >
              <WhatsAppIcon className="h-5 w-5 text-[#25D366]" aria-hidden="true" />
              Quick Chat
            </a>
          </div>
          <Link
            href="/#services"
            className={`group inline-flex items-center gap-1.5 rounded text-sm font-semibold text-text-primary transition-colors hover:text-brand-primary ${FOCUS_CLASS}`}
          >
            Explore our services
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
          </Link>
        </div>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaJson }} />
    </main>
  );
}