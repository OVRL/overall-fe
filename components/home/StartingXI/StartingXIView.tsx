"use client";

import { MotionConfig, motion } from "framer-motion";
import { Player } from "@/types/player";
import Icon from "@/components/ui/Icon";
import { SelectedTeamBadge } from "@/components/home/SelectedTeamBadge";
import bestXI from "@/public/icons/bestXI.svg";
import FormationField from "./FormationField";
import ManagerInfo from "./ManagerInfo";
import AdBoard from "./AdBoard";
import {
  startingXIRootVariants,
  startingXISectionVariants,
} from "./motion-variants";

export interface StartingXIProps {
  players: Player[];
  /** layout SSR findManyTeamMember 기반. 팀원 1명이면 true (온보딩 분기용) */
  isSoloTeam: boolean;
  onPlayersChange: (players: Player[]) => void;
  onPlayerSelect?: (player: Player) => void;
}

/**
 * 베스트 XI 카드 — 모션은 클라이언트 경계에서만 적용 (서버 컴포넌트 StartingXI가 래핑)
 */
export default function StartingXIView({
  players,
  isSoloTeam,
}: StartingXIProps) {
  return (
    <MotionConfig reducedMotion="user">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "0px 0px -12% 0px" }}
        variants={startingXIRootVariants}
        className="bg-surface-card rounded-[1.25rem] p-4 sm:px-0 md:p-6 flex-1 border border-border-card flex flex-col justify-between"
      >
        <motion.div
          variants={startingXISectionVariants}
          className="flex items-center justify-between mb-4 md:mb-5 px-4 md:px-0"
        >
          <Icon src={bestXI} alt="Best XI" width={95} height={34} nofill />
          <SelectedTeamBadge />
        </motion.div>

        <motion.div variants={startingXISectionVariants} className="flex flex-col flex-1">
          <div className="relative h-9.5">
            <AdBoard
              imageUrl="/images/logo_OVR_head.png"
              linkUrl="#"
              altText="OVR Ad Banner"
              className="w-31 absolute left-3 sm:left-2 md:left-1/6 lg:left-1/5"
            />
            <AdBoard
              linkUrl="#"
              altText="OVR Ad Banner"
              className="w-31 absolute right-3 sm:right-2 md:right-1/6 lg:right-1/5"
            />
          </div>
          <FormationField
            players={players}
            isSoloTeam={isSoloTeam}
            className="relative md:aspect-video"
          />
        </motion.div>

        <motion.div variants={startingXISectionVariants}>
          <ManagerInfo isSoloTeam={isSoloTeam} />
        </motion.div>
      </motion.div>
    </MotionConfig>
  );
}
