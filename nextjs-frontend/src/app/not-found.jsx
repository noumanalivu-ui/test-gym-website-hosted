// src/app/not-found.jsx  (server component, no client JS)
import Link from "next/link";
import { ArrowUpRight, Home, Dumbbell, Phone, Users } from "lucide-react";
import { SITE_NAME } from "../data/siteInfo";

export const metadata = {
  title: `Page Not Found | ${SITE_NAME}`,
  description: "This page skipped a rep. Head back to the gym floor and find what you need.",
  robots: { index: false, follow: true },
};

const HELPFUL_LINKS = [
  { label: "Home", href: "/", Icon: Home },
  { label: "Services", href: "/#services", Icon: Dumbbell },
  { label: "About", href: "/about", Icon: Users },
  { label: "Contact", href: "/contact", Icon: Phone },
];

const outline = { WebkitTextStroke: "2px var(--text-secondary)" };

export default function NotFound() {
  return (
    <main
      id="main-content"
      className="relative flex min-h-[75svh] items-center overflow-hidden"
    >
      {/* Background: brand glow + faint diagonal texture (decorative) */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(50% 55% at 50% 38%, color-mix(in srgb, var(--brand-primary) 14%, transparent), transparent 70%)",
          }}
        />
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "repeating-linear-gradient(115deg, transparent 0 26px, var(--border) 26px 27px)",
            maskImage: "radial-gradient(60% 70% at 50% 40%, black, transparent 75%)",
            WebkitMaskImage: "radial-gradient(60% 70% at 50% 40%, black, transparent 75%)",
          }}
        />
      </div>

      <section
        aria-labelledby="not-found-heading"
        className="sectionlayout relative w-full py-12! text-center sm:py-20!"
      >
        {/* 4 [weight plate] 4 */}
        <p
          aria-hidden="true"
          className="flex items-center justify-center gap-1 font-display text-[clamp(6rem,28vw,12rem)] font-black leading-none tracking-tight text-transparent sm:gap-3"
        >
          <span style={outline}>4</span>
          <svg
            viewBox="0 0 100 100"
            className="h-[0.78em] w-[0.78em] text-brand-primary motion-safe:animate-[spin_14s_linear_infinite]"
          >
            <circle cx="50" cy="50" r="48" fill="currentColor" />
            <circle cx="50" cy="50" r="38" fill="none" stroke="var(--background)" strokeWidth="2.5" opacity="0.55" />
            <circle cx="50" cy="50" r="27" fill="none" stroke="var(--background)" strokeWidth="2.5" opacity="0.35" />
            <path
              d="M50 6v12M50 82v12M6 50h12M82 50h12"
              stroke="var(--background)"
              strokeWidth="5"
              strokeLinecap="round"
              opacity="0.6"
            />
            <circle cx="50" cy="50" r="11" fill="var(--background)" />
          </svg>
          <span style={outline}>4</span>
        </p>

        <h1
          id="not-found-heading"
          className="mt-4 font-display text-3xl font-bold tracking-tight text-text-primary sm:mt-6 sm:text-5xl"
        >
          Missed rep.
          <span className="block text-brand-primary">This page isn&rsquo;t on the floor.</span>
        </h1>

        <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-text-secondary sm:text-base">
          <span className="sr-only">Error 404. </span>
          The page you&rsquo;re looking for was moved, renamed, or never made it past warm-up. Let&rsquo;s get you back to training.
        </p>

        <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center sm:gap-5">
          <Link href="/" className="btn btn-primary">
            Back to Home
          </Link>
          <Link
            href="/contact#book-session"
            className="group inline-flex items-center justify-center gap-1.5 rounded py-2 font-semibold text-text-primary transition-colors hover:text-brand-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-primary"
          >
            Book a free assessment
            <ArrowUpRight
              className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 motion-reduce:transition-none"
              aria-hidden="true"
            />
          </Link>
        </div>

        <nav aria-label="Helpful links" className="mx-auto mt-10 max-w-xl sm:mt-14">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-text-secondary">
            Or jump to
          </p>
          <ul className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-4 sm:gap-3">
            {HELPFUL_LINKS.map(({ label, href, Icon }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="group flex items-center justify-center gap-2 rounded-xl border border-border bg-surface px-3 py-3 text-sm font-semibold text-text-primary transition-colors duration-200 hover:border-brand-primary hover:bg-surface-hover active:scale-[0.97] motion-reduce:transition-none motion-reduce:active:scale-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary"
                >
                  <Icon className="h-4 w-4 text-brand-primary" aria-hidden="true" />
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </section>
    </main>
  );
}