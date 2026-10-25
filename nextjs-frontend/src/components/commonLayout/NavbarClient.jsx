// src/components/NavbarClient.jsx
"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import { SITE_NAME } from "../../data/siteInfo";
import { navItems, NAV_CTA } from "../../data/navItems";
import useActiveNav, { isItemActive } from "../functional/useActiveNav";

const FOCUS = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary";

// Mobile NavLink
const MobileNavLink = ({ item, isActive, closeMenu }) => (
  <Link
    href={item.href}
    className={`block rounded-lg px-4 py-3 text-base font-medium transition-colors hover:bg-surface-hover ${FOCUS} ${
      isActive ? "bg-surface-hover text-brand-primary" : "text-text-primary"
    }`}
    onClick={closeMenu}
    aria-current={isActive ? (item.href.includes("#") ? "location" : "page") : undefined}
  >
    <span className="flex items-center gap-2">
      {item.name}
      {isActive && <span className="h-1.5 w-1.5 rounded-full bg-brand-primary" aria-hidden="true" />}
    </span>
  </Link>
);

export default function NavbarClient() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const pathname = usePathname();
  const activeId = useActiveNav(pathname, navItems);

  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Escape key (only while open)
  useEffect(() => {
    if (!isOpen) return undefined;
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        setIsOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen]);

  // Focus trap
  useEffect(() => {
    if (!isOpen) return undefined;

    const focusableElements =
      menuRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      ) || [];

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleTab = (e) => {
      if (e.key !== "Tab") return;
      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement?.focus();
      }
      if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement?.focus();
      }
    };

    document.addEventListener("keydown", handleTab);
    const focusTimeout = setTimeout(() => firstElement?.focus(), 100);

    return () => {
      document.removeEventListener("keydown", handleTab);
      clearTimeout(focusTimeout);
    };
  }, [isOpen]);

  // Lock page scroll while the sheet is open.
  // Uses overflow:hidden only. The old `position: fixed` on <body> reset the scroll
  // position to 0 when it was removed, which broke hash links (/#pricing) tapped
  // inside the mobile menu.
  useEffect(() => {
    const html = document.documentElement;
    html.style.overflow = isOpen ? "hidden" : "";
    return () => {
      html.style.overflow = "";
    };
  }, [isOpen]);

  const toggleMenu = useCallback(() => setIsOpen((prev) => !prev), []);

  const closeMenu = useCallback(() => {
    setIsOpen(false);
    setTimeout(() => buttonRef.current?.focus({ preventScroll: true }), 100);
  }, []);

  // Optional, fully-gated WebMCP tool registration so AI browser agents can
  // open/close the mobile menu directly. No-ops where the API doesn't exist.
  useEffect(() => {
    if (!document?.modelContext?.registerTool) return undefined;

    const controller = new AbortController();
    const register = (name, description, open) =>
      document.modelContext.registerTool(
        {
          name,
          description,
          inputSchema: { type: "object", properties: {} },
          execute: async () => {
            setIsOpen(open);
            return open ? "Mobile navigation menu opened." : "Mobile navigation menu closed.";
          },
          annotations: { readOnlyHint: false, untrustedContentHint: false },
        },
        { signal: controller.signal }
      );

    register(
      "open_mobile_navigation_menu",
      "Opens the site's mobile navigation menu (bottom sheet) so its links become visible and clickable.",
      true
    );
    register(
      "close_mobile_navigation_menu",
      "Closes the site's mobile navigation menu (bottom sheet) if it is currently open.",
      false
    );

    return () => controller.abort();
  }, []);

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <button
        ref={buttonRef}
        type="button"
        className="flex flex-col space-y-1 p-2 lg:hidden"
        aria-label="Open menu"
        aria-expanded="false"
        aria-controls="mobile-menu"
      >
        <span className="h-1 w-7 rounded-3xl bg-text-primary" />
        <span className="h-1 w-7 rounded-3xl bg-text-primary" />
        <span className="h-1 w-7 rounded-3xl bg-text-primary" />
      </button>
    );
  }

  const menuContent = (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          style={{ background: "rgba(0,0,0,0.5)" }}
          onClick={closeMenu}
          aria-hidden="true"
        />
      )}

      {/* Bottom Sheet */}
      <div
        ref={menuRef}
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation menu"
        inert={!isOpen}
        className={`fixed bottom-0 left-0 right-0 z-50 transition-all duration-500 ease-out lg:hidden ${
          isOpen ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-full opacity-0"
        }`}
        style={{
          width: "100vw",
          maxHeight: "80vh",
          background: "var(--background)",
          borderTopLeftRadius: "20px",
          borderTopRightRadius: "20px",
          borderTop: "1px solid var(--border)",
          borderLeft: "1px solid var(--border)",
          borderRight: "1px solid var(--border)",
          boxShadow: "0 -10px 40px rgba(0,0,0,0.25)",
          overflow: "hidden",
        }}
      >
        {/* Handle */}
        <div className="flex justify-center pb-2 pt-3" aria-hidden="true">
          <div className="h-1.5 w-12 rounded-full" style={{ background: "var(--border)" }} />
        </div>

        {/* Close */}
        <button
          type="button"
          onClick={closeMenu}
          className={`absolute right-4 top-4 rounded-full p-2 transition-colors hover:bg-surface-hover ${FOCUS}`}
          aria-label="Close menu"
        >
          <X size={20} className="text-text-primary" aria-hidden="true" />
        </button>

        {/* Content */}
        <div className="overflow-y-auto px-4 pb-6 pt-2" style={{ maxHeight: "calc(80vh - 48px)" }}>
          <nav aria-label="Mobile navigation">
            <ul className="space-y-1">
              {navItems.map((item) => (
                <li key={item.name}>
                  <MobileNavLink
                    item={item}
                    isActive={isItemActive(item, pathname, activeId)}
                    closeMenu={closeMenu}
                  />
                </li>
              ))}
            </ul>
          </nav>

          <div className="my-4 border-t border-border" />

          <Link
            href={NAV_CTA.href}
            className={`mx-auto block w-[80vw] rounded-full px-4 py-3 text-center text-sm font-semibold text-white transition-all duration-200 hover:scale-105 active:scale-95 ${FOCUS}`}
            style={{
              background: "var(--brand-secondary)",
              boxShadow: "0 2px 12px rgba(242,30,38,0.3)",
            }}
            onClick={closeMenu}
          >
            {NAV_CTA.label}
          </Link>

          <footer className="mt-4 px-4 py-3 text-center text-xs text-text-secondary">
            <p>
              © {new Date().getFullYear()} {SITE_NAME}. All rights reserved.
            </p>
          </footer>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        ref={buttonRef}
        type="button"
        onClick={toggleMenu}
        className={`flex flex-col space-y-1 rounded-lg p-2 transition-colors hover:bg-surface-hover lg:hidden ${FOCUS}`}
        aria-label={isOpen ? "Close menu" : "Open menu"}
        aria-expanded={isOpen}
        aria-controls="mobile-menu"
        aria-haspopup="dialog"
      >
        <span
          className={`h-1 w-7 rounded-3xl bg-text-primary transition-all duration-300 ${
            isOpen ? "translate-y-2 rotate-45" : ""
          }`}
        />
        <span
          className={`h-1 w-7 rounded-3xl bg-text-primary transition-all duration-300 ${
            isOpen ? "opacity-0" : ""
          }`}
        />
        <span
          className={`h-1 w-7 rounded-3xl bg-text-primary transition-all duration-300 ${
            isOpen ? "-translate-y-2 -rotate-45" : ""
          }`}
        />
      </button>

      {/* Portal escapes the header's backdrop-blur containing block so
          position:fixed anchors to the real viewport, not the 64px header */}
      {typeof document !== "undefined" && createPortal(menuContent, document.body)}
    </>
  );
}