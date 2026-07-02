import type { Platform, UserProfileSummary } from "@/types";
import { ProfileCard } from "./ProfileCard";

interface ProfileListProps {
  profiles: UserProfileSummary[];
  platform: Platform;
}

export function ProfileList({
  profiles,
  platform,
}: ProfileListProps) {
  return (
    <div className="w-full">
      {profiles.length === 0 && (
        <div className="py-20 text-center text-gray-500 bg-white rounded-2xl border border-gray-100">
          No profiles found. Try adjusting your search.
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-12">
        {profiles.map((profile) => (
          <ProfileCard
            key={profile.user_id}
            profile={profile}
            platform={platform}
          />
        ))}
      </div>
    </div>
  );
}
