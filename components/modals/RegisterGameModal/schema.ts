import { format } from "date-fns";
import { z } from "zod";

/** 경기 등록 폼 스키마 (zod + react-hook-form) */
export const registerGameSchema = z
  .object({
    gameType: z.enum(["MATCH", "INTERNAL"], {
      error: "경기 성격을 선택해주세요.",
    }),
    opponentName: z.string().min(1, "상대팀을 입력해주세요."),
    startDate: z.string().min(1, "시작 날짜를 선택해주세요."),
    startTime: z.string().min(1, "시작 시간을 선택해주세요."),
    endDate: z.string(),
    endTime: z.string().min(1, "종료 시간을 선택해주세요."),
    venue: z.string().min(1, "경기 장소를 입력해주세요."),
    quarterCount: z.string().min(1, "쿼터 수를 선택해주세요."),
    quarterDuration: z.string().min(1, "쿼터 시간을 선택해주세요."),
    voteDeadline: z.string().min(1, "투표 마감 일정을 선택해주세요."),
    uniform: z.enum(["HOME", "AWAY"], {
      error: "유니폼을 선택해주세요.",
    }),
    memo: z.string().optional(),
  })
  .refine(
    (data) => {
      if (!data.endDate) return true;
      return data.endDate >= data.startDate;
    },
    { message: "종료일은 시작일보다 이전일 수 없습니다.", path: ["endDate"] },
  );

export type RegisterGameValues = z.infer<typeof registerGameSchema>;

/** 폼 기본값 (오늘 날짜, 오전 12:00 등) */
export function getRegisterGameDefaultValues(): RegisterGameValues {
  const today = format(new Date(), "yyyy-MM-dd");
  return {
    gameType: "MATCH",
    opponentName: "",
    startDate: today,
    startTime: "00:00",
    endDate: today,
    endTime: "00:00",
    venue: "",
    quarterCount: "4",
    quarterDuration: "25",
    voteDeadline: "1_DAY_BEFORE",
    uniform: "AWAY",
    memo: "",
  };
}
