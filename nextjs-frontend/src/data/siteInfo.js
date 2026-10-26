// src/data/siteInfo.js
export const SITE_NAME = "Gym Website"; // your real brand name
export const SITE_URL = "https://example.com"; // your real domain, no trailing slash

// Full, finished strings. The layout uses them as-is, with no "| " concatenation.
export const SITE_TITLE = `${SITE_NAME} | Gym, Personal Training & Fitness Classes`;
export const SITE_DESCRIPTION = `Train at ${SITE_NAME}: coached strength sessions, cardio, group classes and personal training. Book a free assessment and start your first session today.`;
export const SITE_KEYWORDS = "gym, fitness center, personal training, group classes, weight loss, strength training";

export const SITE_TWITTER_HANDLE = "@brandname"
export const SITE_LOGO_URL = `${SITE_URL}/logo.svg`
export const SITE_OG_IMAGE = `${SITE_URL}/og-image.png`
export const CAREER_OG_IMAGE = `${SITE_URL}/careero-og.webp`

export const whatsAppNumber = "923077175067"    
export const whatsAppNumberFormatted = "+44 7345 950967"
export const phoneNumber = ""
export const phoneNumberFormatted = "+1 (401) 213-9915"

export const email = "hello@brandname.com"
export const address = "158 Eton Road, Ilford, IG1 2UJ, United Kingdom"
export const addressMapUrl = "https://www.bing.com/maps/search?v=2&q=158+Eton+Road+ilford%2C+IG1+2UJ&cp=51.551020~0.089686&lvl=16.7&style=r"
export const addressMapEmbedUrl = address
  ? `https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`
  : "";

export const canonicalUrl = SITE_URL
export const frontendDomainUrl = SITE_URL

export const linkedin_url = "https://www.linkedin.com/in/noumanali-dev/";
export const facebook_url = "https://www.facebook.com/naumanali.rajpoot/";
export const instagram_url = "https://www.instagram.com/naumanalirajpoot/";
export const twitter_url = "https://x.com/home";

export const socialLinks = {
    li : linkedin_url,
    fb: facebook_url,
    insta: instagram_url,
    x: twitter_url 
}

export const whatsappMessage1 = encodeURIComponent(`Hello ${SITE_NAME},

I'd like to know more about joining your gym.

Please share:
- Membership plans and pricing
- Classes and personal training options
- Opening hours

Looking forward to your reply.

Thank you.`);