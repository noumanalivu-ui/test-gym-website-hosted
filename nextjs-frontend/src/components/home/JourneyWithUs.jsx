import Image from "next/image";
import Link from "next/link";
import { ShieldCheck, HeartHandshake, UserCheck, Check, ScanHeart, ArrowRight } from "lucide-react";
import { whatsappMessage1, whatsAppNumber } from "../../data/siteInfo";

const PILLARS = [
  {
    icon: HeartHandshake,
    title: "Open Door Policy",
    description:
      "We believe in providing unrestricted access to all individuals, regardless of their fitness level, age, or background. Zero ego, pure performance.",
  },
  {
    icon: ShieldCheck,
    title: "Fully Insured",
    description:
      "Your peace of mind is our top priority, and our commitment to your safety extends to every aspect of your fitness journey with certified first responders on deck.",
  },
  {
    icon: UserCheck,
    title: "Personal Trainer",
    description:
      "With personalized workout plans tailored to your needs, we will ensure that you get the most out of your gym experience through calibrated progressive overload.",
  },
];

export default function JourneyWithUs() {
  return (
    <section
      id="about"
      aria-labelledby="journey-heading"
      className="bg-background border-t border-border py-16 md:py-24 overflow-hidden"
    >
      <div className="sectionlayout space-y-20 lg:space-y-28">
        {/* PART 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          <div className="lg:col-span-7 space-y-6" data-aos="fade-right">
            <header className="space-y-3">
              <h2
                id="journey-heading"
                className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-text-primary leading-[1.1]"
              >
                Start Your Fitness{" "}
                <span className="text-brand-primary">Journey With Us</span>
              </h2>

              <p className="text-base sm:text-lg text-text-secondary leading-relaxed max-w-2xl">
                Whether you are stepping into a weight room for the very first time or
                preparing for competitive athletics, our scientifically backed training
                architecture and attentive coaching ensure measurable progress every week.
              </p>
            </header>

            <ul className="space-y-3 pt-1 text-sm text-text-secondary">
              <li className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-brand-primary/10 border border-brand-primary/30 flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5 text-brand-primary stroke-[3]" aria-hidden="true" />
                </div>
                <span>Complimentary 1-on-1 biomechanical screening on your first visit</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-brand-primary/10 border border-brand-primary/30 flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5 text-brand-primary stroke-[3]" aria-hidden="true" />
                </div>
                <span>Periodized progression plans designed for both beginners and elite lifters</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-brand-primary/10 border border-brand-primary/30 flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5 text-brand-primary stroke-[3]" aria-hidden="true" />
                </div>
                <span>Unrestricted access to Olympic platforms, turf sprint lanes, and recovery suites</span>
              </li>
              <li>
                <Link
                  href="/#fitness-calculators"
                  className="group flex items-center gap-3 rounded-md transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-primary"
                >
                  <span
                    className="w-5 h-5 rounded-full bg-brand-primary/10 border border-brand-primary/30 flex items-center justify-center shrink-0"
                    aria-hidden="true"
                  >
                    <ScanHeart className="w-3 h-3 text-brand-primary stroke-[2.5]" />
                  </span>

                  <span className="font-medium text-text-primary group-hover:text-brand-primary transition-colors">
                    Calculate BMI, BMR, TDEE{" "}
                    <span className="font-normal text-text-secondary">(Know your fitness level)</span>
                  </span>

                  <ArrowRight
                    className="w-4 h-4 shrink-0 text-brand-primary transition-transform duration-300 motion-reduce:transition-none group-hover:translate-x-1 motion-reduce:group-hover:translate-x-0"
                    aria-hidden="true"
                  />
                </Link>
              </li>

            </ul>

            <div className="pt-2">
              <Link
                href={`https://wa.me/${whatsAppNumber}?text=${whatsappMessage1}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
                aria-label="Join our gym community today"
              >
                Join Now
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5 relative flex justify-center" data-aos="fade-left" data-aos-delay="100">
            <div className="relative w-full max-w-md aspect-[3/4] rounded-2xl overflow-hidden border border-border bg-surface shadow-2xl">
              <Image
                src="/journey_female_athlete.webp"
                alt="Certified athletic trainer at AURA Athletic Club holding shaker bottle and towel"
                fill
                quality={85}
                sizes="(min-width: 1024px) 35vw, 90vw"
                className="object-cover object-top hover:scale-102 transition-transform duration-500"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-linear-to-t from-background/90 via-transparent to-transparent pointer-events-none"
              />
              <div className="absolute bottom-5 left-5 right-5 p-4 rounded-xl bg-surface/90 backdrop-blur-md border border-border">
                <p className="text-xs font-mono tracking-wider text-brand-primary font-semibold">
                  Dedicated Athletic Guidance
                </p>
                <p className="text-sm font-medium text-text-primary mt-0.5">
                  1-on-1 technique corrections &amp; programmed progressive overload.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* PART 2 */}
        <div className="pt-10 border-t border-border grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          <div className="lg:col-span-5 relative order-2 lg:order-1 flex justify-center items-center" data-aos="fade-right" data-aos-delay="100">
            <div
              aria-hidden="true"
              className="absolute top-1/2 -translate-y-1/2 right-4 sm:right-10 w-48 h-48 opacity-25 pointer-events-none"
              style={{
                backgroundImage: "radial-gradient(var(--text-secondary) 2px, transparent 2px)",
                backgroundSize: "16px 16px",
              }}
            />

            <div className="relative z-10 w-full max-w-[360px] sm:max-w-[400px] aspect-[4/5] flex items-center justify-center">
              <Image
                src="/our_story_runner.webp"
                alt="Athletic track sprinter in starting block stance ready for training"
                fill
                priority
                quality={95}
                sizes="(min-width: 1024px) 35vw, 90vw"
                className="object-contain object-bottom drop-shadow-[0_20px_40px_rgba(0,0,0,0.6)] transition-transform duration-500 hover:scale-103"
              />
            </div>
          </div>

          <div className="lg:col-span-7 order-1 lg:order-2 space-y-6" data-aos="fade-left">
            <div>
              <h3 className="font-display text-3xl sm:text-4xl font-bold text-text-primary tracking-tight">
                Our Story &amp; Principles
              </h3>
              <div className="w-14 h-1.5 bg-brand-primary mt-2 rounded-full" aria-hidden="true" />
            </div>

            <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
              Led by our team of expert and motivational instructors, every training session
              is a high-energy, results-driven discipline combining an exact blend of
              functional resistance, cardiovascular conditioning, and biomechanical precision.
            </p>

            <div className="space-y-6 pt-2">
              {PILLARS.map((pillar) => {
                const Icon = pillar.icon;
                return (
                  <article key={pillar.title} className="flex items-start gap-4 sm:gap-5 group">
                    <div
                      className="shrink-0 w-12 h-12 rounded-full border-2 border-brand-primary/80 bg-brand-primary/5 flex items-center justify-center transition-colors group-hover:bg-brand-primary/10 group-hover:border-brand-primary"
                      aria-hidden="true"
                    >
                      <Icon className="w-5 h-5 text-brand-primary stroke-[2.2]" />
                    </div>

                    <div className="space-y-1">
                      <h4 className="text-base sm:text-lg font-bold text-text-primary tracking-tight">
                        {pillar.title}
                      </h4>
                      <p className="text-sm text-text-secondary leading-relaxed">
                        {pillar.description}
                      </p>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}