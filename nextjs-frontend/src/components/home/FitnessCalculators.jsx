import { SITE_NAME, SITE_URL } from "../../data/siteInfo";
import FitnessCalculatorsClient from "./FitnessCalculatorsClient";

const schema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "@id": `${SITE_URL}/#fitness-calculators`,
  name: `Fitness Calculators by ${SITE_NAME}`,
  url: SITE_URL,
  applicationCategory: "HealthApplication",
  operatingSystem: "All",
  browserRequirements: "Requires JavaScript",
  isAccessibleForFree: true,
  inLanguage: "en",
  description:
    "Free BMI, BMR, TDEE, body fat and ideal weight calculators with daily calorie needs by activity level, to track fitness and plan nutrition.",
  featureList: [
    "BMI calculator with healthy weight range",
    "BMR calculator (Mifflin-St Jeor, Harris-Benedict, Katch-McArdle)",
    "TDEE calculator with daily calorie needs by activity level",
    "Body fat calculator (U.S. Navy method)",
    "Ideal weight calculator",
  ],
  provider: {
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
  },
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
};

const schemaJson = JSON.stringify(schema).replace(/</g, "\\u003c");

export default function FitnessCalculators() {
  return (
    <section
      id="fitness-calculators"
      aria-labelledby="fitness-calculators-heading"
      className="py-10"
    >
      <div className="sectionlayout">
        <FitnessCalculatorsClient />
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: schemaJson }}
      />
    </section>
  );
}