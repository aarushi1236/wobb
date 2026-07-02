/**
 * Shared application-level constants.
 * Centralising these avoids magic strings and makes future changes trivial.
 */

import type { Platform } from "@/types";

// ---------------------------------------------------------------------------
// Platform helpers
// ---------------------------------------------------------------------------

export const PLATFORM_LIST: Platform[] = ["all", "instagram", "youtube", "tiktok"];

export const PLATFORM_LABELS: Record<Platform, string> = {
  all: "All Platforms",
  instagram: "Instagram",
  youtube: "YouTube",
  tiktok: "TikTok",
};

/** Brand colour classes for platform badges */
export const PLATFORM_BADGE_COLORS: Record<string, string> = {
  instagram: "bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400",
  youtube: "bg-red-600",
  tiktok: "bg-black",
};

// ---------------------------------------------------------------------------
// Category taxonomy
// ---------------------------------------------------------------------------

export const CATEGORIES = ["Lifestyle", "Gaming", "Beauty", "Tech", "Comedy", "Sports"] as const;
export type Category = (typeof CATEGORIES)[number];

/**
 * Deterministic category mapping for every profile in the dataset.
 * Keys are lowercased usernames exactly as they appear in the JSON files.
 */
export const PROFILE_CATEGORIES: Record<string, string[]> = {
  // ── Instagram ────────────────────────────────────────────────────────────
  instagram:       ["Tech", "Lifestyle"],
  cristiano:       ["Sports"],
  leomessi:        ["Sports"],
  selenagomez:     ["Lifestyle", "Beauty"],
  kyliejenner:     ["Beauty", "Lifestyle"],
  therock:         ["Sports", "Comedy"],
  arianagrande:    ["Lifestyle", "Beauty"],
  kimkardashian:   ["Beauty", "Lifestyle"],
  beyonce:         ["Beauty", "Lifestyle"],
  khloekardashian: ["Beauty", "Lifestyle"],
  // ── YouTube ──────────────────────────────────────────────────────────────
  mrbeast6000:        ["Gaming", "Comedy"],
  tseries:            ["Lifestyle"],
  checkgate:          ["Lifestyle", "Comedy"],   // CoComelon
  setindia:           ["Lifestyle"],
  vladandniki:        ["Lifestyle", "Comedy"],
  kidsdianashow:      ["Lifestyle", "Comedy"],
  likenastyaofficial: ["Lifestyle", "Comedy"],
  zeemusiccompany:    ["Lifestyle"],
  pewdiepie:          ["Gaming", "Comedy"],
  wwefannation:       ["Sports", "Comedy"],
  // ── TikTok ───────────────────────────────────────────────────────────────
  "khaby.lame":       ["Comedy"],
  charlidamelio:      ["Beauty", "Lifestyle"],
  mrbeast:            ["Gaming", "Comedy"],
  willsmith:          ["Comedy"],
  bellapoarch:        ["Comedy", "Lifestyle"],
  addisonre:          ["Beauty", "Lifestyle"],
  "kimberly.loaiza":  ["Beauty", "Lifestyle"],
  tiktok:             ["Tech", "Lifestyle"],
  zachking:           ["Comedy"],
  domelipa:           ["Beauty", "Lifestyle"],
};

/** Returns the categories for a given username, defaulting to ["Lifestyle"] */
export function getProfileCategories(username: string): string[] {
  return PROFILE_CATEGORIES[username.toLowerCase()] ?? ["Lifestyle"];
}

// ---------------------------------------------------------------------------
// Misc UI constants
// ---------------------------------------------------------------------------

/** Duration (ms) for the reset-button flash animation */
export const RESET_FLASH_DURATION_MS = 600;

/** Follower slider multiplier: slider value 0-100 → 0 to 1 billion */
export const FOLLOWER_SLIDER_MULTIPLIER = 10_000_000;
