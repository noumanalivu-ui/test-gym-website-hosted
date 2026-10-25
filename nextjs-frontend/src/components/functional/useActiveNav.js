"use client";

// src/components/useActiveNav.js
import { useEffect, useState } from "react";

/** Which home-page section (by id) is currently in view. "" when none / not on home. */
export default function useActiveNav(pathname, items) {
  const [activeId, setActiveId] = useState("");

  useEffect(() => {
    if (pathname !== "/") {
      setActiveId("");
      return undefined;
    }

    const ids = (items ?? []).map((i) => i?.href?.split("#")?.[1]).filter(Boolean);
    const visible = new Map(ids.map((id) => [id, false]));
    const elements = ids.map((id) => document.getElementById(id)).filter(Boolean);
    if (!elements.length) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => visible.set(e.target.id, e.isIntersecting));
        setActiveId(ids.find((id) => visible.get(id)) ?? "");
      },
      // thin band near the upper-middle of the viewport
      { rootMargin: "-35% 0px -60% 0px" }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [pathname, items]);

  return activeId;
}

/** Active-state rules for both plain routes (/contact) and home hash links (/#pricing). */
export const isItemActive = (item, pathname, activeId) => {
  const [path, hash] = (item?.href ?? "").split("#");
  const base = path || "/";
  if (hash) return pathname === base && activeId === hash;
  return pathname === base || Boolean(pathname?.startsWith(base + "/"));
};