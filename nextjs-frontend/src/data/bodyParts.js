// src/data/bodyParts.js
// Single source of truth for the home page cards AND the /exercises/[bodyPart] routes.
// `slug` is the URL segment, and also the image file name in /public/body-parts/{slug}.webp
// `apiValue` is what you send to your Express API / DB query (adjust to match your data).

export const bodyParts = [
  { slug: "back", label: "Back", apiValue: "back" },
  { slug: "cardio", label: "Cardio", apiValue: "cardio" },
  { slug: "chest", label: "Chest", apiValue: "chest" },
  { slug: "lower-arms", label: "Lower Arms", apiValue: "lower arms" },
  { slug: "lower-legs", label: "Lower Legs", apiValue: "lower legs" },
  { slug: "neck", label: "Neck", apiValue: "neck" },
  { slug: "shoulders", label: "Shoulders", apiValue: "shoulders" },
  { slug: "upper-arms", label: "Upper Arms", apiValue: "upper arms" },
  { slug: "upper-legs", label: "Upper Legs", apiValue: "upper legs" },
  { slug: "waist", label: "Waist", apiValue: "waist" },
];

export const getBodyPartBySlug = (slug) =>
  bodyParts?.find((part) => part?.slug === slug) ?? null;  