import type { Player } from "@/types/formation";
import { getPlayerPlaceholderSrc } from "@/lib/playerPlaceholderImage";

/**
 * 포메이션 `Player` → `ProfileAvatar`의 `src` / `fallbackSrc` (명단 행·드래그 오버레이 공통).
 */
export function getFormationPlayerProfileAvatarUrls(player: Player): {
  src: string | undefined;
  fallbackSrc: string;
} {
  const profileRawUrl = (player.image ?? "").trim();
  const profileFallbackSrc =
    (player.imageFallbackUrl ?? "").trim() ||
    getPlayerPlaceholderSrc(`m:${player.id}`);
  return {
    src: profileRawUrl || undefined,
    fallbackSrc: profileFallbackSrc,
  };
}
