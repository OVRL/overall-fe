"use client";

import ModalLayout from "./ModalLayout";
import MatchInfoRow from "../formation/MatchScheduleCard/MatchInfoRow";
import Image from "next/image";
import Button from "../ui/Button";
import useModal from "@/hooks/useModal";
import { getUniformImagePath } from "@/app/create-team/_lib/uniformDesign";
import Icon from "../ui/Icon";
import chevronRight from "@/public/icons/chevron_right.svg";
const AttendanceVoteModal = () => {
  const { hideModal } = useModal();

  return (
    <ModalLayout
      title="참석 투표하기"
      wrapperClassName="md:w-110 gap-y-3 h-145.5"
    >
      <div className="flex flex-col gap-3">
        {/* 매칭 상대 */}
        <MatchInfoRow title="매칭 상대" direction="column">
          <div className="flex items-center gap-1">
            <div className="relative w-7.5 h-7.5 rounded-full overflow-hidden bg-surface-secondary">
              <Image
                src="/images/logo_OVR_head.png" // 일단 기본 로고 사용
                alt="opponent logo"
                fill
                sizes="1.875rem"
                className="object-contain p-1"
              />
            </div>
            <span className="text-[#F7F8F8] font-semibold text-sm">
              FC 빠름셀로나
            </span>
            <span className="text-Label-Tertiary text-[0.8125rem]">
              전적 2승 1무 1패
            </span>
          </div>
        </MatchInfoRow>

        {/* 경기 일정 */}
        <MatchInfoRow title="경기 일정" direction="column">
          <span className="text-[#F7F8F8] font-semibold text-sm">
            2024년 3월 15일(금) 20:00
          </span>
        </MatchInfoRow>

        {/* 경기 구장 */}
        <MatchInfoRow title="경기 구장" direction="column">
          <div className="flex gap-3 items-center">
            <span className="text-[#F7F8F8] text-sm font-semibold">
              서울 월드컵 보조경기장
            </span>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="xs" className="w-fit px-3 h-7.5">
                지도
              </Button>
              <Button variant="ghost" size="xs" className="w-fit px-3 h-7.5">
                주소 복사
              </Button>
            </div>
          </div>
        </MatchInfoRow>

        {/* 유니폼 */}
        <MatchInfoRow title="유니폼">
          <div className="flex items-center gap-2 h-7.5">
            <div className="relative w-7.5 h-7.5 shrink-0">
              <Image
                src={getUniformImagePath("SOLID_RED")}
                alt="유니폼"
                fill
                sizes="1.875rem"
                quality={100}
                className="object-contain"
                aria-hidden
              />
            </div>
            <span className="text-white text-sm whitespace-nowrap">
              홈 (화이트)
            </span>
          </div>
        </MatchInfoRow>

        {/* 메모 */}
        <MatchInfoRow title="메모" direction="column">
          <span className="text-white text-sm leading-relaxed">
            경기 시작 30분 전까지 집결 바랍니다. 주차비는 각자 부담입니다.
          </span>
        </MatchInfoRow>
      </div>
      <div className="flex flex-col flex-1 justify-end">
        <div className="flex gap-3 h-14 mb-3">
          <Button
            variant="ghost"
            size="xl"
            className="flex-1"
            onClick={hideModal}
          >
            닫기
          </Button>
          <Button
            variant="primary"
            size="xl"
            className="flex-1 bg-red-500 text-Label-Primary"
            onClick={() => {
              alert("투표 기능은 준비 중입니다.");
              hideModal();
            }}
          >
            참석
          </Button>
        </div>
        <div className="flex justify-end">
          <span className="text-[#F7F8F8] text-sm font-semibold flex items-center">
            10명 참석, 6명 불참 <Icon src={chevronRight} />
          </span>
        </div>
      </div>
    </ModalLayout>
  );
};

export default AttendanceVoteModal;
