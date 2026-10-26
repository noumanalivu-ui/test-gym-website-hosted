// src/app/contact/page.js
import { Phone, Mail, MapPin, Clock, ShieldCheck, Users } from "lucide-react";
import ContactForm from "../../components/Contact/ContactForm";
import PageHero from "../../components/PageHero";
import { WhatsAppIcon } from "../../utils/icons";
import {
  SITE_NAME,
  SITE_URL,
  SITE_TWITTER_HANDLE,
  SITE_LOGO_URL,
  SITE_OG_IMAGE,
  whatsAppNumber,
  whatsAppNumberFormatted,
  phoneNumberFormatted,
  email,
  address,
  addressMapUrl,
  linkedin_url,
  facebook_url,
  instagram_url,
  twitter_url,
  whatsappMessage1,
  SITE_KEYWORDS,
  addressMapEmbedUrl,
} from "../../data/siteInfo";

/* =========================================
   SEO
========================================= */
const PAGE_URL = `${SITE_URL}/contact`;
const PAGE_TITLE = `Contact Us | ${SITE_NAME}`;
const PAGE_DESCRIPTION = `Book a session, ask about memberships or visit ${SITE_NAME}. Send us a message, call, or chat on WhatsApp and our team will get back to you.`;

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
    images: [{ url: SITE_OG_IMAGE, alt: `Contact ${SITE_NAME}` }],
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
   DATA
========================================= */
const phoneHref = `tel:${(phoneNumberFormatted ?? "").replace(/[^\d+]/g, "")}`;
const whatsAppHref = `https://wa.me/${whatsAppNumber}?text=${whatsappMessage1}`;
const directionsHref = address
  ? `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`
  : "";

const HERO_BADGES = [
  { Icon: Clock, label: "Quick replies on WhatsApp" },
  { Icon: ShieldCheck, label: "Free fitness assessment" },
  { Icon: Users, label: "Friendly coaching team" },
];

const CONTACT_ITEMS = [
  {
    key: "whatsapp",
    label: "WhatsApp",
    value: whatsAppNumberFormatted,
    href: whatsAppHref,
    Icon: WhatsAppIcon,
    external: true,
  },
  { key: "phone", label: "Call us", value: phoneNumberFormatted, href: phoneHref, Icon: Phone },
  { key: "email", label: "Email", value: email, href: `mailto:${email}`, Icon: Mail },
  {
    key: "address",
    label: "Visit us",
    value: address,
    href: directionsHref,
    Icon: MapPin,
    external: true,
  },
].filter((item) => Boolean(item?.value));

const SOCIALS = [
  { label: "Instagram", url: instagram_url },
  { label: "Facebook", url: facebook_url },
  { label: "Twitter", url: twitter_url },
  { label: "LinkedIn", url: linkedin_url },
].filter((s) => Boolean(s?.url));

const STEPS = [
  { title: "Send your request", text: "Pick a date and time slot that suits your routine." },
  { title: "We confirm your slot", text: "Our team reaches out to lock in your visit." },
  { title: "Show up and train", text: "Walk in, meet the crew and start your first session." },
];

const schema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ContactPage",
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
      telephone: phoneNumberFormatted || undefined,
      email: email || undefined,
      address: address ? { "@type": "PostalAddress", streetAddress: address } : undefined,
      hasMap: addressMapUrl || undefined,
      sameAs: SOCIALS.length ? SOCIALS.map((s) => s.url) : undefined,
      contactPoint: [
        {
          "@type": "ContactPoint",
          contactType: "customer service",
          telephone: `+${whatsAppNumber}`,
          availableLanguage: ["English"],
        },
      ],
    },
  ],
};

const schemaJson = JSON.stringify(schema).replace(/</g, "\\u003c");

const FOCUS_CLASS =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary";
const H2_CLASS =
  "font-display text-2xl font-bold tracking-tight text-text-primary sm:text-3xl";

/* =========================================
   PAGE (server component)
========================================= */
export default function ContactPage() {
  return (
    <main>
      <PageHero
        headingId="contact-heading"
        breadcrumbItems={[{ label: "Contact", href: "/contact" }]}
        title="Your First Rep"
        highlight="Starts Here"
        description="Book a session, ask about memberships or just say hello. Fill in the form or reach us directly and our team will take it from there."
        primaryCta={{ label: "Book your session", href: "#book-session" }}
        secondaryCta={{ label: "Chat on WhatsApp", href: whatsAppHref, external: true }}
        badges={HERO_BADGES}
      />

      {/* Info + form */}
      <section aria-label="Get in touch" className="py-10">
        <div className="sectionlayout">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[5fr_7fr] lg:items-start">
            {/* Left: direct contact */}
            <div className="space-y-10">
              <section aria-labelledby="reach-heading" className="space-y-4">
                <h2 id="reach-heading" className={H2_CLASS}>
                  Get In Touch
                </h2>

                <ul className="section-bg divide-y divide-border rounded-2xl">
                  {CONTACT_ITEMS.map(({ key, label, value, href, Icon, external }) => (
                    <li key={key}>
                      <a
                        href={href}
                        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                        className={`flex items-center gap-4 p-4 transition-colors first:rounded-t-2xl last:rounded-b-2xl hover:bg-surface-hover ${FOCUS_CLASS}`}
                      >
                        <Icon
                          className="h-5 w-5 shrink-0 text-brand-primary"
                          aria-hidden="true"
                          strokeWidth={1.8}
                        />
                        <span className="min-w-0">
                          <span className="block text-sm text-text-secondary">{label}</span>
                          <span className="block break-words text-base font-semibold text-text-primary">
                            {value}
                          </span>
                        </span>
                        {external && <span className="sr-only">(opens in a new tab)</span>}
                      </a>
                    </li>
                  ))}
                </ul>

                {SOCIALS.length > 0 && (
                  <nav aria-label="Social media" className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
                    <span className="text-text-secondary">Follow us:</span>
                    {SOCIALS.map((s) => (
                      <a
                        key={s.label}
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`rounded font-semibold text-text-primary underline decoration-border decoration-2 underline-offset-4 transition-colors hover:decoration-brand-primary ${FOCUS_CLASS}`}
                      >
                        {s.label}
                        <span className="sr-only"> (opens in a new tab)</span>
                      </a>
                    ))}
                  </nav>
                )}
              </section>

              <aside aria-labelledby="steps-heading" className="space-y-4">
                <h2 id="steps-heading" className={H2_CLASS}>
                  How It Works
                </h2>
                <ol className="list-decimal space-y-3 pl-5 marker:font-semibold marker:text-brand-primary">
                  {STEPS.map((s) => (
                    <li key={s.title} className="pl-1 text-sm leading-relaxed text-text-secondary sm:text-base">
                      <strong className="font-semibold text-text-primary">{s.title}.</strong> {s.text}
                    </li>
                  ))}
                </ol>
              </aside>
            </div>

            {/* Right: booking form */}
            <article
              id="book-session"
              aria-labelledby="form-heading"
              className="section-bg scroll-mt-28 rounded-2xl p-4 shadow-2xl"
            >
              <h2
                id="form-heading"
                className="mb-6 font-display text-3xl font-bold tracking-tight text-text-primary sm:text-4xl"
              >
                Book Your Session
              </h2>
              <ContactForm />
            </article>
          </div>
        </div>
      </section>

      {/* Find us: directions button first, map below */}
      {(directionsHref || addressMapUrl) && (
        <section aria-labelledby="map-heading" className="pb-16 pt-2">
          <div className="sectionlayout space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="space-y-1">
                <h2 id="map-heading" className={H2_CLASS}>
                  Find Us
                </h2>
                {address && <p className="text-sm text-text-secondary sm:text-base">{address}</p>}
              </div>

              {directionsHref && (
                <a
                  href={directionsHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-2 rounded-full bg-brand-secondary px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 sm:text-base ${FOCUS_CLASS}`}
                >
                  <MapPin className="h-4 w-4" aria-hidden="true" />
                  Get Directions
                  <span className="sr-only"> (opens Google Maps in a new tab)</span>
                </a>
              )}
            </div>

            {addressMapEmbedUrl && (
              <iframe
                title={`${SITE_NAME} location on Google Maps`}
                src={addressMapEmbedUrl}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
                className="h-[50vh] min-h-[300px] w-full rounded-2xl border border-border"
              />
            )}
          </div>
        </section>
      )}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: schemaJson }}
      />
    </main>
  );
}