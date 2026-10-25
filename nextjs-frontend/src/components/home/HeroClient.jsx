"use client";

import React, { useRef, useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";

/**
 * HeroClient
 * Scroll-driven text-mask reveal (pure JS + Tailwind, no animation libs).
 * The stage pins directly below the navbar (top-16 = 4rem), so the hero
 * content (heading, text, CTA) is fully visible once the mask opens.
 */
export default function HeroClient({
  children,
  scrollDistance = 280,
  maxScale = 55,
}) {
  const containerRef = useRef(null);
  const stageRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [dimensions, setDimensions] = useState({ width: 1920, height: 1080 });
  const [isMobile, setIsMobile] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(Boolean(mediaQuery?.matches));
    const motionListener = (e) => setPrefersReducedMotion(Boolean(e?.matches));
    mediaQuery?.addEventListener?.("change", motionListener);

    let rafId = null;

    const updateDimensions = () => {
      const stage = stageRef.current;
      const w = stage?.clientWidth || window.innerWidth;
      const h = stage?.clientHeight || window.innerHeight;
      setDimensions({ width: w, height: h });
      setIsMobile(window.innerWidth < 768);
    };

    const handleScroll = () => {
      const container = containerRef.current;
      const stage = stageRef.current;
      if (!container || !stage) return;

      // Sticky offset is read from the element itself (top-16 => 64px)
      const stickyTop = parseFloat(window.getComputedStyle(stage)?.top) || 0;
      const rect = container.getBoundingClientRect();
      const totalScrollable = container.offsetHeight - stage.offsetHeight;
      if (totalScrollable <= 0) return;

      // Progress starts exactly when the stage becomes pinned
      const scrolled = stickyTop - rect.top;
      const rawProgress = Math.min(1, Math.max(0, scrolled / totalScrollable));

      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => setProgress(rawProgress));
    };

    const handleResize = () => {
      updateDimensions();
      handleScroll();
    };

    updateDimensions();
    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
      if (rafId) cancelAnimationFrame(rafId);
      mediaQuery?.removeEventListener?.("change", motionListener);
    };
  }, [prefersReducedMotion]);

  // Phase 1 (0 → 0.36): mask expands. Phase 2: hero pinned & fully visible.
  const revealProgress = Math.min(1, progress / 0.36);
  const scale = 1 + Math.pow(revealProgress, 2.2) * maxScale;

  let maskOpacity = 1;
  if (revealProgress > 0.7) {
    maskOpacity = Math.max(0, 1 - (revealProgress - 0.7) / 0.3);
  }
  if (revealProgress >= 1) maskOpacity = 0;

  const cueOpacity = Math.max(0, 1 - progress * 10);
  const cueY = progress * 20;

  const heroScale = 1.02 - revealProgress * 0.02;
  const heroBrightness = Math.min(1, 0.9 + revealProgress * 0.1);
  const strokeOpacity = Math.max(0, 0.8 - revealProgress * 2.8);

  // Coordinates are relative to the stage (not the window)
  const cx = dimensions.width / 2;
  const cy = isMobile ? dimensions.height * 0.38 : dimensions.height * 0.5;

  const desktopFontSize = Math.min(dimensions.width * 0.078, 130);
  const mobileFontSize = Math.min(dimensions.width * 0.155, 62);

  if (prefersReducedMotion) {
    return <div className="relative w-full">{children}</div>;
  }

  const textStyle = (size) => ({
    fontFamily: "var(--font-display), 'Oswald', Impact, sans-serif",
    fontWeight: 900,
    fontSize: `${size}px`,
    letterSpacing: "0.02em",
  });

  const renderText = (props) =>
    isMobile ? (
      <text textAnchor="middle" className="font-display font-black" style={textStyle(mobileFontSize)} {...props}>
        <tspan x={cx} y={cy - mobileFontSize * 0.58} dominantBaseline="central">
          Let&apos;s
        </tspan>
        <tspan x={cx} y={cy + mobileFontSize * 0.58} dominantBaseline="central">
          Workout
        </tspan>
      </text>
    ) : (
      <text
        x={cx}
        y={cy}
        textAnchor="middle"
        dominantBaseline="central"
        className="font-display font-black"
        style={textStyle(desktopFontSize)}
        {...props}
      >
        Let&apos;s Workout
      </text>
    );

  return (
    <div
      ref={containerRef}
      className="hero-scroll-container relative w-full"
      style={{ height: `${scrollDistance}vh` }}
    >
      {/* Stage pins BELOW the 4rem navbar and fills only the visible area */}
      <div
        ref={stageRef}
        className="sticky top-16 flex h-[calc(100svh-4rem)] w-full flex-col justify-between overflow-hidden bg-background"
      >
        {/* Underlying hero */}
        <div
          style={{
            transform: `scale(${heroScale})`,
            filter: `brightness(${heroBrightness})`,
            willChange: "transform, filter",
          }}
          className="relative flex h-full w-full origin-center flex-col justify-between overflow-hidden"
        >
          {children}
        </div>

        {/* Text mask overlay */}
        <div
          aria-hidden="true"
          style={{
            opacity: maskOpacity,
            display: maskOpacity <= 0.001 ? "none" : "flex",
            willChange: "opacity, transform",
          }}
          className="pointer-events-none absolute inset-0 z-40 select-none items-center justify-center overflow-hidden"
        >
          <svg
            className="absolute inset-0 h-full w-full"
            viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
            preserveAspectRatio="none"
          >
            <defs>
              <mask id="workout-text-mask">
                <rect width="100%" height="100%" fill="white" />
                <g
                  style={{
                    transform: `scale(${scale})`,
                    transformOrigin: `${cx}px ${cy}px`,
                    willChange: "transform",
                  }}
                >
                  {renderText({ fill: "black" })}
                </g>
              </mask>
            </defs>

            <rect width="100%" height="100%" fill="var(--background)" mask="url(#workout-text-mask)" />

            {strokeOpacity > 0.01 && (
              <g
                style={{
                  transform: `scale(${scale})`,
                  transformOrigin: `${cx}px ${cy}px`,
                  opacity: strokeOpacity,
                  willChange: "transform, opacity",
                }}
              >
                {renderText({ fill: "none", stroke: "var(--brand-primary)", strokeWidth: 2.5 })}
              </g>
            )}
          </svg>

          {/* Scroll hint */}
          <div
            style={{
              opacity: cueOpacity,
              transform: `translate(-50%, ${cueY}px)`,
              display: cueOpacity <= 0.01 ? "none" : "flex",
            }}
            className="pointer-events-none absolute bottom-6 left-1/2 flex flex-col items-center gap-1.5 transition-opacity duration-150"
          >
            <div className="flex items-center gap-2 rounded-full border border-border bg-surface/90 px-3.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-text-secondary shadow-lg backdrop-blur-md">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-primary" />
              <span>Scroll to enter</span>
            </div>
            <div className="animate-bounce text-text-secondary/80">
              <ChevronDown className="h-4 w-4" aria-hidden="true" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}