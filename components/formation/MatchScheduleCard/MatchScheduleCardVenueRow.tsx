"use client";

import Button from "@/components/ui/Button";
import useModal from "@/hooks/useModal";
import type { MatchScheduleVenueInput } from "@/lib/formation/matchToScheduleCardProps";
import { toast } from "@/lib/toast";

type MatchScheduleCardVenueRowProps = {
  venue: MatchScheduleVenueInput;
};

/**
 * 경기 구장 주소 + 지도(모달) / 주소 복사 버튼.
 * 인라인 지도는 쓰지 않고 Modal 레지스트리로만 지도를 띄웁니다.
 */
export function MatchScheduleCardVenueRow({
  venue,
}: MatchScheduleCardVenueRowProps) {
  const { openModal } = useModal("FORMATION_VENUE_MAP");

  const handleMapClick = () => {
    openModal({
      address: venue.address,
      latitude: venue.latitude,
      longitude: venue.longitude,
    });
  };

  const handleCopyAddress = async () => {
    if (venue.address === "") return;
    try {
      await navigator.clipboard.writeText(venue.address);
      toast.success("주소가 복사되었습니다");
    } catch {
      toast.error("주소를 복사하지 못했습니다");
    }
  };

  return (
    <div className="flex flex-col gap-2 w-full max-w-sm">
      <div className="flex gap-3 items-center flex-wrap">
        <span className="text-sm font-semibold text-[#f7f8f8]">
          {venue.address}
        </span>
        <div className="flex flex-1 gap-2 min-w-0">
          <Button
            type="button"
            variant="ghost"
            size="xs"
            className="px-3 text-Label-Tertiary"
            onClick={handleMapClick}
          >
            지도
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="xs"
            className="whitespace-nowrap w-fit px-3 text-Label-Tertiary"
            onClick={handleCopyAddress}
          >
            주소 복사
          </Button>
        </div>
      </div>
    </div>
  );
}
