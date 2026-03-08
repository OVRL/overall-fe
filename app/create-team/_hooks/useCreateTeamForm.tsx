import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { UNIFORM_DESIGN_VALUES } from "../_lib/uniformDesign";

export const createTeamSchema = z.object({
  clubName: z
    .string()
    .min(1, "클럽 이름을 입력해주세요.")
    .max(15, "최대 15자까지만 입력 가능합니다.")
    .regex(/^[a-zA-Z0-9가-힣\s]*$/, "특수문자는 입력할 수 없습니다."),
  activityArea: z.string().min(1, "지역을 선택해주세요."),
  activityAreaCode: z.string(),
  foundingDate: z.string().optional(),
  homeUniform: z.enum(UNIFORM_DESIGN_VALUES).optional(),
  awayUniform: z.enum(UNIFORM_DESIGN_VALUES).optional(),
  emblemFile: z.instanceof(File).optional(),
});

export type CreateTeamValues = z.infer<typeof createTeamSchema>;

export const useCreateTeamForm = () => {
  const form = useForm<CreateTeamValues>({
    resolver: zodResolver(createTeamSchema),
    mode: "onChange",
    defaultValues: {
      clubName: "",
      activityArea: "",
      activityAreaCode: "",
      foundingDate: "",
      homeUniform: undefined,
      awayUniform: undefined,
      emblemFile: undefined,
    },
  });

  const onSubmit = (data: CreateTeamValues) => {
    // API 제출 등 비즈니스 로직 연동 예정
    console.log("Form submitted:", data);
  };

  return {
    form,
    onSubmit,
  };
};
