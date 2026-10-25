// src/components/Navbar.jsx
import React from "react";
import Link from "next/link";
import ThemeToggle from "../functional/ThemeToggle";
import NavbarClient from "./NavbarClient";
import NavbarLinksClient from "./NavbarLinksClient";
import { SITE_NAME, SITE_URL } from "../../data/siteInfo";
import { navItems, NAV_CTA, LOGO_TEXT } from "../../data/navItems";

const navSchema = {
  "@context": "https://schema.org",
  "@type": "SiteNavigationElement",
  name: "Main Navigation",
  description: `Primary navigation for ${SITE_NAME}`,
  url: SITE_URL,
  hasPart: navItems.map((item) => ({
    "@type": "SiteNavigationElement",
    name: item.name,
    url: `${SITE_URL}${item.href}`,
  })),
};

const navSchemaJson = JSON.stringify(navSchema).replace(/</g, "\\u003c");

const Navbar = () => {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: navSchemaJson }} />

      <nav
        aria-label="Main navigation"
        className="sectionlayout flex h-16 items-center justify-between"
      >
        <Link
          href="/"
          aria-label={`${SITE_NAME} - Homepage`}
          className="shrink-0 rounded-lg transition-opacity hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary"
        >
          <span className="font-display text-3xl font-bold tracking-tight text-text-primary">
            {LOGO_TEXT}
            <span className="text-brand-primary">.</span>
          </span>
        </Link>

        <div className="flex items-center gap-1">
          <NavbarLinksClient />

          <div className="ml-2 flex items-center gap-2 pl-1">
            <ThemeToggle />
            <Link
              href={NAV_CTA.href}
              className="hidden items-center justify-center rounded-full px-4 py-2 text-sm font-semibold text-white transition-all duration-200 hover:scale-105 hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary active:scale-95 sm:inline-flex"
              style={{
                background: "var(--brand-secondary)",
                boxShadow: "0 2px 12px rgba(242,30,38,0.3)",
              }}
            >
              {NAV_CTA.label}
            </Link>
          </div>

          <NavbarClient />
        </div>
      </nav>
    </header>
  );
};

export default Navbar;