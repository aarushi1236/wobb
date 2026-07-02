import { memo } from "react";
import { Link } from "react-router-dom";
import type { Platform, UserProfileSummary } from "@/types";
import { VerifiedBadge, Avatar } from "../ui";
import { formatFollowers, cn } from "@/utils";
import { Heart, Plus, Users, Activity } from "lucide-react";
import { useListStore, useToastStore } from "@/store";
import { PLATFORM_BADGE_COLORS } from "@/constants";

interface ProfileCardProps {
  profile: UserProfileSummary;
  platform: Platform;
}

const PLATFORM_COLORS = PLATFORM_BADGE_COLORS;

function PlatformIcon({ platform }: { platform: string }) {
  const norm = platform.toLowerCase();
  if (norm === "instagram") {
    return (
      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-white" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
      </svg>
    );
  }
  if (norm === "youtube") {
    return (
      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-white" xmlns="http://www.w3.org/2000/svg">
        <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
      </svg>
    );
  }
  if (norm === "tiktok") {
    return (
      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-white" xmlns="http://www.w3.org/2000/svg">
        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.78a4.85 4.85 0 01-1.01-.09z"/>
      </svg>
    );
  }
  return null;
}

export const ProfileCard = memo(function ProfileCard({ profile, platform }: ProfileCardProps) {
  // Optimization: Select only what is needed from Zustand to prevent unnecessary re-renders
  const isSelected = useListStore((state) =>
    state.selectedProfiles.some((p) => p.user_id === profile.user_id)
  );
  const addProfile = useListStore((state) => state.addProfile);
  const removeProfile = useListStore((state) => state.removeProfile);
  
  // Toast notifications
  const addToast = useToastStore((state) => state.addToast);

  const effectivePlatform = (platform === "all" ? profile.platform : platform) || "instagram";

  const toggleList = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isSelected) {
      removeProfile(profile.user_id);
      addToast(`Removed @${profile.username} from your list`, "info");
    } else {
      addProfile({ ...profile, platform: effectivePlatform });
      addToast(`Added @${profile.username} to your list`, "success");
    }
  };

  const latestPostImage = profile.latest_post_image || profile.picture;

  return (
    <div className="group relative flex flex-col bg-gray-900 rounded-3xl overflow-hidden shadow-sm hover:shadow-[0_20px_40px_rgba(0,0,0,0.25)] transition-all duration-300 hover:-translate-y-1 h-[400px]">
      
      {/* Full Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105 opacity-90 group-hover:opacity-100"
        style={{ backgroundImage: `url(${latestPostImage})` }}
      />
      
      {/* Gradient Overlay for Text Readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/45 to-black/10 transition-opacity duration-300" />

      {/* Platform Badge (Top Left) — only shown in All Platforms view */}
      {platform === "all" && effectivePlatform && PLATFORM_COLORS[effectivePlatform] && (
        <div className={cn(
          "absolute top-4 left-4 z-20 w-8 h-8 rounded-full flex items-center justify-center shadow-md",
          PLATFORM_COLORS[effectivePlatform]
        )}>
          <PlatformIcon platform={effectivePlatform} />
        </div>
      )}

      {/* Heart Icon (Top Right) */}
      <button 
        onClick={toggleList}
        aria-label={isSelected ? `Remove ${profile.fullname} from list` : `Add ${profile.fullname} to list`}
        className={cn(
          "absolute top-4 right-4 z-20 w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-md backdrop-blur-md border",
          isSelected 
            ? "bg-primary text-white border-primary" 
            : "bg-black/30 text-white border-white/20 hover:bg-white hover:text-primary hover:border-white hover:scale-110"
        )}
      >
        <Heart className={cn("w-5 h-5", isSelected && "fill-current")} />
      </button>

      <Link to={`/profile/${profile.username}?platform=${effectivePlatform}`} className="absolute inset-0 flex flex-col justify-end p-5 z-10">
        
        {/* Profile Info Overlay */}
        <div className="flex items-end gap-4 transform transition-transform duration-300 group-hover:translate-y-[-10px]">
          {/* Avatar with fallback handling */}
          <Avatar 
            src={profile.picture} 
            alt={profile.username}
            name={profile.fullname || profile.username}
            platform={effectivePlatform}
            className="w-14 h-14 rounded-full border-2 border-white/80 object-cover shadow-lg text-xs"
          />

          <div className="flex-1 overflow-hidden text-left">
            <h3 className="font-bold text-white text-lg flex items-center gap-1.5 truncate shadow-black drop-shadow-md">
              {profile.fullname || profile.username}
              <VerifiedBadge verified={profile.is_verified} />
            </h3>
            <p className="text-sm text-gray-300 truncate font-medium drop-shadow-sm mb-1.5">@{profile.username}</p>
            
            <div className="flex items-center gap-4 text-xs font-semibold text-white/90">
              <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur px-2 py-1 rounded-lg">
                <Users className="w-3.5 h-3.5" />
                <span>{formatFollowers(profile.followers)}</span>
              </div>
              {profile.engagement_rate !== undefined && (
                <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur px-2 py-1 rounded-lg">
                  <Activity className="w-3.5 h-3.5" />
                  <span>{(profile.engagement_rate * 100).toFixed(1)}%</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </Link>

      {/* Hover Action Overlay */}
      <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 z-20">
        <button 
          onClick={toggleList}
          className="w-full flex items-center justify-center gap-2 py-3 bg-white text-gray-900 rounded-xl text-sm font-bold hover:bg-gray-50 shadow-xl transition-all active:scale-95"
        >
          {isSelected ? (
            <span className="text-primary">Remove from List</span>
          ) : (
            <>
              <Plus className="w-4 h-4" /> Add to List
            </>
          )}
        </button>
      </div>
    </div>
  );
});
