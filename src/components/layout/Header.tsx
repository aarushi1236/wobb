import { Search, Heart, User, Globe, SlidersHorizontal } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useListStore } from "@/store/useListStore";

interface HeaderProps {
  onOpenDrawer: () => void;
  onToggleFilters?: () => void;
  searchQuery?: string;
  onSearchChange?: (q: string) => void;
}

export function Header({ onOpenDrawer, onToggleFilters, searchQuery, onSearchChange }: HeaderProps) {
  // Optimize store selectors to avoid whole store subscription
  const selectedCount = useListStore((state) => state.selectedProfiles.length);
  const location = useLocation();

  const isSearchPage = location.pathname === "/";

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-40 px-4 md:px-8 py-4 flex items-center justify-between">
      {/* Logo and Filter Toggle */}
      <div className="flex items-center gap-3">
        {isSearchPage && onToggleFilters && (
          <button 
            onClick={onToggleFilters}
            aria-label="Open filters"
            className="bg-primary hover:bg-primary-hover text-white p-2.5 rounded-xl transition-all hover:scale-105 active:scale-95 shadow-sm shadow-primary/20 flex items-center justify-center focus:outline-none"
          >
            <SlidersHorizontal className="w-4.5 h-4.5" />
          </button>
        )}
        <Link to="/" className="text-xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
          InflueSearch
        </Link>
      </div>

      {/* Search Bar (Visible mainly on Search Page) */}
      {isSearchPage && onSearchChange !== undefined && (
        <div className="hidden md:flex flex-1 max-w-2xl mx-8 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="search"
            placeholder="Search influencers by name or username..."
            aria-label="Search influencers"
            className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-full bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-sm shadow-inner"
            value={searchQuery || ""}
            onChange={(e) => onSearchChange?.(e.target.value)}
          />
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-4 text-gray-600">
        <button 
          onClick={onOpenDrawer}
          aria-label={`Open selected list${selectedCount > 0 ? ` (${selectedCount} selected)` : ""}`}
          className="relative p-2.5 hover:bg-gray-50 rounded-xl transition-colors border border-transparent hover:border-gray-100"
        >
          <Heart className="w-5 h-5 text-gray-600" />
          {selectedCount > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 bg-orange-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border border-white">
              {selectedCount}
            </span>
          )}
        </button>
        <button className="hidden sm:block p-2.5 hover:bg-gray-50 rounded-xl transition-colors border border-transparent hover:border-gray-100" aria-label="User Profile">
          <User className="w-5 h-5" />
        </button>
        <div className="hidden sm:flex items-center gap-1 p-2 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer text-sm font-semibold text-gray-600">
          <Globe className="w-4 h-4" />
          EN
        </div>
      </div>
    </header>
  );
}
