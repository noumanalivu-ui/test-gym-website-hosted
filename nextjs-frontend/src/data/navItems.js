// src/data/navItems.js
// Plain data module (no React) so server AND client components can import it
// without pulling Navbar.jsx into the client bundle or creating a circular import.

export const LOGO_TEXT = "gym";

// Hash links point at ids on the home page. Make sure each section has the id:
//   Services -> id="services"            Exercises -> id="exercises"
//   FitnessCalculators -> id="fitness-calculators"   Pricing -> id="membership"
export const navItems = [
  { name: "About", href: "/#about" },
  { name: "Services", href: "/#services" },
  { name: "Calculators", href: "/#fitness-calculators" },
  { name: "Pricing", href: "/#membership" },
  { name: "Contact", href: "/contact" },
];

export const NAV_CTA = { label: "Join Now", href: "/#membership" };