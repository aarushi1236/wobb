import { PLATFORMS, getPlatformLabel, formatFollowers, cn } from "@/utils";
import type { Platform } from "@/types";
import { Check, RotateCcw } from "lucide-react";
import { useState } from "react";
import { CATEGORIES, FOLLOWER_SLIDER_MULTIPLIER, RESET_FLASH_DURATION_MS } from "@/constants";

// Re-export so other files that previously imported CATEGORIES from Sidebar still work
export { CATEGORIES };

interface SidebarProps {
  selectedPlatform: Platform;
  onChangePlatform: (platform: Platform) => void;
  selectedCategories: string[];
  onChangeCategories: (categories: string[]) => void;
  followerRange: number;
  onChangeFollowerRange: (val: number) => void;
  onReset: () => void;
}

export function Sidebar({ 
  selectedPlatform, 
  onChangePlatform, 
  selectedCategories,
  onChangeCategories,
  followerRange,
  onChangeFollowerRange,
  onReset
}: SidebarProps) {
  const [flashing, setFlashing] = useState(false);

  const handleReset = () => {
    onReset();
    setFlashing(true);
    setTimeout(() => setFlashing(false), RESET_FLASH_DURATION_MS);
  };

  const toggleCategory = (cat: string) => {
    if (selectedCategories.includes(cat)) {
      onChangeCategories(selectedCategories.filter(c => c !== cat));
    } else {
      onChangeCategories([...selectedCategories, cat]);
    }
  };

  return (
    <aside className="w-full space-y-6">
      <div>
        <h3 className="font-bold text-lg mb-4">Filter Option</h3>
        
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center justify-between">
              Platform
            </h4>
            <div className="space-y-2">
              {PLATFORMS.map((p) => (
                <button
                  key={p}
                  onClick={() => onChangePlatform(p)}
                  className={`w-full flex items-center justify-between text-sm py-1.5 px-2 rounded-md transition-colors ${
                    selectedPlatform === p 
                      ? "text-primary font-medium bg-primary-light/50" 
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <span>{getPlatformLabel(p)}</span>
                  {selectedPlatform === p && <Check className="w-4 h-4" />}
                </button>
              ))}
            </div>
          </div>
          
          <div className="pt-4 border-t border-gray-100">
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Categories</h4>
            <div className="grid grid-cols-2 gap-2">
              {CATEGORIES.map(cat => (
                <label key={cat} className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="rounded text-primary focus:ring-primary accent-primary" 
                    checked={selectedCategories.includes(cat)}
                    onChange={() => toggleCategory(cat)}
                  />
                  {cat}
                </label>
              ))}
            </div>
          </div>
          
          <div className="pt-4 border-t border-gray-100">
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Min Followers</h4>
            <input 
              type="range" 
              className="w-full accent-primary" 
              min="0" 
              max="100" 
              value={followerRange}
              onChange={(e) => onChangeFollowerRange(Number(e.target.value))}
              aria-label="Minimum followers"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>0</span>
              <span className="font-medium text-primary">{followerRange === 0 ? "Any" : formatFollowers(followerRange * FOLLOWER_SLIDER_MULTIPLIER) + "+"}</span>
              <span>1B+</span>
            </div>
          </div>

          <button 
            onClick={handleReset}
            className={cn(
              "w-full py-2.5 rounded-lg text-sm font-semibold mt-6 flex items-center justify-center gap-2 transition-all duration-200 active:scale-95",
              flashing
                ? "bg-primary text-white shadow-md"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            )}
          >
            {flashing
              ? <><Check className="w-4 h-4" /> Cleared!</>
              : <><RotateCcw className="w-4 h-4" /> Reset Filter</>
            }
          </button>
        </div>
      </div>
    </aside>
  );
}
