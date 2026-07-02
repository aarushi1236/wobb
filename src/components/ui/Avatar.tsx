import { useState } from "react";
import { cn } from "@/utils/cn";

interface AvatarProps {
  src?: string;
  alt: string;
  name: string;
  className?: string;
  platform?: string;
}

function getInitials(name: string): string {
  const cleanName = name.replace(/[@#]/g, "").trim();
  const parts = cleanName.split(/\s+/);
  if (parts.length === 0 || !parts[0]) return "?";
  if (parts.length === 1) {
    return parts[0].substring(0, Math.min(2, parts[0].length)).toUpperCase();
  }
  const firstInitial = parts[0][0] || "";
  const lastInitial = parts[parts.length - 1][0] || "";
  return (firstInitial + lastInitial).toUpperCase();
}

export function Avatar({ src, alt, name, className, platform }: AvatarProps) {
  const [hasError, setHasError] = useState(false);

  // Normalize platform key
  const normalizedPlatform = (platform || "").toLowerCase();

  // Platform specific gradients
  const getGradientClass = () => {
    switch (normalizedPlatform) {
      case "instagram":
        return "bg-gradient-to-br from-indigo-500 via-purple-500 via-pink-500 to-yellow-500 text-white";
      case "youtube":
        return "bg-gradient-to-br from-red-600 to-rose-500 text-white";
      case "tiktok":
        return "bg-gradient-to-br from-gray-900 via-slate-800 to-black text-cyan-400 border border-slate-700";
      default:
        return "bg-gradient-to-br from-violet-600 to-indigo-500 text-white";
    }
  };

  const initials = getInitials(name || alt);

  if (hasError || !src) {
    return (
      <div
        className={cn(
          "flex items-center justify-center font-bold select-none rounded-full shrink-0 shadow-inner",
          getGradientClass(),
          className
        )}
        aria-label={alt}
      >
        {initials}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={cn("rounded-full object-cover shrink-0", className)}
      onError={() => setHasError(true)}
      loading="lazy"
    />
  );
}
