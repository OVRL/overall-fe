"use client";

import dynamic from "next/dynamic";
import ModalLayout from "./ModalLayout";

const NaverDynamicMap = dynamic(
  () => import("@/components/ui/map/NaverDynamicMap"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full max-w-sm aspect-square mx-auto rounded-[0.625rem] bg-Fill_Tertiary flex items-center justify-center text-Label-Tertiary text-sm">
        지도 정보를 불러오는 중...
      </div>
    ),
  },
);

export type FormationVenueMapModalProps = {
  address: string;
  latitude: number;
  longitude: number;
};

/**
 * 포메이션 경기 카드 등에서 "지도" 클릭 시 주소 + 네이버 지도를 표시합니다.
 */
export default function FormationVenueMapModal({
  address,
  latitude,
  longitude,
}: FormationVenueMapModalProps) {
  const showMap =
    latitude !== 0 &&
    longitude !== 0 &&
    !Number.isNaN(latitude) &&
    !Number.isNaN(longitude);

  return (
    <ModalLayout title="경기 장소" wrapperClassName="max-w-md w-full md:max-w-lg">
      <div className="flex flex-col gap-4 px-1 pb-2">
        <p className="text-sm font-medium text-[#f7f8f8]">{address}</p>
        {showMap ? (
          <div className="w-full max-w-sm mx-auto rounded-xl overflow-hidden">
            <NaverDynamicMap latitude={latitude} longitude={longitude} />
          </div>
        ) : (
          <p className="text-sm text-Label-Tertiary text-center py-6">
            표시할 지도 좌표가 없습니다.
          </p>
        )}
      </div>
    </ModalLayout>
  );
}
