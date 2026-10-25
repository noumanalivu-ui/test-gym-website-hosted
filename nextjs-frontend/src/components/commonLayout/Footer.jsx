// src/components/layout/Footer.jsx  (server component, no client JS)
import Link from "next/link";
import Image from "next/image";
import { MapPin, Phone, Mail, Heart } from "lucide-react";
import { WhatsAppIcon } from "../../utils/icons";
import {
  ClockIcon,
  FacebookIcon,
  InstagramIcon,
  LinkedinIcon,
  XIcon,
} from "../../utils/icons";
import {
  SITE_NAME,
  SITE_URL,
  SITE_LOGO_URL,
  address,
  addressMapUrl,
  whatsAppNumber,
  whatsAppNumberFormatted,
  whatsappMessage1,
  phoneNumber,
  phoneNumberFormatted,
  email,
  socialLinks,
} from "../../data/siteInfo";

/* =========================================
   EDITABLE CONTENT
========================================= */
const ABOUT_TEXT =
  "Coached sessions, quality equipment and a crew that pushes you further. Walk in today and train your first session with us.";

const quickLinks = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Services", href: "/#services" },
  { name: "Fitness Calculators", href: "/#fitness-calculators" },
  { name: "Testimonials", href: "/#testimonials" },
  { name: "Pricing", href: "/#membership" },
  { name: "Contact", href: "/contact" },
];

// days/opens/closes feed the schema, label/time feed the UI
const HOURS = [
  {
    label: "Monday - Friday",
    time: "7:00 AM - 10:00 PM",
    days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    opens: "07:00",
    closes: "22:00",
  },
  {
    label: "Saturday - Sunday",
    time: "7:00 AM - 2:00 PM",
    days: ["Saturday", "Sunday"],
    opens: "07:00",
    closes: "14:00",
  },
];

// "Made with love by": paste your own LinkedIn / Facebook / WhatsApp / GitHub link
const CREDIT = {
  name: "Nouman Ali",
  href: "https://www.linkedin.com/in/noumanali-dev/",
};

/* =========================================
   DERIVED FROM siteInfo.js (no hardcoded site data)
========================================= */
const getPath = (url) => {
  try {
    return new URL(url).pathname;
  } catch {
    return "/logo.svg";
  }
};
const LOGO_SRC = getPath(SITE_LOGO_URL); // "/logo.svg" from public/

const phoneDigits = (phoneNumber || phoneNumberFormatted || "").replace(/[^\d+]/g, "");

const mapHref =
  addressMapUrl ||
  (address
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`
    : "");

const CONTACTS = [
  { id: "address", label: "Address", value: address, href: mapHref, Icon: MapPin, external: true },
  {
    id: "phone",
    label: "Call us",
    value: phoneNumberFormatted || phoneNumber,
    href: phoneDigits ? `tel:${phoneDigits}` : "",
    Icon: Phone,
  },
  {
    id: "whatsapp",
    label: "WhatsApp",
    value: whatsAppNumberFormatted || whatsAppNumber,
    href: whatsAppNumber ? `https://wa.me/${whatsAppNumber}?text=${whatsappMessage1}` : "",
    Icon: WhatsAppIcon,
    external: true,
  },
  {
    id: "email",
    label: "Email",
    value: email,
    href: email ? `mailto:${email}` : "",
    Icon: Mail,
  },
].filter((c) => c?.value && c?.href);

const SOCIALS = [
  { key: "fb", label: "Facebook", Icon: FacebookIcon },
  { key: "insta", label: "Instagram", Icon: InstagramIcon },
  { key: "li", label: "LinkedIn", Icon: LinkedinIcon },
  { key: "x", label: "X", Icon: XIcon },
]
  .map((s) => ({ ...s, href: socialLinks?.[s?.key] }))
  .filter((s) => Boolean(s?.href));

/* =========================================
   SCHEMA (same @id as the homepage organization, so it merges)
========================================= */
const schema = {
  "@context": "https://schema.org",
  "@type": "HealthClub",
  "@id": `${SITE_URL}/#organization`,
  name: SITE_NAME,
  url: SITE_URL,
  logo: SITE_LOGO_URL,
  email: email || undefined,
  telephone: phoneNumberFormatted || phoneNumber || undefined,
  address: address ? { "@type": "PostalAddress", streetAddress: address } : undefined,
  hasMap: addressMapUrl || undefined,
  openingHoursSpecification: HOURS.map((h) => ({
    "@type": "OpeningHoursSpecification",
    dayOfWeek: h?.days,
    opens: h?.opens,
    closes: h?.closes,
  })),
  sameAs: SOCIALS.length ? SOCIALS.map((s) => s?.href) : undefined,
};
const schemaJson = JSON.stringify(schema).replace(/</g, "\\u003c");

/* shared classes */
const focusRing =
  "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-primary";
const headingCls =
  "inline-block border-b-2 border-brand-primary pb-1.5 font-display text-xl font-bold tracking-tight text-text-primary";

const Footer = () => { 
  return (
    <footer
      id="footer"
      aria-label={`${SITE_NAME} footer`}
      className="border-t border-border"
    >
      {/* py-10! needed: .sectionlayout is unlayered CSS and beats normal utilities */}
      <div className="sectionlayout py-10! sm:py-14!">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-[1.25fr_0.75fr_1.1fr] lg:gap-12">
          {/* Column 1: logo, text, hours */}
          <section className="md:col-span-2 lg:col-span-1">
            <Link
              href="/"
              aria-label={`${SITE_NAME} home`}
              className={`inline-block rounded ${focusRing}`}
            >
              <Image
                src={LOGO_SRC}
                alt=""
                width={160}
                height={48}
                unoptimized
                className="h-10 w-auto sm:h-12"
              />
            </Link>

            <p className="mt-5 max-w-sm text-sm leading-relaxed text-text-secondary sm:text-base">
              {ABOUT_TEXT}
            </p>

            <div className="mt-6 flex items-start gap-4">
              <ClockIcon className="h-10 w-10 shrink-0 text-brand-primary" />
              <div>
                <h2 className="sr-only">Opening hours</h2>
                <dl className="space-y-3">
                  {HOURS.map((h) => (
                    <div key={h?.label}>
                      <dt className="text-sm font-semibold text-text-primary">{h?.label}</dt>
                      <dd className="text-sm text-text-secondary sm:text-base">{h?.time}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </section>

          {/* Column 2: quick links */}
          <nav aria-labelledby="footer-links-heading">
            <h2 id="footer-links-heading" className={headingCls}>
              Quick Links
            </h2>
            <ul className="mt-5 grid grid-cols-2 gap-x-4 gap-y-1 md:grid-cols-1">
              {quickLinks.map((link) => (
                <li key={link?.href}>
                  <Link
                    href={link?.href}
                    className={`inline-block rounded py-1.5 text-sm text-text-secondary transition-all duration-200 hover:translate-x-1 hover:text-text-primary hover:underline hover:underline-offset-4 motion-reduce:transition-none motion-reduce:hover:translate-x-0 sm:text-base ${focusRing}`}
                  >
                    {link?.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Column 3: contact */}
          <section>
            <h2 className={headingCls}>Contact Us</h2>
            <address className="mt-5 not-italic">
              <ul className="space-y-4">
                {CONTACTS.map(({ id, label, value, href, Icon, external }) => (
                  <li key={id}>
                    <a
                      href={href}
                      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      className={`group flex items-start gap-4 rounded ${focusRing}`}
                    >
                      <span
                        aria-hidden="true"
                        className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-brand-primary text-white transition-colors duration-200 group-hover:bg-brand-secondary"
                      >
                        <Icon className="h-5 w-5" aria-hidden="true" />
                      </span>
                      <span className="min-w-0 break-words pt-2.5 text-sm leading-relaxed text-text-secondary transition-colors group-hover:text-text-primary group-hover:underline group-hover:underline-offset-4 sm:text-base">
                        <span className="sr-only">{label}: </span>
                        {value}
                        {external && <span className="sr-only"> (opens in a new tab)</span>}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </address>
          </section>
        </div>

        {/* Social links: bottom right */}
        {SOCIALS.length > 0 && (
          <nav aria-label="Social media" className="mt-10 flex justify-start md:justify-end">
            <ul className="flex items-center gap-3">
              {SOCIALS.map(({ key, label, href, Icon }) => (
                <li key={key}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${label} (opens in a new tab)`}
                    className="grid h-11 w-11 place-items-center rounded-full border border-border text-text-secondary transition-colors duration-200 hover:border-brand-primary hover:bg-brand-primary hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary"
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        )}

        <hr className="mt-6 border-border" />

        {/* Bottom bar */}
        <div className="mt-6 flex flex-col gap-3 text-sm text-text-secondary md:flex-row md:items-center md:justify-between">
          <p>
            &copy; 22026 {SITE_NAME}. All rights reserved.
          </p>

          <p className="flex flex-wrap items-center gap-1.5">
            Made with
            <Heart className="h-4 w-4 fill-brand-primary text-brand-primary" aria-hidden="true" />
            <span className="sr-only">love</span>
            by
            {CREDIT?.href ? (
              <a
                href={CREDIT.href}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded font-semibold text-text-primary underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary"
              >
                {CREDIT?.name}
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            ) : (
              <span className="font-semibold text-text-primary">{CREDIT?.name}</span>
            )}
          </p>
        </div>
      </div>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaJson }} />
    </footer>
  );
};

export default Footer;