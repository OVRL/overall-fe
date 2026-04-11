"use client";

import { useState } from "react";
import { useBridgeRouter } from "@/hooks/bridge/useBridgeRouter";
import { motion } from "motion/react";
import Button, { buttonVariants } from "../ui/Button";
import Link from "../Link";
import { cn } from "@/lib/utils";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { useUserStore } from "@/contexts/UserContext";
import { useCreateTeamMemberMutation } from "./_hooks/useCreateTeamMemberMutation";
import { getGraphQLErrorMessage } from "@/lib/relay/getGraphQLErrorMessage";
import { toast } from "@/lib/toast";

const LandingStartForm = () => {
  const router = useBridgeRouter();
  const user = useUserStore((state) => state.user);
  const [inviteCode, setInviteCode] = useState("");
  const { executeMutation, isInFlight } = useCreateTeamMemberMutation();

  const canSubmit = inviteCode.trim().length > 0 && !isInFlight;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!user?.email) return;
    const code = inviteCode.trim();
    if (!code) return;

    executeMutation({
      variables: {
        input: {
          email: user.email,
          inviteCode: code,
        },
      },
      onCompleted: () => {
        try {
          router.replace("/");
        } catch (err) {
          // 프로덕션 빌드에서 Minified exception 대신 실제 에러 확인용
          console.error("[LandingStartForm] onCompleted 에러:", err);
          toast.error(
            err instanceof Error
              ? err.message
              : "페이지 이동 중 오류가 발생했습니다.",
          );
        }
      },
      onError: (error) => {
        toast.error(
          getGraphQLErrorMessage(error, "팀 가입에 실패했습니다."),
        );
      },
    });
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
        disabled={!canSubmit}
      >
        {isInFlight ? (
          <LoadingSpinner label="가입 중입니다." size="sm" />
        ) : (
          "시작하기"
        )}
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
