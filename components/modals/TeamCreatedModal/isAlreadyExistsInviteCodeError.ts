import { getGraphQLErrorMessage } from "@/lib/relay/getGraphQLErrorMessage";
import { INVITE_CODE_ALREADY_EXISTS_MESSAGE } from "./constants";

/** createInviteCode 에러가 "이미 팀 초대 코드가 존재합니다"인지 여부 (findInviteCodeByTeam 재조회 분기용) */
export function isAlreadyExistsInviteCodeError(error: unknown): boolean {
  const message = getGraphQLErrorMessage(error, "");
  return message.includes(INVITE_CODE_ALREADY_EXISTS_MESSAGE);
}
