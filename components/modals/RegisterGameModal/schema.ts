import { format } from "date-fns";
import { z } from "zod";

/** 한글, 영문, 공백만 허용하는 정규식 (자모음 포함) */
const RE_KOREAN_ENGLISH_SPACE = /^[a-zA-Z가-힣ㄱ-ㅎㅏ-ㅣ\s]*$/;

/** 경기 등록 폼 스키마 (zod + react-hook-form) */
export const registerGameSchema = z
  .object({
    matchType: z.enum(["MATCH", "INTERNAL"], {
      error: "경기 성격을 선택해주세요.",
    }),
    opponentName: z.string().max(30).regex(RE_KOREAN_ENGLISH_SPACE).optional(),
    startDate: z.string().min(1, "시작 날짜를 선택해주세요."),
    startTime: z.string().min(1, "시작 시간을 선택해주세요."),
    endDate: z.string(),
    endTime: z.string().min(1, "종료 시간을 선택해주세요."),
    venue: z.object({
      address: z
        .string()
        .min(1, "경기 장소를 입력해주세요.")
        .max(30)
        .regex(RE_KOREAN_ENGLISH_SPACE),
      latitude: z.number(),
      longitude: z.number(),
    }),
    quarterCount: z.coerce.number().int().min(1, "쿼터 수를 선택해주세요."),
    quarterDuration: z.coerce
      .number()
      .int()
      .min(1, "쿼터 시간을 선택해주세요."),
    voteDeadline: z.enum(
      [
        "SAME_DAY",
        "1_DAY_BEFORE",
        "2_DAYS_BEFORE",
        "3_DAYS_BEFORE",
        "1_WEEK_BEFORE",
      ],
      { error: "투표 마감 일정을 선택해주세요." },
    ),
    uniform: z.enum(["HOME", "AWAY"]).nullable(),
    memo: z.string().max(100).regex(RE_KOREAN_ENGLISH_SPACE).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.matchType === "MATCH") {
      if (!data.opponentName || data.opponentName.trim() === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "상대팀을 입력해주세요.",
          path: ["opponentName"],
        });
      }
      if (!data.uniform) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "유니폼을 선택해주세요.",
          path: ["uniform"],
        });
      }
    }
    if (data.endDate && data.startDate && data.endDate < data.startDate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "종료일은 시작일보다 이전일 수 없습니다.",
        path: ["endDate"],
      });
    }
  });

export type RegisterGameValues = z.infer<typeof registerGameSchema>;

/** 폼 기본값 (오늘 날짜, 오전 12:00 등) */
export function getRegisterGameDefaultValues(): RegisterGameValues {
  const today = format(new Date(), "yyyy-MM-dd");
  return {
    matchType: "MATCH",
    opponentName: "",
    startDate: today,
    startTime: "00:00",
    endDate: today,
    endTime: "00:00",
    venue: { address: "", latitude: 0, longitude: 0 },
    quarterCount: 4,
    quarterDuration: 25,
    voteDeadline: "1_DAY_BEFORE",
    uniform: null,
    memo: "",
  };
}
