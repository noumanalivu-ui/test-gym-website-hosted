import Image from "next/image";
import Link from "next/link";
import { bodyParts } from "../../data/bodyParts";
import { SITE_NAME, SITE_URL } from "../../data/siteInfo";

const schema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: `Gym Exercises by ${SITE_NAME}`,
  description:
    "Explore calibrated biomechanical exercises and movement kinematics categorized by body part.",
  numberOfItems: bodyParts?.length ?? 0,
  itemListElement:
    bodyParts?.map((part, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: `${part?.label} Exercises`,
      url: `${SITE_URL}/exercises/${part?.slug}`,
    })) ?? [],
};

// Prevent JSON breakout inside application/ld+json
const schemaJson = JSON.stringify(schema).replace(/</g, "\\u003c");

// Server component: zero client JS shipped for this section.
export default function Exercises() {
  return (
    <section
      id="exercises"
      aria-labelledby="exercises-heading"
      className="bg-background border-t border-border py-16 md:py-24"
    >
      {/* sectionlayout = global.css alignment. Vertical spacing lives on <section>
          because unlayered .sectionlayout padding would override Tailwind py-* utilities. */}
      <div className="sectionlayout">
        <header className="mb-10 md:mb-14 max-w-2xl">
          <p className="mb-3 text-xs font-mono uppercase tracking-widest text-muted">
            Kinematic Library
            <span aria-hidden="true" className="mx-2 text-border">/</span>
            <span className="font-semibold text-brand-primary">
              {bodyParts?.length ?? 0} Disciplines
            </span>
          </p>

          <h2
            id="exercises-heading"
            className="font-display text-4xl sm:text-5xl md:text-6xl font-bold uppercase leading-[0.95] text-text-primary"
          >
            Exercises
          </h2>

          <p className="mt-4 max-w-xl text-sm sm:text-base leading-relaxed text-text-secondary">
            Select a muscle group to inspect movement kinematics, target muscle
            fiber alignment, prescribed cadences, and calibrated equipment.
          </p>
        </header>

        <ul
          role="list"
          className="grid grid-cols-2 gap-3.5 sm:gap-5 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
        >
          {bodyParts?.map((part, index) => (
            <li key={part?.slug}>
              <Link
                href={`/exercises/${part?.slug}`}
                className="group relative flex aspect-[3/4] sm:aspect-[4/5] flex-col justify-end overflow-hidden rounded-2xl border border-border bg-surface
                           transition-colors duration-200 hover:border-brand-primary/50
                           focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-primary"
              >
                <Image
                  src={`/body-parts/${part?.slug}.webp`}
                  alt={`${part?.label} exercise technique`}
                  fill
                  quality={70}
                  loading="lazy"
                  sizes="(min-width: 1280px) 20vw, (min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
                  className="object-cover object-center transition-transform duration-300 ease-out group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                />

                {/* Static scrim keeps white label at 4.5:1+ on any photo */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/90 via-black/30 to-transparent"
                />

                {/* Index number (decorative: the list already conveys order) */}
                <span
                  aria-hidden="true"
                  className="absolute left-4 top-4 z-10 rounded-full border border-white/10 bg-black/60 px-2 py-0.5 font-mono text-[10px] font-semibold tracking-wider text-white/80"
                >
                  {String(index + 1).padStart(2, "0")}
                </span>

                <h3 className="relative z-10 p-4 sm:p-5 text-center font-sans text-xl sm:text-2xl font-bold capitalize text-white transition-colors duration-200 group-hover:text-brand-tertiary">
                  {part?.label}
                  <span className="sr-only"> exercises</span>
                </h3>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: schemaJson }}
      />
    </section>
  );
}