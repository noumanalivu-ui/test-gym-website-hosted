"use client";

import { useRef } from "react";
import Image from "next/image";
import { ArrowLeftRight } from "lucide-react";

/**
 * Before/After slider.
 * - Pointer Events on the frame handle mouse, touch and pen (works on mobile).
 * - The native range input stays for keyboard + screen reader users only.
 * - Position lives in a CSS variable (--pos): no React state, no re-renders.
 */
export default function WhyGymingGoodCSSlider({
  beforeSrc,
  afterSrc,
  beforeAlt = "",
  afterAlt = "",
  caption = "Drag the slider to compare before and after",
}) {
  const rootRef = useRef(null);
  const inputRef = useRef(null);
  const draggingRef = useRef(false);

  const setPosition = (value) => {
    const pct = Math.min(100, Math.max(0, Number(value) || 0));
    rootRef?.current?.style?.setProperty("--pos", `${pct}%`);
    if (inputRef?.current) {
      inputRef.current.value = String(Math.round(pct));
      inputRef.current.setAttribute(
        "aria-valuetext",
        `${Math.round(pct)}% of before image shown`
      );
    }
  };

  const moveFromPointer = (e) => {
    const rect = rootRef?.current?.getBoundingClientRect?.();
    if (!rect?.width) return;
    setPosition(((e.clientX - rect.left) / rect.width) * 100);
  };

  const handlePointerDown = (e) => {
    draggingRef.current = true;
    e.currentTarget?.setPointerCapture?.(e.pointerId);
    moveFromPointer(e);
  };

  const handlePointerMove = (e) => {
    if (draggingRef.current) moveFromPointer(e);
  };

  const stopDragging = (e) => {
    draggingRef.current = false;
    e.currentTarget?.releasePointerCapture?.(e.pointerId);
  };

  return (
    <figure className="m-0">
      <div
        ref={rootRef}
        style={{ "--pos": "50%" }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={stopDragging}
        onPointerCancel={stopDragging}
        className="relative aspect-[4/5] w-full cursor-ew-resize touch-pan-y select-none overflow-hidden rounded-2xl border border-border bg-surface"
      >
        {/* After (base layer) */}
        <Image
          src={afterSrc}
          alt={afterAlt}
          fill
          quality={70}
          loading="lazy"
          draggable={false}
          sizes="(min-width: 1024px) 40vw, 80vw"
          className="pointer-events-none object-cover object-center"
        />

        {/* Before (clipped by --pos) */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{ clipPath: "inset(0 calc(100% - var(--pos)) 0 0)" }}
        >
          <Image
            src={beforeSrc}
            alt={beforeAlt}
            fill
            quality={70}
            loading="lazy"
            draggable={false}
            sizes="(min-width: 1024px) 40vw, 80vw"
            className="pointer-events-none object-cover object-center"
          />
        </div>

        <span className="pointer-events-none absolute left-3 top-3 rounded-full bg-black/75 px-3 py-1 text-xs font-semibold text-white">
          Before
        </span>
        <span className="pointer-events-none absolute right-3 top-3 rounded-full bg-black/75 px-3 py-1 text-xs font-semibold text-white">
          After
        </span>

        {/* Keyboard / screen-reader control (not pointer-interactive) */}
        <input
          ref={inputRef}
          type="range"
          min="0"
          max="100"
          step="1"
          defaultValue="50"
          onInput={(e) => setPosition(e?.target?.value)}
          aria-label="Compare before and after images"
          aria-valuetext="50% of before image shown"
          className="peer pointer-events-none absolute inset-0 z-20 m-0 h-full w-full appearance-none bg-transparent opacity-0"
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
          <ArrowLeftRight className="h-5 w-5" strokeWidth={2.5} aria-hidden="true" />
        </div>
      </div>

      <figcaption className="sr-only">{caption}</figcaption>
    </figure>
  );
}