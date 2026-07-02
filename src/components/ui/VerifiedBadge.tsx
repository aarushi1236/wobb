import { BadgeCheck } from "lucide-react";

interface VerifiedBadgeProps {
  verified: boolean;
}

export function VerifiedBadge({ verified }: VerifiedBadgeProps) {
  if (!verified) return null;
  return (
    <BadgeCheck
      className="w-5 h-5 text-blue-500 fill-blue-100 ml-1 inline-block flex-shrink-0"
      aria-label="Verified account"
    />
  );
}
