import { X, Trash2 } from "lucide-react";
import { useListStore, useToastStore } from "@/store";
import { cn, formatFollowers } from "@/utils";
import { Link } from "react-router-dom";
import { Avatar } from "../ui";


interface SelectedListDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SelectedListDrawer({ isOpen, onClose }: SelectedListDrawerProps) {
  // Optimize store selectors to avoid whole store subscription
  const selectedProfiles = useListStore((state) => state.selectedProfiles);
  const removeProfile = useListStore((state) => state.removeProfile);
  
  // Toast notifications
  const addToast = useToastStore((state) => state.addToast);

  const handleRemove = (userId: string, username: string) => {
    removeProfile(userId);
    addToast(`Removed @${username} from your list`, "info");
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div 
        className={cn(
          "fixed top-0 right-0 h-full w-full max-w-sm bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-lg font-bold">Selected Influencers ({selectedProfiles.length})</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full" aria-label="Close drawer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {selectedProfiles.length === 0 ? (
            <div className="text-center text-gray-500 mt-10">
              <p>Your list is empty.</p>
              <p className="text-sm mt-2">Click the heart icon on profiles to add them here.</p>
            </div>
          ) : (
            selectedProfiles.map(profile => (
              <div key={profile.user_id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                <Avatar 
                  src={profile.picture} 
                  alt={profile.username}
                  name={profile.fullname || profile.username}
                  platform={profile.platform}
                  className="w-12 h-12 rounded-full object-cover text-[10px]"
                />
                
                <div className="flex-1 min-w-0">
                  <Link 
                    to={`/profile/${profile.username}?platform=${profile.platform || 'unknown'}`}
                    onClick={onClose}
                    className="font-semibold text-sm truncate hover:text-primary transition-colors block text-left"
                  >
                    {profile.fullname || profile.username}
                  </Link>
                  <p className="text-xs text-gray-500 truncate text-left">@{profile.username}</p>
                  <p className="text-xs font-medium text-primary mt-0.5 text-left">{formatFollowers(profile.followers)} followers</p>
                </div>
                
                <button 
                  onClick={() => handleRemove(profile.user_id, profile.username)}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                  title="Remove from list"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
