// src/components/Testimonials/TestimonialsClient.jsx
"use client";

import { useState } from "react";
import Image from "next/image";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";

const arrowBtn =
  "absolute top-[38%] -translate-y-1/2 z-40 w-10 h-10 sm:w-11 sm:h-11 bg-text-primary text-background rounded-full shadow-2xl flex items-center justify-center hover:bg-text-primary/85 active:scale-95 transition-all motion-reduce:transition-none focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background";

const scrollbarStyle = [
  "overscroll-contain",
  // Chrome / Edge / Safari
  "[&::-webkit-scrollbar]:w-1",
  "[&::-webkit-scrollbar-track]:bg-transparent",
  "[&::-webkit-scrollbar-corner]:bg-transparent",
  "[&::-webkit-scrollbar-button]:hidden",
  "[&::-webkit-scrollbar-button]:size-0",
  "[&::-webkit-scrollbar-thumb]:rounded-full",
  "[&::-webkit-scrollbar-thumb]:bg-slate-400/40",
  "[&::-webkit-scrollbar-thumb:hover]:bg-slate-400/70",
  // Firefox only (Chrome ignores ::-webkit-scrollbar if these apply)
  "[@supports_not_selector(::-webkit-scrollbar)]:[scrollbar-width:thin]",
  "[@supports_not_selector(::-webkit-scrollbar)]:[scrollbar-color:rgba(148,163,184,0.4)_transparent]",
].join(" ");

const GRID_COLS = {
  1: "md:grid-cols-1 max-w-sm mx-auto",
  2: "md:grid-cols-2",
  3: "md:grid-cols-3",
};

// Handles 1, 2 or N reviews without duplicate keys or empty cards
const getVisible = (total, active) => {
  if (total >= 3) {
    return [
      { index: (active - 1 + total) % total, position: "left" },
      { index: active, position: "center" },
      { index: (active + 1) % total, position: "right" },
    ];
  }
  if (total === 2) {
    return [
      { index: active, position: "center" },
      { index: (active + 1) % 2, position: "right" },
    ];
  }
  return [{ index: 0, position: "center" }];
};

const TestimonialsClient = ({ reviews = [], children }) => {
  const total = reviews?.length ?? 0;
  const [activeIndex, setActiveIndex] = useState(total > 1 ? 1 : 0);

  if (total === 0) return null;

  // Clamp in case the reviews array shrinks after mount
  const current = Math.min(activeIndex, total - 1);
  const hasMany = total > 1;

  const prevReview = () => setActiveIndex(current === 0 ? total - 1 : current - 1);
  const nextReview = () => setActiveIndex(current === total - 1 ? 0 : current + 1);

  const visible = getVisible(total, current);

  return (
    <>
      <div
        role="group"
        aria-roledescription="carousel"
        aria-label="Client reviews"
        className="relative w-full max-w-4xl mx-auto z-20"
      >
        <p className="sr-only" aria-live="polite" aria-atomic="true">
          Review {current + 1} of {total}
        </p>

        {hasMany && (
          <>
            <button
              type="button"
              onClick={prevReview}
              aria-label="Previous review"
              className={`${arrowBtn} -left-3 sm:-left-7`}
            >
              <ChevronLeft aria-hidden="true" className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5]" />
            </button>

            <button
              type="button"
              onClick={nextReview}
              aria-label="Next review"
              className={`${arrowBtn} -right-3 sm:-right-7`}
            >
              <ChevronRight aria-hidden="true" className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5]" />
            </button>
          </>
        )}

        <div className={`grid grid-cols-1 gap-5 ${GRID_COLS[Math.min(total, 3)]}`}>
          {visible.map(({ index, position }) => {
            const item = reviews?.[index];
            if (!item) return null;

            const isCenter = position === "center";
            const rating = Math.max(0, Math.min(5, item?.rating ?? 5));
            const initial = (item?.name ?? "?").trim().charAt(0).toUpperCase();

            return (
              <figure
                key={item?.id ?? index}
                className={`section-bg relative w-full h-[200px] flex flex-col justify-between rounded-xl p-5 text-center shadow-sm transition-opacity duration-200 motion-reduce:transition-none ${
                  isCenter
                    ? "z-30 ring-1 ring-muted/40"
                    : "hidden md:flex z-10 opacity-80 hover:opacity-100"
                }`}
              >
                <div
                  tabIndex={0}
                  className={`${scrollbarStyle} h-[82px] overflow-y-auto pr-1 rounded-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary`}
                >
                  <blockquote className="text-[12.5px] leading-relaxed text-text-primary/85 break-words">
                    &ldquo;{item?.comment}&rdquo;
                  </blockquote>
                </div>

                <div className="flex flex-col items-center pb-5 min-w-0">
                  <div
                    role="img"
                    aria-label={`${rating} out of 5 stars`}
                    className="flex items-center justify-center gap-1 mb-1.5"
                  >
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        aria-hidden="true"
                        className={`w-4 h-4 shrink-0 ${
                          i < rating
                            ? "fill-amber-400 text-amber-400"
                            : "fill-transparent text-muted"
                        }`}
                      />
                    ))}
                  </div>
                  <figcaption className="max-w-full truncate text-sm font-semibold text-text-primary tracking-wide">
                    {item?.name}
                  </figcaption>
                </div>

                <div className="absolute -bottom-9 left-1/2 -translate-x-1/2 z-30">
                  <div className="relative flex items-center justify-center w-18 h-18 sm:w-20 sm:h-20 rounded-full overflow-hidden border-2 border-muted shadow-2xl bg-surface ring-4 ring-background">
                    {item?.avatar ? (
                      <Image
                        src={item.avatar}
                        alt={item?.name ?? "Client"}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    ) : (
                      <span aria-hidden="true" className="text-lg font-semibold text-text-primary">
                        {initial}
                      </span>
                    )}
                  </div>
                </div>
              </figure>
            );
          })}
        </div>
      </div>

      <div className="relative flex justify-center -mt-6 sm:-mt-7 z-10">
        <div className="relative w-[340px] sm:w-[420px] md:w-[470px] h-[330px] sm:h-[380px] md:h-[430px] overflow-hidden">
          {children}

          {/* Dots sit on the photo (same in both themes), so they stay white */}
          {hasMany && (
            <nav
              aria-label="Reviews pagination"
              className="absolute bottom-5 sm:bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center"
            >
              {reviews.map((r, idx) => {
                const isActive = current === idx;
                return (
                  <button
                    key={r?.id ?? idx}
                    type="button"
                    onClick={() => setActiveIndex(idx)}
                    aria-label={`Go to review ${idx + 1}`}
                    aria-current={isActive ? "true" : undefined}
                    className="p-1 rounded-full cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                  >
                    <span
                      className={`block w-2 h-2 rounded-full transition-all duration-200 motion-reduce:transition-none ${
                        isActive
                          ? "bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)] scale-110"
                          : "bg-white/40 hover:bg-white/70"
                      }`}
                    />
                  </button>
                );
              })}
            </nav>
          )}
        </div>
      </div>
    </>
  );
};

export default TestimonialsClient;