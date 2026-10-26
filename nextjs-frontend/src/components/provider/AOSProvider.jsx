// src/components/provider/AOSProvider.jsx
"use client";
import { useEffect } from "react";

const AOSProvider = () => {
  useEffect(() => {
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches) return;

    let cancelled = false;
    let idleId;
    let timerId;

    const start = async () => {
      const [{ default: AOS }] = await Promise.all([
        import("aos"),
        import("aos/dist/aos.css"),
      ]);
      if (cancelled) return;
      AOS.init({
        duration: 700,
        once: true, // animate once; far cheaper than re-running on every scroll
        offset: 40,
        easing: "ease-out-cubic",
      });
    };

    // Wait for the load event, then for an idle moment, so every
    // component has finished hydrating before AOS touches the DOM
    const schedule = () => {
      if ("requestIdleCallback" in window) {
        idleId = window.requestIdleCallback(start, { timeout: 2500 });
      } else {
        timerId = window.setTimeout(start, 1200);
      }
    };

    if (document.readyState === "complete") schedule();
    else window.addEventListener("load", schedule, { once: true });

    return () => {
      cancelled = true;
      window.removeEventListener("load", schedule);
      if (idleId) window.cancelIdleCallback?.(idleId);
      if (timerId) clearTimeout(timerId);
    };
  }, []);

  return null;
};

export default AOSProvider;