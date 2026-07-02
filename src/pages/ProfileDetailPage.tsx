import { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { Layout } from "@/components/layout";
import { VerifiedBadge, Avatar } from "@/components/ui";
import type { FullUserProfile, ProfileDetailResponse, Platform } from "@/types";
import { formatEngagementRate, formatFollowers, loadProfileByUsername, cn, getPlatformLabel } from "@/utils";
import { useListStore, useToastStore } from "@/store";
import { 
  Heart, 
  Plus, 
  Share2, 
  Link as LinkIcon, 
  Users, 
  Activity, 
  Image as ImageIcon, 
  MessageCircle, 
  Camera, 
  Video, 
  Sparkles, 
  TrendingUp, 
  Check, 
  ArrowLeft 
} from "lucide-react";
import { getProfileCategories } from "@/constants";

export function ProfileDetailPage() {
  const { username } = useParams<{ username: string }>();
  const [searchParams] = useSearchParams();
  const platform = searchParams.get("platform") || "unknown";
  
  const [profileData, setProfileData] = useState<ProfileDetailResponse | null>(null);
  const [loaded, setLoaded] = useState(false);

  // Optimized Zustand selectors
  const selectedProfiles = useListStore((state) => state.selectedProfiles);
  const addProfile = useListStore((state) => state.addProfile);
  const removeProfile = useListStore((state) => state.removeProfile);
  
  // Toast notification
  const addToast = useToastStore((state) => state.addToast);

  useEffect(() => {
    if (!username) return;
    let active = true;

    loadProfileByUsername(username).then((data) => {
      if (active) {
        setProfileData(data);
        setLoaded(true);
      }
    });

    return () => {
      active = false;
      setProfileData(null);
      setLoaded(false);
    };
  }, [username]);

  if (!username) {
    return <Layout><div className="p-8">Invalid profile</div></Layout>;
  }

  if (!loaded) {
    return (
      <Layout>
        <div className="flex flex-col justify-center items-center h-[50vh] gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary/20 border-t-primary"></div>
          <p className="text-gray-500 font-medium animate-pulse">Loading influencer details...</p>
        </div>
      </Layout>
    );
  }

  if (!profileData) {
    return (
      <Layout>
        <div className="p-8 max-w-2xl mx-auto text-center my-12">
          <p className="text-red-600 mb-6 bg-red-50 p-5 rounded-2xl border border-red-100 font-medium">
            Could not load profile details for @{username}
          </p>
          <Link to="/" className="text-white bg-primary hover:bg-primary-hover font-semibold px-6 py-3 rounded-xl inline-flex items-center gap-2 transition-all active:scale-95 shadow-lg shadow-primary/20">
            <ArrowLeft className="w-5 h-5" /> Back to Search
          </Link>
        </div>
      </Layout>
    );
  }

  const user: FullUserProfile = profileData.data.user_profile;

  // Resolve the actual platform
  const rawPlatform = platform === "unknown" || platform === "all"
    ? (user.type || platform)
    : platform;
  const displayPlatform = getPlatformLabel(rawPlatform as Platform);
  const isSelected = selectedProfiles.some((p) => p.user_id === user.user_id);

  const toggleList = () => {
    if (isSelected) {
      removeProfile(user.user_id);
      addToast(`Removed @${user.username} from your list`, "info");
    } else {
      addProfile({ ...user, platform: rawPlatform as Platform });
      addToast(`Added @${user.username} to your list`, "success");
    }
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      addToast("Profile link copied to clipboard!", "success");
    } catch {
      addToast("Failed to copy link. Please copy it from the address bar.", "error");
    }
  };

  // Platform specific design configurations
  const platformTheme = {
    instagram: {
      gradient: "from-purple-600 via-pink-500 to-orange-400",
      accent: "text-pink-500",
      bgLight: "bg-pink-50/50",
      badge: "bg-gradient-to-tr from-purple-600 via-pink-500 to-orange-400 text-white",
      icon: <Camera className="w-4 h-4" />
    },
    youtube: {
      gradient: "from-red-600 to-rose-700",
      accent: "text-red-600",
      bgLight: "bg-red-50/50",
      badge: "bg-red-600 text-white",
      icon: <Video className="w-4 h-4" />
    },
    tiktok: {
      gradient: "from-black via-slate-800 to-slate-950",
      accent: "text-slate-900",
      bgLight: "bg-slate-50",
      badge: "bg-black text-white",
      icon: <Video className="w-4 h-4" />
    },
    unknown: {
      gradient: "from-primary to-primary-hover",
      accent: "text-primary",
      bgLight: "bg-primary-light/30",
      badge: "bg-primary text-white",
      icon: <Sparkles className="w-4 h-4" />
    }
  };

  const currentTheme = platformTheme[rawPlatform as keyof typeof platformTheme] || platformTheme.unknown;

  // Engagement rating text & value compared to benchmark (1.5%)
  const erRate = user.engagement_rate || 0;
  const isHighEngagement = erRate >= 0.02;
  const isMediumEngagement = erRate >= 0.008 && erRate < 0.02;
  
  const getEngagementLabel = () => {
    if (erRate === 0) return "N/A";
    if (isHighEngagement) return "Excellent (Above Average)";
    if (isMediumEngagement) return "Good (Average)";
    return "Standard";
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto p-4 md:p-8">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
          <Link to="/" className="hover:text-primary transition-colors font-medium">Home</Link>
          <span>/</span>
          <span className="capitalize">{displayPlatform}</span>
          <span>/</span>
          <span className="text-gray-900 font-semibold">@{user.username}</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Left Column (Sticky Avatar & Actions) */}
          <div className="lg:w-1/3 flex-shrink-0">
            <div className="sticky top-24 bg-white rounded-3xl p-6 border border-gray-150 shadow-[0_8px_30px_rgb(0,0,0,0.03)] flex flex-col items-center text-center overflow-hidden relative">
              
              {/* Decorative Banner */}
              <div className={cn("absolute top-0 left-0 right-0 h-32 bg-gradient-to-r opacity-90", currentTheme.gradient)} />
              
              <div className="relative mb-6 mt-12 z-10">
                <Avatar
                  src={user.picture}
                  alt={user.username}
                  name={user.fullname || user.username}
                  platform={rawPlatform}
                  className="w-36 h-36 rounded-full object-cover border-4 border-white shadow-md text-2xl"
                />
                <button 
                  onClick={toggleList}
                  aria-label={isSelected ? "Remove from list" : "Add to list"}
                  className={cn(
                    "absolute bottom-0 right-0 p-3 rounded-full shadow-lg transition-transform hover:scale-110 active:scale-95 border",
                    isSelected 
                      ? "bg-primary text-white border-primary" 
                      : "bg-white text-gray-400 border-gray-100 hover:text-primary"
                  )}
                >
                  <Heart className={cn("w-5 h-5", isSelected && "fill-current")} />
                </button>
              </div>

              <div className="z-10">
                <h1 className="text-2xl font-bold text-gray-900 flex items-center justify-center gap-1.5">
                  {user.fullname || user.username}
                  <VerifiedBadge verified={user.is_verified} />
                </h1>
                <p className="text-gray-500 font-semibold mt-0.5">@{user.username}</p>

                {/* Platform Badge */}
                <div className="flex justify-center mt-3">
                  <span className={cn("inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold shadow-sm uppercase tracking-wide", currentTheme.badge)}>
                    {currentTheme.icon}
                    {displayPlatform}
                  </span>
                </div>
              </div>

              <div className="w-full border-t border-gray-100 my-6"></div>

              <div className="w-full space-y-3">
                <button 
                  onClick={toggleList}
                  className={cn(
                    "w-full py-3.5 rounded-2xl font-bold transition-all active:scale-98 shadow-sm flex items-center justify-center gap-2",
                    isSelected 
                      ? "bg-gray-100 text-gray-700 hover:bg-gray-200" 
                      : "bg-primary text-white hover:bg-primary-hover shadow-primary/20"
                  )}
                >
                  {isSelected ? (
                    <><Check className="w-5 h-5 text-emerald-600" /> Added to selection</>
                  ) : (
                    <><Plus className="w-5 h-5"/> Add to list</>
                  )}
                </button>
                
                <button 
                  onClick={handleShare}
                  className="w-full py-3.5 rounded-2xl font-bold border border-gray-200 text-gray-700 hover:bg-gray-50 transition-all active:scale-98 flex items-center justify-center gap-2"
                >
                  <Share2 className="w-5 h-5 text-gray-500" /> Share influencer
                </button>
              </div>
            </div>
          </div>

          {/* Right Column (Bio, Stats, Dashboard) */}
          <div className="lg:w-2/3 space-y-6">
            
            {/* About / Bio Card */}
            <div className="bg-white rounded-3xl p-8 border border-gray-150 shadow-[0_8px_30px_rgb(0,0,0,0.03)] text-left">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                About Influencer
              </h2>
              <p className="text-gray-600 leading-relaxed whitespace-pre-wrap font-medium">
                {user.description || `${user.fullname || user.username} is a professional ${displayPlatform} creator specializing in ${getProfileCategories(user.username).join(" and ")} content.`}
              </p>
              
              <div className="flex flex-wrap items-center gap-6 mt-6 pt-6 border-t border-gray-100">
                {user.url && (
                  <a 
                    href={user.url} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
                  >
                    <LinkIcon className="w-4 h-4" /> Visit official {displayPlatform} channel
                  </a>
                )}
                {user.age_group && (
                  <div className="text-sm text-gray-500 font-semibold">
                    Target Audience: <span className="text-gray-800">{user.age_group}</span>
                  </div>
                )}
                {user.gender && (
                  <div className="text-sm text-gray-500 font-semibold capitalize">
                    Gender: <span className="text-gray-800">{user.gender}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Performance Stats Grid */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-gray-900 px-2 text-left">Performance Dashboard</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* Followers */}
                <div className="bg-white p-6 rounded-2xl border border-gray-150 shadow-sm flex flex-col items-center justify-center text-center">
                  <div className="p-3 bg-blue-50 text-blue-500 rounded-2xl mb-3">
                    <Users className="w-6 h-6" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mb-1">{formatFollowers(user.followers)}</div>
                  <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Followers</div>
                </div>
                
                {/* Engagement Rate */}
                <div className="bg-white p-6 rounded-2xl border border-gray-150 shadow-sm flex flex-col items-center justify-center text-center">
                  <div className="p-3 bg-emerald-50 text-emerald-500 rounded-2xl mb-3">
                    <Activity className="w-6 h-6" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mb-1">{formatEngagementRate(user.engagement_rate)}</div>
                  <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Engagement Rate</div>
                </div>

                {/* Avg Engagements / Likes */}
                <div className="bg-white p-6 rounded-2xl border border-gray-150 shadow-sm flex flex-col items-center justify-center text-center">
                  <div className="p-3 bg-red-50 text-red-500 rounded-2xl mb-3">
                    <Heart className="w-6 h-6" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mb-1">
                    {formatFollowers(user.engagements || user.avg_likes || 0)}
                  </div>
                  <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Avg Interaction</div>
                </div>

                {/* Total Posts */}
                {user.posts_count !== undefined && (
                  <div className="bg-white p-6 rounded-2xl border border-gray-150 shadow-sm flex flex-col items-center justify-center text-center">
                    <div className="p-3 bg-purple-50 text-purple-500 rounded-2xl mb-3">
                      <ImageIcon className="w-6 h-6" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900 mb-1">{formatFollowers(user.posts_count)}</div>
                    <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total Content Posts</div>
                  </div>
                )}

                {/* Avg Comments */}
                {user.avg_comments !== undefined && (
                  <div className="bg-white p-6 rounded-2xl border border-gray-150 shadow-sm flex flex-col items-center justify-center text-center">
                    <div className="p-3 bg-teal-50 text-teal-500 rounded-2xl mb-3">
                      <MessageCircle className="w-6 h-6" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900 mb-1">{formatFollowers(user.avg_comments)}</div>
                    <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Avg Comments / Post</div>
                  </div>
                )}

                {/* Target Audience Affinity */}
                <div className="bg-white p-6 rounded-2xl border border-gray-150 shadow-sm flex flex-col items-center justify-center text-center">
                  <div className="p-3 bg-orange-50 text-orange-500 rounded-2xl mb-3">
                    <TrendingUp className="w-6 h-6" />
                  </div>
                  <div className="text-lg font-bold text-gray-900 mb-1 capitalize">
                    {getProfileCategories(user.username)[0]}
                  </div>
                  <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Primary Category</div>
                </div>

              </div>
            </div>

            {/* Engagement Rating & Visual Chart */}
            {user.engagement_rate !== undefined && (
              <div className="bg-white rounded-3xl p-6 border border-gray-150 shadow-sm text-left">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Engagement Quality Rating</h3>
                    <p className="text-sm text-gray-500">Benchmark comparison of interactions against typical standard (1.5%)</p>
                  </div>
                  <span className={cn(
                    "px-3 py-1 rounded-lg text-xs font-bold uppercase",
                    isHighEngagement ? "bg-emerald-50 text-emerald-700" : isMediumEngagement ? "bg-orange-50 text-orange-700" : "bg-gray-100 text-gray-600"
                  )}>
                    {getEngagementLabel()}
                  </span>
                </div>

                {/* Progress Visualizer */}
                <div className="relative pt-1">
                  <div className="flex mb-2 items-center justify-between">
                    <span className="text-xs font-bold text-gray-400 uppercase">0%</span>
                    <span className="text-xs font-bold text-primary bg-primary-light/50 px-2 py-0.5 rounded">
                      {(user.engagement_rate * 100).toFixed(3)}%
                    </span>
                    <span className="text-xs font-bold text-gray-400 uppercase">5.0%+</span>
                  </div>
                  <div className="overflow-hidden h-3 text-xs flex rounded-full bg-gray-100">
                    <div 
                      style={{ width: `${Math.min(100, (user.engagement_rate * 100) * 20)}%` }}
                      className={cn(
                        "shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center transition-all duration-1000",
                        isHighEngagement ? "bg-emerald-500" : isMediumEngagement ? "bg-orange-500" : "bg-gray-400"
                      )}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-gray-400 font-semibold mt-1.5 px-1">
                    <span>Low</span>
                    <span className="text-gray-500 border-l border-dashed border-gray-300 pl-1 h-3">Average (1.5%)</span>
                    <span>High (3.0%+)</span>
                  </div>
                </div>
              </div>
            )}

            {/* Category Tags */}
            <div className="bg-white rounded-3xl p-6 border border-gray-150 shadow-sm text-left">
              <h3 className="text-lg font-bold text-gray-900 mb-3">Content Categories</h3>
              <div className="flex flex-wrap gap-2">
                {getProfileCategories(user.username).map((cat) => (
                  <span 
                    key={cat}
                    className="px-4.5 py-1.5 bg-gray-50 text-gray-600 text-sm font-semibold rounded-xl border border-gray-100 hover:bg-primary-light hover:text-primary transition-colors cursor-pointer"
                  >
                    #{cat}
                  </span>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </Layout>
  );
}
