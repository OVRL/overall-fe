import { format } from "date-fns";
import { z } from "zod";

/** 한글, 영문, 공백만 허용하는 정규식 (자모음 포함) */
const RE_KOREAN_ENGLISH_SPACE = /^[a-zA-Z가-힣ㄱ-ㅎㅏ-ㅣ\s]*$/;

/** 주소용 정규식 — 한글, 영문, 공백, 숫자, 하이픈 허용 (네이버 API 주소 형식) */
const RE_ADDRESS = /^[a-zA-Z가-힣ㄱ-ㅎㅏ-ㅣ\s0-9\-]*$/;

/**
 * 경기 등록 폼 스키마 (zod + react-hook-form).
 * 필드명은 GraphQL CreateMatchInput / 스키마와 맞춰 유지합니다.
 */
export const registerGameSchema = z
  .object({
    matchType: z.enum(["MATCH", "INTERNAL"], {
      error: "경기 성격을 선택해주세요.",
    }),
    opponentName: z.string().max(30).regex(RE_KOREAN_ENGLISH_SPACE).optional(),
    /** 경기 시작일 (matchDate로 전송) */
    startDate: z.string().min(1, "시작 날짜를 선택해주세요."),
    startTime: z.string().min(1, "시작 시간을 선택해주세요."),
    /** 유효성 검사용. API에는 endTime만 전송 */
    endDate: z.string(),
    endTime: z.string().min(1, "종료 시간을 선택해주세요."),
    venue: z.object({
      address: z
        .string()
        .min(1, "경기 장소를 입력해주세요.")
        .max(100)
        .regex(RE_ADDRESS, "주소 형식이 올바르지 않습니다."),
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
    /** CreateMatchInput.uniformType */
    uniformType: z.enum(["HOME", "AWAY"]).nullable(),
    /** CreateMatchInput.description (특수문자 허용) */
    description: z.string().max(100).optional(),
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
      if (!data.uniformType) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "유니폼을 선택해주세요.",
          path: ["uniformType"],
        });
      }
    }
    // 스키마에는 matchDate, startTime, endTime만 있음. 폼의 startDate/endDate는 유효성·자정 넘김용.
    // 규칙: 종료 일시가 시작 일시보다 이전이면 안 됨 (submit 전 방어).
    if (data.startDate && data.startTime && data.endDate && data.endTime) {
      const startDateTime = `${data.startDate} ${data.startTime}`;
      const endDateTime = `${data.endDate} ${data.endTime}`;
      if (endDateTime <= startDateTime) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "종료 일시는 시작 일시보다 이전일 수 없습니다.",
          path: ["endDate"],
        });
      }
    }
  });

export type RegisterGameValues = z.infer<typeof registerGameSchema>;

/** 폼 기본값 (오늘 날짜, 오전 12:00 등). 경기 성격 기본값: 내전 */
export function getRegisterGameDefaultValues(): RegisterGameValues {
  const today = format(new Date(), "yyyy-MM-dd");
  return {
    matchType: "INTERNAL",
    opponentName: "",
    startDate: today,
    startTime: "00:00",
    endDate: today,
    endTime: "00:00",
    venue: { address: "", latitude: 0, longitude: 0 },
    quarterCount: 4,
    quarterDuration: 25,
    voteDeadline: "1_DAY_BEFORE",
    uniformType: null,
    description: "",
  };
}
