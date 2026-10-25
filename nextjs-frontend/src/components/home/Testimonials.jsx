import Image from "next/image"; 
import { SITE_NAME, SITE_URL, SITE_LOGO_URL } from "../../data/siteInfo";
import TestimonialsClient from "./TestimonialsClient";


const REVIEWS = [
  {
    id: 1,
    name: 'Sarah Jenkins',
    rating: 5,
    comment:
      'In 6 months my body fat dropped from 23% to 11.4%. The macro adjustments and progressive overload plan completely redefined my physique, posture, and core strength.',
    avatar: '/testimonial/1.webp',
  },
  {
    id: 2,
    name: 'Alex Rivera',
    rating: 5,
    comment:
      'The single best coaching decision I have ever made. Gained 8 lbs of lean muscle tissue while setting lifetime personal records on both my incline press and deadlift.',
    avatar: '/testimonial/2.webp',
  },
  {
    id: 3,
    name: 'Elena Gomez',
    rating: 5,
    comment:
      'The periodized programming kept me 100% focused and accountable. Saw dramatic abdominal and shoulder definition within the first 12 weeks of training!',
    avatar: '/testimonial/3.webp',
  },
  {
    id: 4,
    name: 'Marcus Vance',
    rating: 5,
    comment:
      'Structured periodization, precise RPE guidance, and weekly check-ins took my athletic conditioning to elite levels without burning out or stalling.',
    avatar: '/testimonial/4.webp',
  },
];

const BODYBUILDER_IMG = '/testimonial/bodybuilder.webp';


const buildSchema = (reviews = []) => {
  const total = reviews?.length ?? 0;
  const average =
    total > 0
      ? reviews.reduce((sum, r) => sum + (r?.rating ?? 0), 0) / total
      : 0;
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: SITE_NAME,
    url: SITE_URL,
    logo: SITE_LOGO_URL,
    ...(total > 0 && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: average.toFixed(1),
        bestRating: "5",
        worstRating: "1",
        reviewCount: String(total),
      },
      review: reviews.map((r) => ({
        "@type": "Review",
        author: { "@type": "Person", name: r?.name },
        reviewBody: r?.comment,
        reviewRating: {
          "@type": "Rating",
          ratingValue: String(r?.rating ?? 5),
          bestRating: "5",
          worstRating: "1",
        },
      })),
    }),
  };
};

export default function Testimonials() {
  const schema = JSON.stringify(buildSchema(REVIEWS)).replace(/</g, "\\u003c");

  return (
    <section
      id="testimonials"
      aria-labelledby="testimonials-heading"
      className="sectionlayout relative overflow-hidden !py-16 md:py-24"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: schema }}
      />

      <header className="text-center mb-10 sm:mb-12 relative z-10">
        <p className="mb-2 text-xs font-mono uppercase tracking-widest text-muted">
          Member Transformations
        </p>
        <h2 
          id="testimonials-heading" 
          className="font-display text-4xl sm:text-5xl md:text-6xl font-bold uppercase tracking-tight text-text-primary flex items-center justify-center gap-2"
        >
          <span>Client&apos;s</span>
          <span className="text-brand-primary">Reviews</span>
        </h2>
      </header>

      <div className="w-full">
        <TestimonialsClient reviews={REVIEWS}>
          {/* Server-rendered image passed as children: zero extra client JS */}
          <Image
            src={BODYBUILDER_IMG}
            alt=""
            aria-hidden="true"
            width={940}
            height={940}
            sizes="(min-width: 768px) 470px, (min-width: 640px) 420px, 340px"
            className="w-full h-auto -mt-2 sm:-mt-3 contrast-105 drop-shadow-[0_20px_40px_rgba(0,0,0,0.6)] pointer-events-none"
          />
        </TestimonialsClient>
      </div>
    </section>
  );
}
