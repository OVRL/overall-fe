"use client";

import { useMemo } from "react";
import { useLazyLoadQuery } from "react-relay";
import { useUserId } from "@/hooks/useUserId";
import { FindUserByIdQuery } from "@/lib/relay/queries/findUserByIdQuery";
import type { findUserByIdQuery } from "@/__generated__/findUserByIdQuery.graphql";
import PositionChip from "@/components/PositionChip";
import { Position } from "@/types/position";
import { formatRegionSearchDisplay } from "@/lib/region/formatRegionSearchDisplay";
import Button from "@/components/ui/Button";
import useModal from "@/hooks/useModal";
import { mapMemberToUserProfileEditInitial } from "@/components/modals/EditUserProfileModal/mapMemberToUserProfileEditInitial";
import type { ProfileTeamMemberRow } from "../types/profileTeamMemberTypes";

export default function ProfilePersonalRelaySection() {
  const userId = useUserId();

  if (userId === null) {
    return null;
  }

  return <ProfilePersonalRelayBody userId={userId} />;
}

function ProfilePersonalRelayBody({ userId }: { userId: number }) {
  const data = useLazyLoadQuery<findUserByIdQuery>(
    FindUserByIdQuery,
    { id: userId },
    { fetchPolicy: "store-or-network" },
  );

  const user = data.findUserById;

  const { openModal: openEditUserProfileModal } = useModal("EDIT_USER_PROFILE");

  const profileEditInitial = useMemo(() => {
    if (!user) return null;
    const mockMember = {
      user,
      foot: user.foot,
      profileImg: user.profileImage,
      introduction: "",
      preferredNumber: user.preferredNumber,
    } as unknown as ProfileTeamMemberRow;

    return mapMemberToUserProfileEditInitial(mockMember);
  }, [user]);

  if (!user) {
    return null;
  }

  const footText =
    user.foot === "L"
      ? "왼발"
      : user.foot === "R"
        ? "오른발"
        : user.foot === "B"
          ? "양발"
          : "정보 없음";

  const height = user.height ? `${user.height}cm` : "-";
  const weight = user.weight ? `${user.weight}kg` : "-";

  const activityAreaLabel =
    formatRegionSearchDisplay(user.region) || user.activityArea || "-";

  const bodyInfo = `${height} / ${weight} / ${footText}`;

  return (
    <div className="bg-gray-1300 flex flex-col items-start p-8 rounded-2xl shrink-0 w-full relative">
      <div className="flex flex-col gap-6 items-start w-full">
        <div className="relative shrink-0 w-full flex justify-between items-center">
          <p className="leading-[normal] not-italic relative shrink-0 text-2xl font-bold text-white whitespace-nowrap">
            {user.name || "—"}
          </p>
          <Button
            size="m"
            variant="ghost"
            className="w-fit px-3 py-2 rounded-lg"
            onClick={() =>
              openEditUserProfileModal({ initial: profileEditInitial! })
            }
          >
            수정하기
          </Button>
        </div>

        <div className="flex flex-col gap-6 items-start w-full md:w-[427px]">
          {/* Main Position */}
          <div className="flex gap-2 items-center w-full">
            <p className="leading-[normal] not-italic shrink-0 text-sm text-gray-500 w-20">
              메인 포지션
            </p>
            {user.mainPosition ? (
              <PositionChip position={user.mainPosition as Position} />
            ) : (
              <span className="text-gray-500 text-sm">-</span>
            )}
          </div>

          {/* Sub Position */}
          <div className="flex gap-2 items-center w-full">
            <p className="leading-[normal] not-italic shrink-0 text-sm text-gray-500 w-20">
              서브 포지션
            </p>
            <div className="flex gap-2 items-center flex-wrap">
              {user.subPositions && user.subPositions.length > 0 ? (
                user.subPositions.map((pos, idx) => (
                  <PositionChip key={idx} position={pos as Position} />
                ))
              ) : (
                <span className="text-gray-500 text-sm">-</span>
              )}
            </div>
          </div>

          {/* Activity Area */}
          <div className="flex gap-3 items-center w-full">
            <p className="leading-[normal] not-italic shrink-0 text-sm text-gray-500 w-20">
              활동 지역
            </p>
            <p className="text-white text-sm">{activityAreaLabel}</p>
          </div>

          {/* Body Info */}
          <div className="flex gap-3 items-center w-full">
            <p className="leading-[normal] not-italic shrink-0 text-sm text-gray-500 w-20">
              신체
            </p>
            <p className="text-white text-sm">{bodyInfo}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
