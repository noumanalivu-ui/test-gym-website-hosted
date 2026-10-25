// src/components/home/Services.jsx  (server component, no client JS)
import Link from "next/link";
import {
  ArrowUpRight,
  Target,
  Users,
  Dumbbell,
  Flame,
  TrendingUp,
  Footprints,
  Flower2,
  Zap,
} from "lucide-react";
import SectionHeading from "../SectionHeading";
import { WhatsAppIcon } from "../../utils/icons";
import {
  SITE_NAME,
  SITE_URL,
  whatsAppNumber,
  whatsappMessage1,
} from "../../data/siteInfo";

/* =========================================
   EDITABLE CONTENT
========================================= */
const SERVICES = [
  {
    id: "personal-training",
    title: "Personal Training",
    text: "One-on-one coaching built around your goals, your schedule and your pace.",
    goal: "Overall fitness",
    Icon: Target,
    cta: { label: "Join now", href: "/#membership" },
  },
  {
    id: "group-training",
    title: "Group Training",
    text: "High-energy classes where the whole room pushes you to one more rep.",
    goal: "Motivation",
    Icon: Users,
    cta: { label: "Join now", href: "/#membership" },
  },
  {
    id: "strength-weightlifting",
    title: "Strength & Weightlifting",
    text: "Progressive lifting with proper form, from first barbell to personal bests.",
    goal: "Power & muscle",
    Icon: Dumbbell,
    cta: { label: "Join now", href: "/#membership" },
  },
  {
    id: "fat-loss",
    title: "Fat Loss",
    text: "A coached mix of training and simple nutrition to lose fat and keep it off.",
    goal: "Lean & toned",
    Icon: Flame,
    cta: { label: "Try the calculators", href: "/#fitness-calculators" },
  },
  {
    id: "weight-gain",
    title: "Weight Gain",
    text: "Structured lifting and meal guidance to build size the healthy way.",
    goal: "Build mass",
    Icon: TrendingUp,
    cta: { label: "Try the calculators", href: "/#fitness-calculators" },
  },
  {
    id: "cardio-running",
    title: "Cardio & Running",
    text: "Treadmills, bikes, rowers and run programs to build stamina your way.",
    goal: "Stamina",
    Icon: Footprints,
    cta: { label: "Join now", href: "/#membership" },
  },
  {
    id: "yoga-mobility",
    title: "Yoga & Mobility",
    text: "Stretch, recover and move better so every other session feels easier.",
    goal: "Recovery",
    Icon: Flower2,
    cta: { label: "Join now", href: "/#membership" },
  },
  {
    id: "hiit-conditioning",
    title: "HIIT & Conditioning",
    text: "Short, explosive circuits that torch calories and sharpen your athleticism.",
    goal: "Burn & speed",
    Icon: Zap,
    cta: { label: "Join now", href: "/#membership" },
  },
];

const WHATSAPP_HREF = `https://wa.me/${whatsAppNumber}?text=${whatsappMessage1}`;

/* =========================================
   SCHEMA
========================================= */
const schema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  "@id": `${SITE_URL}/#services-list`,
  name: `${SITE_NAME} Services`,
  itemListElement: SERVICES.map((s, i) => ({
    "@type": "ListItem",
    position: i + 1,
    item: {
      "@type": "Service",
      name: s?.title,
      serviceType: s?.title,
      description: s?.text,
      url: `${SITE_URL}${s?.cta?.href}`,
      provider: { "@id": `${SITE_URL}/#organization` },
    },
  })),
};
const schemaJson = JSON.stringify(schema).replace(/</g, "\\u003c");

export default function Services() {
  return (
    <section
      id="services"
      aria-labelledby="services-heading"
      className="scroll-mt-20 py-14 sm:py-24"
    >
      <div className="sectionlayout">
        <div data-aos="fade-up">
          <SectionHeading
            id="services-heading"
            title="Explore Our"
            highlight="Facilities & Services"
            description="From coached strength sessions to high-intensity circuits and recovery suites. Browse everything we offer, then pick what fits your week."
            align="center"
          />
        </div>

        <ul
          className="mt-8 grid grid-cols-1 gap-3 sm:mt-14 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4"
          data-aos="fade-up"
          data-aos-delay="100"
        >
          {SERVICES.map(({ id, title, text, goal, Icon, cta }) => (
            <li key={id} className="h-full">
              {/* The whole card is the link */}
              <Link
                href={cta?.href}
                aria-labelledby={`service-${id}-title`}
                aria-describedby={`service-${id}-text`}
                className="
                  group section-bg flex h-full flex-col rounded-2xl p-4 sm:p-6
                  transition-all duration-300 ease-out
                  hover:-translate-y-1 hover:border-brand-primary
                  active:scale-[0.98]
                  motion-reduce:transition-none motion-reduce:hover:translate-y-0 motion-reduce:active:scale-100
                  focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary
                "
              >
                {/* Row: icon + title + arrow */}
                <div className="flex items-center gap-3.5">
                  <Icon
                    className="h-7 w-7 shrink-0 text-brand-primary sm:h-8 sm:w-8"
                    strokeWidth={1.7}
                    aria-hidden="true"
                  />

                  <h3
                    id={`service-${id}-title`}
                    className="min-w-0 flex-1 font-display text-lg font-bold leading-tight tracking-tight text-text-primary sm:text-xl"
                  >
                    {title}
                  </h3>

                  <span
                    aria-hidden="true"
                    className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-border text-text-secondary transition-colors duration-300 group-hover:border-brand-primary group-hover:bg-brand-primary group-hover:text-white group-active:border-brand-primary group-active:bg-brand-primary group-active:text-white"
                  >
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                </div>

                <p
                  id={`service-${id}-text`}
                  className="mt-3.5 text-sm leading-relaxed text-text-secondary"
                >
                  {text}
                </p>

                <div className="mt-auto flex flex-wrap items-center justify-between gap-x-3 gap-y-2 pt-4">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-2.5 py-1 text-[11px] font-medium text-text-secondary">
                    <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-brand-primary" />
                    <span className="sr-only">Best for: </span>
                    {goal}
                  </span>

                  <span className="text-xs font-semibold text-text-primary transition-colors group-hover:text-brand-primary">
                    {cta?.label}
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>

        {/* Conversion block */}
        <div
          className="mt-10 flex flex-col items-center gap-4 text-center sm:mt-16 sm:gap-5"
          data-aos="fade-up"
        >
          <p className="font-display text-xl font-bold tracking-tight text-text-primary sm:text-2xl">
            Not sure which one fits you best?
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
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-surface px-6 py-3 text-base font-semibold text-text-primary transition-colors hover:border-[#25D366] hover:bg-surface-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary"
            >
              <WhatsAppIcon className="h-5 w-5 text-[#25D366]" aria-hidden="true" />
              Quick Chat
            </a>
          </div>
        </div>
      </div>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaJson }} />
    </section>
  );
}