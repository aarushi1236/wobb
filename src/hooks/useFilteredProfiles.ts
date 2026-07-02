import { useMemo } from "react";
import type { Platform, UserProfileSummary } from "@/types";
import { extractProfiles, filterProfiles } from "@/utils/dataHelpers";
import { getProfileCategories, FOLLOWER_SLIDER_MULTIPLIER } from "@/constants";

export type ActiveTab = "all" | "trending" | "newest";
export type SortOption = "Most Followers" | "Highest Engagement" | "A - Z";

interface UseFilteredProfilesOptions {
  platform: Platform;
  searchQuery: string;
  selectedCategories: string[];
  followerRange: number;
  activeTab: ActiveTab;
  sortBy: SortOption;
}

interface UseFilteredProfilesResult {
  allProfiles: UserProfileSummary[];
  filteredProfiles: UserProfileSummary[];
}

export function useFilteredProfiles({
  platform,
  searchQuery,
  selectedCategories,
  followerRange,
  activeTab,
  sortBy,
}: UseFilteredProfilesOptions): UseFilteredProfilesResult {
  const allProfiles = useMemo(() => extractProfiles(platform), [platform]);

  const filtered = useMemo(() => {
    let result = filterProfiles(allProfiles, searchQuery);

    // Filter by category
    if (selectedCategories.length > 0) {
      result = result.filter((p) => {
        const pCategories = getProfileCategories(p.username);
        return selectedCategories.some((cat) => pCategories.includes(cat));
      });
    }

    // Filter by Min Followers (slider 0-100 -> 0 to 1 billion)
    const minFollowers = followerRange * FOLLOWER_SLIDER_MULTIPLIER;
    if (minFollowers > 0) {
      result = result.filter((p) => p.followers >= minFollowers);
    }

    // Tab Filtering
    if (activeTab === "trending") {
      result = result.filter((p) => (p.engagement_rate || 0) >= 0.01);
    } else if (activeTab === "newest") {
      result = [...result].reverse();
    }

    // Sorting
    // For 'newest', we want to preserve the reversed order, so we skip default sorting
    if (activeTab !== "newest" || sortBy !== "Most Followers") {
      // Always clone before sorting to avoid side effects
      result = [...result];
      if (sortBy === "Most Followers") {
        result.sort((a, b) => b.followers - a.followers);
      } else if (sortBy === "Highest Engagement") {
        result.sort((a, b) => (b.engagement_rate || 0) - (a.engagement_rate || 0));
      } else if (sortBy === "A - Z") {
        result.sort((a, b) => a.username.localeCompare(b.username));
      }
    }

    return result;
  }, [allProfiles, searchQuery, selectedCategories, followerRange, activeTab, sortBy]);

  return {
    allProfiles,
    filteredProfiles: filtered,
  };
}
