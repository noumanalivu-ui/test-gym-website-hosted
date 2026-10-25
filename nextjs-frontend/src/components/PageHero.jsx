import Link from "next/link";
import { ChevronRight } from "lucide-react";
import Breadcrumb from "./Breadcrumb";

/*
  Reusable hero for inner pages (server component).

  <PageHero
    headingId="contact-heading"
    breadcrumbItems={[{ label: "Contact", href: "/contact" }]}
    title="Your First Rep"
    highlight="Starts Here"                 // optional accent line (second line)
    description="Short intro text"
    primaryCta={{ label: "Book now", href: "#book" }}
    secondaryCta={{ label: "WhatsApp", href: "https://wa.me/...", external: true }}
    badges={[{ Icon: Clock, label: "Quick replies" }]}
    align="center"                          // "center" | "left"
    paddingClassName="pt-40 pb-12"          // swap for pages without a fixed navbar
    className=""                            // extra classes on the <section>
    contentClassName=""                     // extra classes on the inner wrapper
    glow                                    // soft brand glow behind the heading
  >
    {extra content, e.g. a search box, stats, tabs...}
  </PageHero>
*/

const PRIMARY =
  "inline-flex items-center justify-center rounded-full bg-brand-secondary px-7 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 sm:text-base";
const SECONDARY =
  "inline-flex items-center justify-center gap-1.5 rounded-full border border-border bg-surface px-6 py-3 text-sm font-semibold text-text-primary transition-colors hover:bg-surface-hover sm:text-base";
const FOCUS =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary";

const HeroCta = ({ cta, variant }) => {
  if (!cta?.href || !cta?.label) return null;

  const isPrimary = variant === "primary";
  const className = `${isPrimary ? PRIMARY : SECONDARY} ${FOCUS}`;
  const content = (
    <>
      {cta.label}
      {!isPrimary && <ChevronRight className="h-4 w-4" aria-hidden="true" />}
      {cta.external && <span className="sr-only"> (opens in a new tab)</span>}
    </>
  );

  if (cta.href.startsWith("/") && !cta.external) {
    return (
      <Link href={cta.href} className={className}>
        {content}
      </Link>
    );
  }

  return (
    <a
      href={cta.href}
      {...(cta.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={className}
    >
      {content}
    </a>
  );
};

export default function PageHero({
  headingId = "page-hero-heading",
  breadcrumbItems = [],
  title,
  highlight,
  description,
  primaryCta,
  secondaryCta,
  badges = [],
  align = "center",
  paddingClassName = "pt-40 pb-12",
  className = "",
  contentClassName = "",
  glow = true,
  children,
}) {
  const isCenter = align !== "left";
  const justify = isCenter ? "justify-center" : "justify-start";

  return (
    <section
      aria-labelledby={headingId}
      className={`relative overflow-hidden ${paddingClassName} ${className}`}
    >
      {glow && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background: 
              "radial-gradient(60% 55% at 50% 0%, color-mix(in srgb, var(--brand-primary) 14%, transparent), transparent 70%)",
          }}
        />
      )}

      <div className="sectionlayout relative">
        <div
          className={`flex flex-col ${
            isCenter ? "mx-auto max-w-4xl items-center text-center" : "max-w-3xl items-start text-left"
          } ${contentClassName}`}
        >
          {breadcrumbItems?.length > 0 && (
            <Breadcrumb
              items={breadcrumbItems}
              cssClassName={isCenter ? "justify-center" : "justify-start"}
            />
          )}

          <h1
            id={headingId}
            className="font-display text-5xl font-bold leading-[1.1] tracking-tight text-text-primary sm:text-6xl lg:text-7xl"
          >
            {title}
            {highlight && <span className="block text-brand-primary">{highlight}</span>}
          </h1>

          {description && (
            <p className="mt-6 max-w-3xl text-base leading-relaxed text-text-secondary sm:text-lg">
              {description}
            </p>
          )}

          {(primaryCta || secondaryCta) && (
            <div className={`mt-8 flex flex-wrap gap-3 ${justify}`}>
              <HeroCta cta={primaryCta} variant="primary" />
              <HeroCta cta={secondaryCta} variant="secondary" />
            </div>
          )}

          {badges?.length > 0 && (
            <ul
              className={`mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-text-secondary ${justify}`}
            >
              {badges.map(({ Icon, label }) => (
                <li key={label} className="flex items-center gap-2">
                  {Icon && <Icon className="h-4 w-4 text-brand-primary" aria-hidden="true" />}
                  {label}
                </li>
              ))}
            </ul>
          )}

          {children}
        </div>
      </div>
    </section>
  );
}