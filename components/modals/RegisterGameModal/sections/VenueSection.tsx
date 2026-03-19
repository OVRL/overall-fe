"use client";

import dynamic from "next/dynamic";
import { Controller, Control } from "react-hook-form";
import TextField from "@/components/ui/TextField";
import location from "@/public/icons/location.svg";
import type { RegisterGameValues } from "../schema";
import { getVenueErrorMessage } from "../lib/getVenueErrorMessage";

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

interface VenueSectionProps {
  control: Control<RegisterGameValues>;
  currentVenue: RegisterGameValues["venue"] | undefined;
  onAddressClick: () => void;
}

export function VenueSection({
  control,
  currentVenue,
  onAddressClick,
}: VenueSectionProps) {
  return (
    <Controller
      name="venue"
      control={control}
      render={({ field, fieldState }) => (
        <div className="flex flex-col gap-4">
          <button
            type="button"
            onClick={onAddressClick}
            className="w-full text-left cursor-pointer"
          >
            <TextField
              label="경기 장소"
              placeholder="경기 장소를 검색하세요"
              className="text-Fill_Primary pointer-events-none"
              showBorderBottom={false}
              leftIcon={location}
              errorMessage={getVenueErrorMessage(fieldState.error)}
              value={field.value?.address || ""}
              name={field.name}
              readOnly
            />
          </button>
          {currentVenue?.latitude !== undefined &&
            currentVenue?.longitude !== undefined &&
            currentVenue.latitude !== 0 &&
            currentVenue.longitude !== 0 && (
              <NaverDynamicMap
                latitude={currentVenue.latitude}
                longitude={currentVenue.longitude}
              />
            )}
        </div>
      )}
    />
  );
}
