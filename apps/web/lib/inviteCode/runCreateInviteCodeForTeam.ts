import type { useCreateInviteCodeMutation as MutationType } from "@/__generated__/useCreateInviteCodeMutation.graphql";
import { isAlreadyExistsInviteCodeError } from "@/components/modals/TeamCreatedModal/isAlreadyExistsInviteCodeError";
import { fetchInviteCodeByTeam } from "./fetchInviteCodeByTeam";
import type { InviteCodeSnapshot } from "@/lib/inviteCode/inviteCodeSnapshot";
import type { UseMutationConfig } from "react-relay";

export type ExecuteCreateInviteCodeMutation = (
  config: Omit<UseMutationConfig<MutationType>, "mutation">,
) => void;

/**
 * createInviteCode를 Promise로 감쌉니다.
 * "이미 존재" 응답이면 findInviteCodeByTeam으로 스냅샷을 다시 가져옵니다.
 */
export function runCreateInviteCodeForTeam(
  teamId: number,
  executeMutation: ExecuteCreateInviteCodeMutation,
): Promise<InviteCodeSnapshot> {
  return new Promise((resolve, reject) => {
    executeMutation({
      variables: { teamId },
      onCompleted(data) {
        const payload = data.createInviteCode;
        if (payload?.code == null || payload.code === "") {
          reject(new Error("createInviteCode: empty code"));
          return;
        }
        if (payload.expiredAt == null || payload.expiredAt === "") {
          reject(new Error("createInviteCode: missing expiredAt"));
          return;
        }
        resolve({ code: payload.code, expiredAt: payload.expiredAt });
      },
      onError(error: unknown) {
        if (isAlreadyExistsInviteCodeError(error)) {
          void fetchInviteCodeByTeam(teamId)
            .then((snap) => {
              if (snap != null) resolve(snap);
              else reject(error);
            })
            .catch(() => reject(error));
        } else {
          reject(error);
        }
      },
    });
  });
}
