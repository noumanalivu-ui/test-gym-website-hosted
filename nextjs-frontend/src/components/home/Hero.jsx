// src/components/home/Hero.jsx (server component, no client JS)
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import {
  SITE_NAME,
  SITE_URL,
  SITE_LOGO_URL,
  SITE_OG_IMAGE,
  phoneNumberFormatted,
  linkedin_url,
  facebook_url,
  instagram_url,
  twitter_url,
} from "../../data/siteInfo";
import HeroClient from "./HeroClient";

/* =========================================
   EDITABLE CONTENT
========================================= */
const HERO = {
  title: "Build Your",
  highlight: "Stronger Version.",
  description: `Join ${SITE_NAME} for coached sessions, quality equipment and a crew that pushes you further. Walk in today and train your first session with us.`,
  primaryCta: { label: "Join Now", href: "/#membership" },
  secondaryCta: { label: "Book a free assessment", href: "/contact#book-session" },
};

const STATS = [
  { value: "500+", label: "Active members" },
  { value: "15+", label: "Certified coaches" },
  { value: "20+", label: "Weekly classes" },
];

const STRIPS = [
  { src: "/hero_strip_strenght.webp", alt: "Member lifting on the strength floor", label: "Strength", size: "h-[78%]" },
  { src: "/hero_strip_cardio.webp", alt: "Cardio zone with machines lined up", label: "Cardio", size: "h-full" },
  { src: "/hero_strip_classes.webp", alt: "Group class in full swing", label: "Classes", size: "h-[66%]" },
];

const MARQUEE = ["Strength", "Cardio", "Mobility", "Group Classes", "Personal Training", "Meal Plans"];

const SLANT = "polygon(14% 0%, 100% 0%, 86% 100%, 0% 100%)";

/* =========================================
   SCHEMA (homepage)
========================================= */
const socials = [instagram_url, facebook_url, twitter_url, linkedin_url].filter(Boolean);

const schema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      name: SITE_NAME,
      url: SITE_URL,
      inLanguage: "en",
    },
    {
      "@type": "HealthClub",
      "@id": `${SITE_URL}/#organization`,
      name: SITE_NAME,
      url: SITE_URL,
      logo: SITE_LOGO_URL,
      image: SITE_OG_IMAGE,
      description: HERO.description,
      telephone: phoneNumberFormatted || undefined,
      sameAs: socials.length ? socials : undefined,
    },
  ],
};
const schemaJson = JSON.stringify(schema).replace(/</g, "\\u003c");

export default function Hero() {
  return (
    <HeroClient>
      <section
        aria-labelledby="hero-heading"
        className="relative flex h-full min-h-[calc(100svh-4rem)] flex-col overflow-hidden"
      >
        {/* Background: brand glow + faint diagonal texture */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(55% 60% at 78% 35%, color-mix(in srgb, var(--brand-primary) 16%, transparent), transparent 70%)",
            }}
          />
          <div
            className="absolute inset-0 opacity-40"
            style={{
              backgroundImage:
                "repeating-linear-gradient(115deg, transparent 0 26px, var(--border) 26px 27px)",
              maskImage: "radial-gradient(70% 80% at 70% 40%, black, transparent 75%)",
              WebkitMaskImage: "radial-gradient(70% 80% at 70% 40%, black, transparent 75%)",
            }}
          />
        </div>

        <div className="sectionlayout relative flex min-h-0 flex-1 flex-col justify-center py-2 sm:py-6 lg:py-10">          <div className="grid w-full grid-cols-1 items-center gap-3 sm:gap-6 lg:grid-cols-[1.05fr_1fr] lg:gap-8">
          {/* Left: copy */}
          <div data-aos="fade-right">
            <h1
              id="hero-heading"
              className="font-display text-2xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.08] tracking-tight text-text-primary"
            >
              {HERO.title}
              <span className="block text-brand-primary">{HERO.highlight}</span>
            </h1>

            <p className="mt-1.5 sm:mt-3.5 max-w-xl text-xs sm:text-base leading-relaxed text-text-secondary lg:text-lg">
              {HERO.description}
            </p>

            <div className="mt-3 sm:mt-6 flex flex-wrap items-center gap-x-5 gap-y-3">
              <Link
                href={HERO.primaryCta.href}
                className="btn btn-primary text-xs sm:text-base px-5 py-2 sm:px-7 sm:py-3.5"
              >
                {HERO.primaryCta.label}
              </Link>

              {/* Secondary: no underline, arrow-up-right icon */}
              <Link
                href={HERO.secondaryCta.href}
                className="group inline-flex items-center gap-1.5 sm:gap-2 rounded text-xs sm:text-base font-semibold text-text-primary transition-colors hover:text-brand-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-primary"
              >
                {HERO.secondaryCta.label}
                <ArrowUpRight
                  className="h-3.5 w-3.5 sm:h-4 sm:w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  aria-hidden="true"
                />
              </Link>
            </div>

            <dl className="mt-3 sm:mt-6 flex flex-wrap gap-x-6 gap-y-2 sm:gap-x-10 sm:gap-y-4 border-t border-border pt-2 sm:pt-4">
              {STATS.map((s) => (
                <div key={s.label} className="flex flex-col-reverse">
                  <dt className="text-[11px] sm:text-sm text-text-secondary">{s.label}</dt>
                  <dd className="font-display text-xl sm:text-3xl font-bold leading-[1.2] text-text-primary tabular-nums">
                    {s.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Right: slanted photo strips - fully visible & properly scaled on all devices */}
          <div className="relative mt-1 sm:mt-2 lg:mt-0" data-aos="fade-left" data-aos-delay="100">
            <ul className="flex h-[clamp(110px,20svh,170px)] sm:h-[260px] md:h-[340px] lg:h-[520px] items-end gap-1.5 sm:gap-2.5">
              {STRIPS.map((strip, i) => (
                <li
                  key={strip.src}
                  style={{ clipPath: SLANT }}
                  className={`group relative flex-1 overflow-hidden bg-surface transition-[flex-grow] duration-500 ease-out hover:flex-[2.2] motion-reduce:transition-none ${strip.size}`}
                >
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 opacity-60"
                    style={{
                      backgroundImage:
                        "repeating-linear-gradient(115deg, transparent 0 12px, var(--border) 12px 13px)",
                    }}
                  />
                  <Image
                    src={strip.src}
                    alt={strip.alt}
                    fill
                    priority={i === 1}
                    sizes="(min-width: 1024px) 22vw, (min-width: 640px) 28vw, 30vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105 motion-reduce:transition-none"
                  />
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/70 to-transparent"
                  />
                  <span className="absolute bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-black/60 px-2 py-0.5 sm:px-3 sm:py-1 text-[10px] sm:text-xs font-semibold text-white backdrop-blur-sm">
                    {strip.label}
                  </span>
                </li>
              ))}
            </ul>

            {/* Rotating join badge */}
            <Link
              href={HERO.primaryCta.href}
              aria-label={`${HERO.primaryCta.label}: view memberships`}
              className="absolute -left-1 bottom-1 sm:bottom-3 grid h-14 w-14 sm:h-20 sm:w-20 place-items-center rounded-full border border-border bg-background shadow-xl transition-transform hover:scale-105 lg:-left-8 lg:bottom-6 lg:h-28 lg:w-28 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-primary"
            >
              <svg
                viewBox="0 0 120 120"
                className="anim-spin absolute inset-0 h-full w-full text-text-primary"
                aria-hidden="true"
              >
                <defs>
                  <path id="hero-ring" d="M60,60 m-44,0 a44,44 0 1,1 88,0 a44,44 0 1,1 -88,0" />
                </defs>
                <text fontSize="11" fontWeight="600" fill="currentColor">
                  <textPath href="#hero-ring" textLength="268" lengthAdjust="spacing">
                    Join today • Train with us •{" "}
                  </textPath>
                </text>
              </svg>
              <span className="grid h-7 w-7 sm:h-10 sm:w-10 lg:h-12 lg:w-12 place-items-center rounded-full bg-brand-secondary text-white">
                <ArrowUpRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 lg:h-5 lg:w-5" aria-hidden="true" />
              </span>
            </Link>
          </div>
        </div>
        </div>

        {/* Marquee strip (decorative) */}
        <div
          aria-hidden="true"
          className="anim-marquee-wrap relative overflow-hidden border-y border-border bg-surface/60 py-2 sm:py-3.5"
          style={{
            maskImage: "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
            WebkitMaskImage: "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
          }}
        >
          <div className="anim-marquee flex w-max">
            {[0, 1].map((copy) => (
              <ul key={copy} className="flex shrink-0 items-center">
                {MARQUEE.map((word) => (
                  <li key={word} className="flex items-center">
                    <span
                      className="px-4 sm:px-8 font-display text-lg sm:text-2xl lg:text-3xl font-bold tracking-tight text-transparent"
                      style={{ WebkitTextStroke: "1px var(--text-secondary)" }}
                    >
                      {word}
                    </span>
                    <span className="h-2 w-2 sm:h-3 sm:w-3 shrink-0 -skew-x-12 bg-brand-primary" />
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>

        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaJson }} />
      </section>
    </HeroClient>
  );
}
