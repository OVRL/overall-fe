"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { fetchQuery } from "relay-runtime";
import { useRelayEnvironment } from "react-relay";
import Button, { buttonVariants } from "../ui/Button";
import Link from "../Link";
import { cn } from "@/lib/utils";
import useModal from "@/hooks/useModal";
import { getGraphQLErrorMessage } from "@/lib/relay/getGraphQLErrorMessage";
import { observableToPromise } from "@/lib/relay/observableToPromise";
import { FindTeamByInviteCodeQuery } from "@/lib/relay/queries/findTeamByInviteCodeQuery";
import { toast } from "@/lib/toast";

const LandingStartForm = () => {
  const [inviteCode, setInviteCode] = useState("");
  const [isOpeningTeamModal, setIsOpeningTeamModal] = useState(false);
  const environment = useRelayEnvironment();
  const { openModal } = useModal("TEAM_INFO");
  const mountedRef = useRef(true);
  const submitLockRef = useRef(false);

  // next/dynamic 청크를 랜딩 진입 시 미리 받아 두어, 제출 시와 병렬로 기다릴 때 유리하게 함
  useEffect(() => {
    void import("@/components/modals/TeamInfoModal/TeamInfoModal");
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const canSubmit = inviteCode.trim().length > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const code = inviteCode.trim();
    if (!code || isOpeningTeamModal || submitLockRef.current) return;

    submitLockRef.current = true;
    void (async () => {
      setIsOpeningTeamModal(true);
      try {
        // 모달 청크 + 팀 조회를 병렬로 끝낸 뒤 스토어에 데이터가 있을 때만 모달을 열어, 스피너 한 번에 본문까지 표시
        await Promise.all([
          import("@/components/modals/TeamInfoModal/TeamInfoModal"),
          observableToPromise(
            fetchQuery(
              environment,
              FindTeamByInviteCodeQuery,
              { inviteCode: code },
              { fetchPolicy: "network-only" },
            ),
          ),
        ]);
        if (!mountedRef.current) return;
        openModal({ inviteCode: code, prefetchedAtOpen: true });
      } catch (err) {
        if (mountedRef.current) {
          toast.error(getGraphQLErrorMessage(err));
        }
      } finally {
        submitLockRef.current = false;
        if (mountedRef.current) {
          setIsOpeningTeamModal(false);
        }
      }
    })();
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.5 }}
      className="w-full max-w-xl bg-surface-card/80 border backdrop-blur-md border-border-card rounded-2xl py-8.25 px-6 flex flex-col items-center gap-6 shadow-2xl text-center"
      onSubmit={handleSubmit}
    >
      <h1 className="text-3xl sm:text-4xl md:text-[2.5rem] font-bold text-white leading-tight font-paperlogy">
        완전히 새로워질
        <br />
        <span className="text-Fill_AccentPrimary">축구 관리 플랫폼</span>
      </h1>
      <p className="text-[oklch(0.7_0_0)] text-sm sm:text-base leading-6 font-pretendard">
        팀 코드를 입력하여 시작하세요
      </p>
      <div className="w-full flex flex-col gap-4 font-pretendard">
        <div className="flex flex-col gap-2 text-left">
          <label
            htmlFor="invite-code"
            className="text-white font-medium leading-6 "
          >
            팀 코드
          </label>
          <input
            id="invite-code"
            name="inviteCode"
            type="text"
            placeholder="예: TEAM2025"
            value={inviteCode}
            onChange={(e) => setInviteCode(e.target.value)}
            className="h-12.5 bg-surface-elevated rounded-[0.625rem] w-full flex items-center px-4 py-3 text-white border border-border-card"
          />
        </div>
      </div>
      <Button
        type="submit"
        size="xl"
        variant={canSubmit ? "primary" : "ghost"}
        disabled={!canSubmit || isOpeningTeamModal}
        aria-busy={isOpeningTeamModal}
        aria-label={
          isOpeningTeamModal ? "팀 정보를 불러오는 중입니다." : undefined
        }
      >
        가입 신청하기
      </Button>

      <div className="border-border-card w-full font-pretendard">
        <p className="text-[oklch(0.7_0_0)] text-sm leading-5 mb-4">
          아직 팀이 없으신가요?
        </p>
        <Link
          href="/create-team"
          className={cn(
            buttonVariants({ variant: "line", size: "xl" }),
            "w-full text-white border border-[#555555]/70",
          )}
        >
          클럽 만들기
        </Link>
      </div>
    </motion.form>
  );
};

export default LandingStartForm;
