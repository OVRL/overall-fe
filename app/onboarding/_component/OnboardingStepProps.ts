import { Dispatch, SetStateAction } from "react";
import { z } from "zod";

export const onboardingSchema = z.object({
  email: z.string().email("이메일 형식이 올바르지 않습니다."),
  gender: z.string().optional(),
  name: z.string().optional(),
  password: z.string().optional(),
  phone: z
    .string()
    .regex(/^[0-9]+$/, "휴대폰 번호는 숫자만 입력해주세요.")
    .optional(),
  provider: z.string().optional(),
  mainFormation: z.array(z.string()).optional(),
  subFormation: z.array(z.string()).optional(),
});

export type OnboardingState = z.infer<typeof onboardingSchema>;

export interface OnboardingStepProps {
  onNext: () => void;
  data: Partial<OnboardingState>;
  onDataChange: Dispatch<SetStateAction<Partial<OnboardingState>>>;
}
