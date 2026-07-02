import { useState, useCallback, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import type { Platform } from "@/types";
import { Layout } from "@/components/layout";
import { Sidebar, ProfileList } from "@/components/influencers";
import { useFilteredProfiles, useDebounce } from "@/hooks";
import type { ActiveTab, SortOption } from "@/hooks";
import { X, Eye, EyeOff } from "lucide-react";
import { cn } from "@/utils";

function ProfileCardSkeleton() {
  return (
    <div className="relative flex flex-col bg-gray-150 rounded-3xl overflow-hidden animate-pulse h-[400px] border border-gray-100">
      <div className="flex-1 bg-gray-200" />
      <div className="absolute inset-x-0 bottom-0 p-5 space-y-3 bg-gradient-to-t from-gray-200/90 to-transparent pt-20">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gray-300 shrink-0" />
          <div className="flex-1 space-y-2 min-w-0">
            <div className="h-4 bg-gray-300 rounded w-2/3" />
            <div className="h-3 bg-gray-300 rounded w-1/2" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Sync state from URL parameters
  const platform = (searchParams.get("platform") as Platform) || "all";
  const urlSearchQuery = searchParams.get("q") || "";
  
  const selectedCategories = useMemo(() => {
    const cats = searchParams.get("categories");
    return cats ? cats.split(",") : [];
  }, [searchParams]);

  const followerRange = useMemo(() => {
    return Number(searchParams.get("followers") || "0");
  }, [searchParams]);

  const activeTab = useMemo(() => {
    return (searchParams.get("tab") as ActiveTab) || "all";
  }, [searchParams]);

  const sortBy = useMemo(() => {
    return (searchParams.get("sort") as SortOption) || "Most Followers";
  }, [searchParams]);

  // Local state for fast input typing
  const [searchInput, setSearchInput] = useState(urlSearchQuery);

  // Sync search input if URL changes (e.g. back button, clear filters)
  useEffect(() => {
    let active = true;
    Promise.resolve().then(() => {
      if (active) setSearchInput(urlSearchQuery);
    });
    return () => {
      active = false;
    };
  }, [urlSearchQuery]);

  // Debounce the input value for heavy calculations (150ms delay)
  const debouncedSearchQuery = useDebounce(searchInput, 150);

  // Sync debounced query back to the URL search parameter 'q'
  useEffect(() => {
    setSearchParams(
      (prev) => {
        const currentQ = prev.get("q") || "";
        if (currentQ !== debouncedSearchQuery) {
          if (!debouncedSearchQuery) {
            prev.delete("q");
          } else {
            prev.set("q", debouncedSearchQuery);
          }
        }
        return prev;
      },
      { replace: true }
    );
  }, [debouncedSearchQuery, setSearchParams]);

  // State handlers that write to the URL query string
  const handlePlatformChange = (p: Platform) => {
    setIsLoading(true);
    setSearchParams(
      (prev) => {
        if (p === "all") {
          prev.delete("platform");
        } else {
          prev.set("platform", p);
        }
        return prev;
      },
      { replace: true }
    );
    setTimeout(() => {
      setIsLoading(false);
    }, 350);
  };

  const handleCategoriesChange = (cats: string[]) => {
    setSearchParams(
      (prev) => {
        if (cats.length === 0) {
          prev.delete("categories");
        } else {
          prev.set("categories", cats.join(","));
        }
        return prev;
      },
      { replace: true }
    );
  };

  const handleFollowerRangeChange = (val: number) => {
    setSearchParams(
      (prev) => {
        if (val === 0) {
          prev.delete("followers");
        } else {
          prev.set("followers", val.toString());
        }
        return prev;
      },
      { replace: true }
    );
  };

  const handleActiveTabChange = (tab: ActiveTab) => {
    setSearchParams(
      (prev) => {
        if (tab === "all") {
          prev.delete("tab");
        } else {
          prev.set("tab", tab);
        }
        return prev;
      },
      { replace: true }
    );
  };

  const handleSortByChange = (sort: SortOption) => {
    setSearchParams(
      (prev) => {
        if (sort === "Most Followers") {
          prev.delete("sort");
        } else {
          prev.set("sort", sort);
        }
        return prev;
      },
      { replace: true }
    );
  };

  // Drawer state for mobile/tablet
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  
  // Sidebar state for desktop
  const [isDesktopSidebarOpen, setIsDesktopSidebarOpen] = useState(true);

  // Simulated loading state for professional transitions
  const [isLoading, setIsLoading] = useState(false);

  // Retrieve filtered and sorted data using our custom hook
  const { allProfiles, filteredProfiles } = useFilteredProfiles({
    platform,
    searchQuery: debouncedSearchQuery,
    selectedCategories,
    followerRange,
    activeTab,
    sortBy,
  });

  const [visibleCount, setVisibleCount] = useState(12);
  const [prevFiltersKey, setPrevFiltersKey] = useState("");

  const currentFiltersKey = `${platform}-${debouncedSearchQuery}-${selectedCategories.join(",")}-${followerRange}-${activeTab}-${sortBy}`;

  if (prevFiltersKey !== currentFiltersKey) {
    setPrevFiltersKey(currentFiltersKey);
    setVisibleCount(12);
  }

  const paginatedProfiles = useMemo(() => {
    return filteredProfiles.slice(0, visibleCount);
  }, [filteredProfiles, visibleCount]);


  const handleReset = useCallback(() => {
    setSearchInput("");
    setSearchParams(
      (prev) => {
        prev.delete("platform");
        prev.delete("q");
        prev.delete("categories");
        prev.delete("followers");
        prev.delete("tab");
        prev.delete("sort");
        return prev;
      },
      { replace: true }
    );
  }, [setSearchParams]);

  const closeFilters = useCallback(() => setIsFiltersOpen(false), [setIsFiltersOpen]);

  const handleToggleFilters = useCallback(() => {
    if (window.innerWidth >= 768) {
      setIsDesktopSidebarOpen((prev) => !prev);
    } else {
      setIsFiltersOpen(true);
    }
  }, [setIsDesktopSidebarOpen, setIsFiltersOpen]);

  const renderSkeletons = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-12 w-full">
      {Array.from({ length: 8 }).map((_, idx) => (
        <ProfileCardSkeleton key={idx} />
      ))}
    </div>
  );

  return (
    <Layout 
      searchQuery={searchInput} 
      onSearchChange={setSearchInput}
      onToggleFilters={handleToggleFilters}
    >
      <div className="p-4 md:p-8 flex gap-8 items-start relative min-h-[calc(100vh-80px)]">
        
        {/* Mobile Filters Drawer Overlay */}
        <div 
          className={cn(
            "fixed inset-0 z-50 flex transition-opacity duration-300 pointer-events-none md:hidden",
            isFiltersOpen ? "opacity-100" : "opacity-0"
          )}
        >
          {/* Backdrop */}
          <div 
            className={cn(
              "absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300",
              isFiltersOpen ? "pointer-events-auto" : "pointer-events-none"
            )}
            onClick={closeFilters}
          />
          
          {/* Drawer */}
          <div 
            className={cn(
              "relative w-full max-w-xs bg-white h-full shadow-2xl p-6 overflow-y-auto transition-transform duration-300 ease-in-out pointer-events-auto",
              isFiltersOpen ? "translate-x-0" : "-translate-x-full"
            )}
          >
            <button 
              onClick={closeFilters}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Close filters"
            >
              <X className="w-5 h-5" />
            </button>
            
            <h2 className="text-xl font-bold text-gray-900 mb-6">Filters</h2>
            
            <Sidebar 
              selectedPlatform={platform} 
              onChangePlatform={handlePlatformChange} 
              selectedCategories={selectedCategories}
              onChangeCategories={handleCategoriesChange}
              followerRange={followerRange}
              onChangeFollowerRange={handleFollowerRangeChange}
              onReset={handleReset}
            />
          </div>
        </div>

        {/* Desktop Sidebar (Inline & Collapsible) */}
        <div 
          className={cn(
            "hidden md:block bg-white p-6 rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] transition-all duration-300 shrink-0 sticky top-24 self-start",
            isDesktopSidebarOpen ? "w-64 opacity-100 translate-x-0" : "w-0 p-0 opacity-0 -translate-x-4 border-none shadow-none overflow-hidden"
          )}
        >
          {isDesktopSidebarOpen && (
            <Sidebar 
              selectedPlatform={platform} 
              onChangePlatform={handlePlatformChange} 
              selectedCategories={selectedCategories}
              onChangeCategories={handleCategoriesChange}
              followerRange={followerRange}
              onChangeFollowerRange={handleFollowerRangeChange}
              onReset={handleReset}
            />
          )}
        </div>

        {/* Main Content Area */}
        <div className="flex-1 min-w-0">
          
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.01)]">
            <div className="flex items-center gap-6 text-sm font-semibold">
              <button 
                onClick={() => handleActiveTabChange("all")}
                className={cn(
                  "pb-1 transition-all border-b-2 hover:text-primary",
                  activeTab === "all" ? "border-primary text-primary" : "border-transparent text-gray-500"
                )}
              >
                All Influencers
              </button>
              <button 
                onClick={() => handleActiveTabChange("trending")}
                className={cn(
                  "pb-1 transition-all border-b-2 hover:text-primary",
                  activeTab === "trending" ? "border-primary text-primary" : "border-transparent text-gray-500"
                )}
              >
                Trending
              </button>
              <button 
                onClick={() => handleActiveTabChange("newest")}
                className={cn(
                  "pb-1 transition-all border-b-2 hover:text-primary",
                  activeTab === "newest" ? "border-primary text-primary" : "border-transparent text-gray-500"
                )}
              >
                Newest
              </button>
            </div>
            
            <div className="flex items-center gap-4 text-sm text-gray-500 justify-between sm:justify-end">
              {/* Desktop Toggle Button */}
              <button 
                onClick={handleToggleFilters}
                className="hidden md:flex items-center gap-1.5 px-3 py-1.5 hover:bg-gray-50 rounded-xl transition-colors border border-gray-100 font-semibold text-xs text-gray-600 active:scale-95"
                title={isDesktopSidebarOpen ? "Collapse sidebar filters" : "Expand sidebar filters"}
              >
                {isDesktopSidebarOpen ? (
                  <>
                    <EyeOff className="w-3.5 h-3.5" />
                    <span>Hide Filters</span>
                  </>
                ) : (
                  <>
                    <Eye className="w-3.5 h-3.5" />
                    <span>Show Filters</span>
                  </>
                )}
              </button>

              {activeTab !== "newest" && (
                <div className="flex items-center gap-1.5 border border-gray-100 px-3 py-1.5 rounded-xl bg-gray-50/50 hover:bg-white transition-colors">
                  <span className="text-xs font-semibold text-gray-400 uppercase">Sort By:</span>
                  <select 
                    value={sortBy}
                    onChange={(e) => handleSortByChange(e.target.value as SortOption)}
                    className="bg-transparent border-none p-0 focus:ring-0 cursor-pointer font-bold text-xs text-gray-700 outline-none text-right"
                    aria-label="Sort influencers"
                  >
                    <option>Most Followers</option>
                    <option>Highest Engagement</option>
                    <option>A - Z</option>
                  </select>
                </div>
              )}
            </div>
          </div>

          <div className="mb-6 text-left">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              Influencers
              <span className="text-xs font-bold bg-primary-light text-primary px-2.5 py-1 rounded-full uppercase tracking-wider">
                {platform === "all" ? "All Platforms" : platform}
              </span>
            </h2>
            <p className="text-sm text-gray-500 mt-1">Showing {filteredProfiles.length} of {allProfiles.length} influencers</p>
          </div>

          {isLoading ? (
            renderSkeletons()
          ) : (
            <>
              <ProfileList
                profiles={paginatedProfiles}
                platform={platform}
              />
              
              {filteredProfiles.length > visibleCount && (
                <div className="flex justify-center mt-6 pb-12">
                  <button
                    onClick={() => setVisibleCount((prev) => prev + 12)}
                    className="px-8 py-3.5 bg-white text-gray-700 font-bold border border-gray-200 rounded-2xl hover:bg-gray-50 active:scale-95 shadow-sm transition-all text-sm cursor-pointer"
                  >
                    Load More Influencers
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </Layout>
  );
}
