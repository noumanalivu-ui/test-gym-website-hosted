// src/app/robots.js
import { SITE_URL } from "../data/siteInfo";

const PRIVATE_PATHS = ["/api/"];

const AI_SEARCH_AND_AGENT_BOTS = [
  "OAI-SearchBot",     // ChatGPT search
  "ChatGPT-User",      // ChatGPT browsing / agent actions
  "Claude-SearchBot",  // Claude search
  "Claude-User",       // Claude browsing on a user's request
  "PerplexityBot",     // Perplexity search index
  "Perplexity-User",   // Perplexity user-initiated fetches
  "Applebot",          // Siri / Spotlight / Apple Intelligence
  "Bingbot",           // Bing, which also powers Copilot
];

// Model-training crawlers: allowed here. Move them to a disallow rule if you want to opt out of training.
const AI_TRAINING_BOTS = ["GPTBot", "ClaudeBot", "Google-Extended", "Applebot-Extended"];

export default function robots() {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: PRIVATE_PATHS },
      { userAgent: "Googlebot", allow: "/", disallow: PRIVATE_PATHS }, // Search + AI Overviews + AI Mode
      { userAgent: AI_SEARCH_AND_AGENT_BOTS, allow: "/", disallow: PRIVATE_PATHS },
      { userAgent: AI_TRAINING_BOTS, allow: "/", disallow: PRIVATE_PATHS },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}