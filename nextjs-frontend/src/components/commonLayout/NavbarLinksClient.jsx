"use client";

// src/components/NavbarLinksClient.jsx
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navItems } from "../../data/navItems";
import useActiveNav, { isItemActive } from "../functional/useActiveNav";

const NavbarLinksClient = () => {
  const pathname = usePathname();
  const activeId = useActiveNav(pathname, navItems);

  return (
    <ul className="hidden items-center gap-1 pr-2 lg:flex lg:border-r lg:border-border">
      {navItems.map((item) => {
        const isActive = isItemActive(item, pathname, activeId);

        return (
          <li key={item.name} className="relative">
            <Link
              href={item.href}
              className={`group relative flex items-center rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 hover:bg-surface-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary ${
                isActive ? "text-text-primary" : "text-text-secondary hover:text-text-primary"
              }`}
              aria-current={isActive ? (item.href.includes("#") ? "location" : "page") : undefined}
            >
              <span className="relative overflow-hidden">
                <span className="block transition-transform duration-300 group-hover:-translate-y-full">
                  {item.name}
                </span>
                <span
                  aria-hidden="true"
                  className="absolute left-0 top-full text-brand-primary transition-transform duration-300 group-hover:-translate-y-full"
                >
                  {item.name}
                </span>
              </span>

              {isActive && (
                <span
                  className="absolute bottom-0 left-1/2 h-0.5 w-6 -translate-x-1/2 rounded-full bg-brand-primary"
                  aria-hidden="true"
                />
              )}
            </Link>
          </li>
        );
      })}
    </ul>
  );
};

export default NavbarLinksClient;