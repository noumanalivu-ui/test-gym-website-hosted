"use client";

import { useRef } from "react";
import Image from "next/image";

/**
 * Before/After comparison slider.
 * - Native <input type="range"> = free keyboard + screen reader + touch support.
 * - Position is written straight to a CSS variable (--pos): no state, no re-renders.
 */
export default function BeforeAfterSlider({
  beforeSrc,
  afterSrc,
  beforeAlt = "",
  afterAlt = "",
  caption = "Drag the slider to compare before and after",
}) {
  const rootRef = useRef(null);

  const handleInput = (e) => {
    const value = e?.target?.value ?? 50;
    rootRef?.current?.style?.setProperty("--pos", `${value}%`);
    e?.target?.setAttribute("aria-valuetext", `${value}% of before image shown`);
  };

  return (
    <figure className="m-0">
      <div
        ref={rootRef}
        style={{ "--pos": "50%" }}
        className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl border border-border bg-surface select-none"
      >
        {/* After (base layer) */}
        <Image
          src={afterSrc}
          alt={afterAlt}
          fill
          quality={70}
          loading="lazy"
          sizes="(min-width: 1024px) 40vw, 100vw"
          className="pointer-events-none object-cover object-center"
        />

        {/* Before (clipped by --pos) */}
        <div
          className="absolute inset-0"
          style={{ clipPath: "inset(0 calc(100% - var(--pos)) 0 0)" }}
        >
          <Image
            src={beforeSrc}
            alt={beforeAlt}
            fill
            quality={70}
            loading="lazy"
            sizes="(min-width: 1024px) 40vw, 100vw"
            className="pointer-events-none object-cover object-center"
          />
        </div>

        <span className="pointer-events-none absolute left-3 top-3 rounded-full bg-black/75 px-3 py-1 text-xs font-semibold text-white">
          Before
        </span>
        <span className="pointer-events-none absolute right-3 top-3 rounded-full bg-black/75 px-3 py-1 text-xs font-semibold text-white">
          After
        </span>

        {/* Accessible control: invisible range input covers the whole frame */}
        <input
          type="range"
          min="0"
          max="100"
          step="1"
          defaultValue="50"
          onInput={handleInput}
          aria-label="Compare before and after images"
          aria-valuetext="50% of before image shown"
          className="peer absolute inset-0 z-20 m-0 h-full w-full cursor-ew-resize appearance-none bg-transparent opacity-0 touch-pan-y"
        />

        {/* Divider line */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 z-10 w-1 -translate-x-1/2 bg-brand-primary"
          style={{ left: "var(--pos)" }}
        />

        {/* Handle */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 z-10 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-brand-primary text-white peer-focus-visible:ring-4 peer-focus-visible:ring-white"
          style={{ left: "var(--pos)" }}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M8 7 3 12l5 5M16 7l5 5-5 5M3 12h18" />
          </svg>
        </div>
      </div>

      <figcaption className="sr-only">{caption}</figcaption>
    </figure>
  );
}