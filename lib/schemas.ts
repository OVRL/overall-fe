import * as z from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "이메일을 입력해주세요")
    .email("이메일 양식에 맞게 입력해주세요"),
  password: z.string().min(1, "비밀번호를 입력해주세요"),
});

export type LoginSchemaType = z.infer<typeof loginSchema>;
