import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { UNIFORM_DESIGN_VALUES } from "../_lib/uniformDesign";
import { useCreateTeamMutation } from "./useCreateTeamMutation";
import { UniformDesign } from "../../../__generated__/useCreateTeamMutation.graphql";

export const createTeamSchema = z.object({
  clubName: z
    .string()
    .min(1, "클럽 이름을 입력해주세요.")
    .max(15, "최대 15자까지만 입력 가능합니다.")
    .regex(/^[a-zA-Z0-9가-힣\s]*$/, "특수문자는 입력할 수 없습니다."),
  activityArea: z.string().min(1, "지역을 선택해주세요."),
  activityAreaCode: z.string(),
  foundingDate: z.string().min(1, "창단일을 입력해주세요."),
  homeUniform: z.enum(UNIFORM_DESIGN_VALUES, {
    message: "홈 유니폼을 꼭 선택해주세요",
  }),
  awayUniform: z.enum(UNIFORM_DESIGN_VALUES, {
    message: "어웨이 유니폼을 꼭 선택해주세요",
  }),
  emblemFile: z.instanceof(File).optional(),
});

export type CreateTeamValues = z.infer<typeof createTeamSchema>;

export const useCreateTeamForm = (userId: number) => {
  const { executeMutation, isInFlight } = useCreateTeamMutation();

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
    // 혹시라도 빈 값이 들어왔을 경우 방어 처리 (Zod 필수값이지만 방어코드 유지)
    const historyStartDate = data.foundingDate
      ? new Date(data.foundingDate).toISOString()
      : new Date().toISOString();

    const homeUniform = (data.homeUniform || "DEFAULT") as UniformDesign;
    const awayUniform = (data.awayUniform || "DEFAULT") as UniformDesign;

    executeMutation({
      variables: {
        input: {
          name: data.clubName,
          activityArea: data.activityArea,
          historyStartDate,
          homeUniform,
          awayUniform,
          userId,
          email: "dummy@example.com", // FIXME: 백엔드 모델 변경 전까지 dummy 사용
        },
      },
      uploadables: data.emblemFile ? { emblem: data.emblemFile } : undefined,
      onCompleted: (response) => {
        console.log("Team created successfully:", response);
      },
      onError: (error) => {
        console.error("Error creating team:", error);
      },
    });
  };

  return {
    form,
    onSubmit,
    isInFlight,
  };
};
