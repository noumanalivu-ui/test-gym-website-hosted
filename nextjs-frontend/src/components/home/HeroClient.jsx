"use client";

import { useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

const clamp01 = (n) => Math.min(1, Math.max(0, n));

const MOBILE_FONT = { fontFamily: "var(--font-display-family)", fontWeight: 900, fontSize: "min(15.5vw, 62px)", letterSpacing: "0.02em" };
const DESKTOP_FONT = { fontFamily: "var(--font-display-family)", fontWeight: 900, fontSize: "min(7.8vw, 130px)", letterSpacing: "0.02em" };

// Both variants are in the HTML; CSS picks one, so there is no flash after hydration
const MaskText = (props) => (
  <>
    <text textAnchor="middle" dominantBaseline="central" className="md:hidden" style={MOBILE_FONT} {...props}>
      <tspan x="50%" y="38%" dy="-0.58em">Let&apos;s</tspan>
      <tspan x="50%" y="38%" dy="0.58em">Workout</tspan>
    </text>
    <text x="50%" y="50%" textAnchor="middle" dominantBaseline="central" className="hidden md:inline" style={DESKTOP_FONT} {...props}>
      Let&apos;s Workout
    </text>
  </>
);

export default function HeroClient({ children, scrollDistance = 280, maxScale = 55 }) {
  const containerRef = useRef(null);
  const stageRef = useRef(null);
  const heroRef = useRef(null);
  const maskRef = useRef(null);
  const maskGroupRef = useRef(null);
  const strokeGroupRef = useRef(null);
  const cueRef = useRef(null);

  useEffect(() => {
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches) return;

    let top = 0;
    let total = 0;
    let stickyTop = 0;
    let raf = 0;

    // Writes only. No layout reads happen here.
    const apply = () => {
      raf = 0;
      if (total <= 0) return;
      const p = clamp01((window.scrollY + stickyTop - top) / total);
      const reveal = clamp01(p / 0.36);
      const scale = 1 + Math.pow(reveal, 2.2) * maxScale;

      let maskOpacity = reveal > 0.7 ? Math.max(0, 1 - (reveal - 0.7) / 0.3) : 1;
      if (reveal >= 1) maskOpacity = 0;
      const cue = Math.max(0, 1 - p * 10);
      const stroke = Math.max(0, 0.8 - reveal * 2.8);

      const mask = maskRef.current;
      if (mask) {
        mask.style.opacity = String(maskOpacity);
        mask.style.visibility = maskOpacity <= 0.001 ? "hidden" : "visible";
      }
      if (maskGroupRef.current) maskGroupRef.current.style.transform = `scale(${scale})`;
      if (strokeGroupRef.current) {
        strokeGroupRef.current.style.transform = `scale(${scale})`;
        strokeGroupRef.current.style.opacity = String(stroke);
      }
      if (heroRef.current) heroRef.current.style.transform = `scale(${0.98 + reveal * 0.02})`;
      if (cueRef.current) {
        cueRef.current.style.opacity = String(cue);
        cueRef.current.style.transform = `translate(-50%, ${p * 20}px)`;
      }
    };

    // Reads happen once here (mount, resize, load), never during scroll
    const measure = () => {
      const c = containerRef.current;
      const s = stageRef.current;
      if (!c || !s) return;
      top = c.getBoundingClientRect().top + window.scrollY;
      total = c.offsetHeight - s.offsetHeight;
      stickyTop = parseFloat(getComputedStyle(s).top) || 0;
      apply();
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(apply);
    };

    const first = requestAnimationFrame(measure);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", measure, { passive: true });
    window.addEventListener("load", measure);

    return () => {
      cancelAnimationFrame(first);
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", measure);
      window.removeEventListener("load", measure);
    };
  }, [maxScale]);

  return (
    <div
      ref={containerRef}
      style={{ "--hero-h": `${scrollDistance}vh` }}
      className="relative h-(--hero-h) w-full motion-reduce:h-auto"
    >
      <div
        ref={stageRef}
        className="sticky top-16 flex h-[calc(100svh-4rem)] w-full flex-col overflow-hidden bg-background motion-reduce:static motion-reduce:h-auto motion-reduce:overflow-visible"
      >
        <div ref={heroRef} className="relative flex h-full w-full origin-center flex-col overflow-hidden">
          {children}
        </div>

        <div
          ref={maskRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-40 select-none overflow-hidden motion-reduce:hidden"
        >
          <svg className="absolute inset-0 h-full w-full">
            <defs>
              <mask id="workout-text-mask">
                <rect width="100%" height="100%" fill="white" />
                <g ref={maskGroupRef} className="origin-center [transform-box:fill-box]">
                  <MaskText fill="black" />
                </g>
              </mask>
            </defs>
            <rect width="100%" height="100%" fill="var(--background)" mask="url(#workout-text-mask)" />
            <g
              ref={strokeGroupRef}
              style={{ opacity: 0.8 }}
              className="origin-center [transform-box:fill-box]"
            >
              <MaskText fill="none" stroke="var(--brand-primary)" strokeWidth="2.5" />
            </g>
          </svg>

          <div
            ref={cueRef}
            style={{ transform: "translate(-50%, 0px)" }}
            className="absolute bottom-6 left-1/2 flex flex-col items-center gap-1.5"
          >
            <div className="flex items-center gap-2 rounded-full border border-border bg-surface px-3.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-text-secondary shadow-lg">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-primary" />
              <span>Scroll to enter</span>
            </div>
            <div className="animate-bounce text-text-secondary">
              <ChevronDown className="h-4 w-4" aria-hidden="true" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}