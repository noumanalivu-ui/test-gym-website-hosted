// src/components/CtaBanner.jsx
// Full-width call-to-action band. <CtaBanner title="..." description="..." cta={{label, href}} />
import Link from "next/link";

const FOCUS = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white";

export default function CtaBanner({ id = "cta-heading", title, description, cta, secondaryCta, className = "" }) {
  return (
    <section aria-labelledby={id} className={`bg-brand-secondary ${className}`}>
      <div className="sectionlayout py-14 text-center sm:py-20">
        <h2 id={id} className="mx-auto max-w-3xl font-display text-3xl font-bold leading-[1.15] tracking-tight text-white sm:text-5xl">
          {title}
        </h2>
        {description && <p className="mx-auto mt-4 max-w-xl text-base text-white/90">{description}</p>}

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {cta?.href && (
            <Link
              href={cta.href}
              className={`rounded-full bg-white px-7 py-3 text-sm font-semibold text-neutral-900 transition-opacity hover:opacity-90 sm:text-base ${FOCUS}`}
            >
              {cta.label}
            </Link>
          )}
          {secondaryCta?.href && (
            <Link
              href={secondaryCta.href}
              className={`rounded-full border border-white/70 px-7 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10 sm:text-base ${FOCUS}`}
            >
              {secondaryCta.label}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}