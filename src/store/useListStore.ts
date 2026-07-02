import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { UserProfileSummary } from "@/types";

interface ListState {
  selectedProfiles: UserProfileSummary[];
  addProfile: (profile: UserProfileSummary) => void;
  removeProfile: (userId: string) => void;
}

export const useListStore = create<ListState>()(
  persist(
    (set) => ({
      selectedProfiles: [],
      addProfile: (profile) =>
        set((state) => {
          if (state.selectedProfiles.some((p) => p.user_id === profile.user_id)) {
            return state;
          }
          return { selectedProfiles: [...state.selectedProfiles, profile] };
        }),
      removeProfile: (userId) =>
        set((state) => ({
          selectedProfiles: state.selectedProfiles.filter(
            (p) => p.user_id !== userId
          ),
        })),
    }),
    {
      name: "influencer-selected-list",
    }
  )
);
