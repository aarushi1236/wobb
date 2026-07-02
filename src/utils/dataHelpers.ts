import instagramData from "@/assets/data/search/instagram.json";
import youtubeData from "@/assets/data/search/youtube.json";
import tiktokData from "@/assets/data/search/tiktok.json";
import type { Platform, SearchData, UserProfileSummary } from "@/types";
import { PLATFORM_LABELS, PLATFORM_LIST } from "@/constants";

const platformData: Record<Exclude<Platform, "all">, SearchData> = {
  instagram: instagramData as SearchData,
  youtube: youtubeData as SearchData,
  tiktok: tiktokData as SearchData,
};

function extractFromPlatform(platform: Exclude<Platform, "all">): UserProfileSummary[] {
  const data = platformData[platform];
  return data.accounts.map((item) => {
    const profile = item.account.user_profile as UserProfileSummary & {
      handle?: string;
      custom_name?: string;
    };
    // Some YouTube profiles lack a `username` field — derive from handle or custom_name
    const username = profile.username || profile.handle || profile.custom_name || profile.user_id;
    return { ...profile, username, platform };
  });
}

export function extractProfiles(platform: Platform): UserProfileSummary[] {
  if (platform === "all") {
    return [
      ...extractFromPlatform("instagram"),
      ...extractFromPlatform("youtube"),
      ...extractFromPlatform("tiktok"),
    ];
  }
  return extractFromPlatform(platform);
}

export function filterProfiles(
  profiles: UserProfileSummary[],
  query: string
): UserProfileSummary[] {
  if (!query) return profiles;
  const q = query.toLowerCase();
  return profiles.filter((p) => {
    const matchUsername = (p.username || "").toLowerCase().includes(q);
    const matchFullname = (p.fullname || "").toLowerCase().includes(q);
    return matchUsername || matchFullname;
  });
}

/** All available platform options (including "all"). */
export const PLATFORMS: Platform[] = PLATFORM_LIST;

/** Human-readable label for a given platform key. */
export function getPlatformLabel(platform: Platform): string {
  return PLATFORM_LABELS[platform] ?? platform;
}
