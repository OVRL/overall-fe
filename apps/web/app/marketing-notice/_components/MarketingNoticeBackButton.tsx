"use client";

import { useBridgeRouter } from "@/hooks/bridge/useBridgeRouter";
import Icon from "@/components/ui/Icon";
import arrowBack from "@/public/icons/arrow_back.svg";

export default function MarketingNoticeBackButton() {
  const router = useBridgeRouter();

  return (
    <button
      type="button"
      onClick={() => router.back()}
      className="text-sm hover:opacity-90"
      aria-label="뒤로가기"
    >
      <Icon src={arrowBack} alt="" />
    </button>
  );
}
