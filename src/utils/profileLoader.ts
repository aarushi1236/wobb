import type { ProfileDetailResponse } from "@/types";

const profileModules = import.meta.glob<ProfileDetailResponse>(
  "../assets/data/profiles/*.json"
);

export async function loadProfileByUsername(
  username: string
): Promise<ProfileDetailResponse | null> {
  const targetPath = `../assets/data/profiles/${username.toLowerCase()}.json`;
  const matchingKey = Object.keys(profileModules).find((key) => key.toLowerCase() === targetPath);
  const loader = matchingKey ? profileModules[matchingKey] : null;

  if (!loader) {
    return null;
  }

  const result = await loader();
  const data =
    (result as { default?: ProfileDetailResponse }).default ?? result;
  return data as ProfileDetailResponse;
}
