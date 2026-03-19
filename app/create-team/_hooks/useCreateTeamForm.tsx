import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { UNIFORM_DESIGN_VALUES } from "../_lib/uniformDesign";
import type { useCreateTeamMutation$data } from "../../../__generated__/useCreateTeamMutation.graphql";
import { useCreateTeamMutation } from "./useCreateTeamMutation";
import { UniformDesign } from "../../../__generated__/useCreateTeamMutation.graphql";
import { useUserStore } from "@/contexts/UserContext";

export const createTeamSchema = z
  .object({
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
  })
  .refine((data) => data.emblemFile != null, {
    message: "엠블럼 이미지를 선택해주세요.",
    path: ["emblemFile"],
  });

export type CreateTeamValues = z.infer<typeof createTeamSchema>;

/** 성공 시 콜백. 생성된 팀 정보를 넘겨 선택 팀 갱신·리다이렉트 등에 사용 */
export type CreateTeamFormOptions = {
  onSuccess?: (createdTeam: useCreateTeamMutation$data["createTeam"]) => void;
};

/**
 * 클럽 생성 폼 훅. 로그인 유저 정보(id, email)는 Zustand user store에서 조회.
 * Relay useMutation 패턴으로 createTeam 뮤테이션 실행.
 */
export const useCreateTeamForm = (options?: CreateTeamFormOptions) => {
  const user = useUserStore((state) => state.user);
  const { executeMutation, isInFlight } = useCreateTeamMutation();
  const onSuccess = options?.onSuccess;

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
    if (!data.emblemFile || !user?.email || !user?.id) {
      return;
    }
    const userId = parseInt(user.id, 10);
    if (Number.isNaN(userId)) {
      return;
    }

    const historyStartDate = data.foundingDate
      ? new Date(data.foundingDate).toISOString()
      : new Date().toISOString();

    const homeUniform = (data.homeUniform || "DEFAULT") as UniformDesign;
    const awayUniform = (data.awayUniform || "DEFAULT") as UniformDesign;

    executeMutation({
      variables: {
        input: {
          name: data.clubName,
          activityArea: data.activityAreaCode,
          historyStartDate,
          homeUniform,
          awayUniform,
          userId,
          email: user.email,
        },
        emblem: null, // Upload 타입은 variables에는 null, 실제 파일은 uploadables로 전달
      },
      uploadables: { emblem: data.emblemFile },
      onCompleted: (response) => {
        onSuccess?.(response.createTeam);
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
