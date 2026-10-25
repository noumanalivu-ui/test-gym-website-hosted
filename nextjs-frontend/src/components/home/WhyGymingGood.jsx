import Link from "next/link";
import { SITE_NAME, SITE_URL, whatsAppNumber, whatsappMessage1 } from "../../data/siteInfo";
import WhyGymingGoodCSSlider from "./WhyGymingGoodCSSlider";

const HEADING = "Why Gyming Is Good For Health";
const DESCRIPTION =
  "Regular strength and cardio training builds muscle, strengthens bones, supports heart health and improves mood. Join a class and see what consistent training changes.";

const schema = {
  "@context": "https://schema.org",
  "@type": "WebPageElement",
  "@id": `${SITE_URL}/#why-gyming`,
  name: HEADING,
  description: DESCRIPTION,
  isPartOf: { "@type": "WebSite", name: SITE_NAME, url: SITE_URL },
  about: { "@type": "Thing", name: "Health benefits of regular gym training" },
  potentialAction: {
    "@type": "JoinAction",
    name: "Join Classes",
    target: `${SITE_URL}/#membership`,
  },
};

const schemaJson = JSON.stringify(schema).replace(/</g, "\\u003c");

const WHATSAPP_JOIN_URL = `https://wa.me/${whatsAppNumber}?text=${encodeURIComponent(
  whatsappMessage1 ?? `Hello ${SITE_NAME}, I want to join your classes. Please share the next steps.`
)}`;

// Server component. Only the slider ships client JS (tiny, no state).
const WhyGymingGood = () => {
  return (
    <section
      id="why-gyming"
      aria-labelledby="why-gyming-heading"
      className="py-10"
    >
      <div className="sectionlayout grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <header>
          <h2
            id="why-gyming-heading"
            className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-[0.95] text-brand-primary"
          >
            {HEADING}
          </h2>

          <p className="mt-5 max-w-lg text-base leading-relaxed text-text-secondary">
            {DESCRIPTION}
          </p>

          <div className="mt-8 flex flex-col items-start gap-3">
            <a
              href={WHATSAPP_JOIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
            >
              Join Classes
              <span className="sr-only"> (opens WhatsApp in a new tab)</span>
            </a>

            <Link
              href="/#membership"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-text-primary transition-colors hover:text-brand-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary"
            >
              or compare membership prices
            </Link>
          </div>
        </header>

        <div className="mx-auto w-full max-w-md lg:mx-0 lg:justify-self-end">
          <WhyGymingGoodCSSlider
            beforeSrc="/before.webp"
            afterSrc="/after.webp"
            beforeAlt="Athlete's physique before consistent gym training"
            afterAlt="Same athlete's physique after consistent gym training"
          />
        </div>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: schemaJson }}
      />
    </section>
  );
};

export default WhyGymingGood;