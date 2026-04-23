"use client";

import ProfileAvatar from "@/components/ui/ProfileAvatar";
import { getFormationPlayerProfileAvatarUrls } from "@/lib/formation/formationPlayerProfileAvatarUrls";
import type { Player } from "@/types/formation";

/** 명단→보드 드래그 시 DragOverlay에 쓰는 아바타 (모바일·데스크톱 공통) */
export function FormationDragOverlayAvatar({ player }: { player: Player }) {
  const { src, fallbackSrc } = getFormationPlayerProfileAvatarUrls(player);
  return (
    <div className="rounded-full flex w-12 h-12 items-center justify-center bg-black/30 border-2 border-[#B8FF12]/30 overflow-hidden cursor-grabbing">
      <ProfileAvatar
        src={src}
        fallbackSrc={fallbackSrc}
        alt={player.name}
        size={48}
      />
    </div>
  );
}
