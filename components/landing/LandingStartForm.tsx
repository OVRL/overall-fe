import { motion } from "motion/react";
import Button from "../ui/Button";

const LandingStartForm = () => {
  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.5 }}
      className="w-full max-w-xl bg-surface-card/80 border backdrop-blur-md border-border-card rounded-2xl py-8.25 px-6 flex flex-col items-center gap-6 shadow-2xl text-center"
      onSubmit={(e) => {
        e.preventDefault();
        // TODO: 팀 코드 제출 로직 추가
      }}
    >
      <h1 className="text-[2.5rem] font-bold text-white leading-tight font-paperlogy">
        완전히 새로워질
        <br />
        <span className="text-Fill_AccentPrimary">축구 관리 플랫폼</span>
      </h1>
      <p className="text-[oklch(0.7_0_0)] text-base leading-6 font-pretendard">
        팀 코드를 입력하여 시작하세요
      </p>
      <div className="w-full flex flex-col gap-4 font-pretendard">
        <div className="flex flex-col gap-2 text-left">
          <label className="text-white font-medium leading-6 ">팀 코드</label>
          <input
            type="text"
            placeholder="예: TEAM2025"
            className="h-12.5 bg-surface-elevated rounded-[0.625rem] w-full flex items-center px-4 py-3 text-white border border-border-card"
          />
        </div>
      </div>
      <Button type="submit" size="xl" variant="primary">
        시작하기
      </Button>

      <div className="border-border-card w-full font-pretendard">
        <p className="text-[oklch(0.7_0_0)] text-sm leading-5 mb-4">
          아직 팀이 없으신가요?
        </p>
        <Button
          type="button"
          variant="line"
          size="xl"
          className="w-full text-white border border-[#555555]/70"
        >
          클럽 만들기
        </Button>
      </div>
    </motion.form>
  );
};

export default LandingStartForm;
