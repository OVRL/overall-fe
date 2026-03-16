import type { findUserByIdQuery$data } from "@/__generated__/findUserByIdQuery.graphql";
import type { UserModel } from "@/contexts/UserContext";

/**
 * FindUserById 쿼리 응답 노드를 UserModel(Zustand/Provider 호환)로 변환합니다.
 * SSR 로더와 클라이언트 동기화에서 공통 사용.
 */
export function mapRelayUserToUserModel(
  u: findUserByIdQuery$data["findUserById"],
): UserModel {
  return {
    id: u.id,
    email: u.email,
    name: u.name ?? undefined,
    profileImage: u.profileImage ?? undefined,
    activityArea: u.activityArea ?? undefined,
    birthDate: u.birthDate ?? undefined,
    favoritePlayer: u.favoritePlayer ?? undefined,
    foot: u.foot ?? undefined,
    gender: u.gender ?? undefined,
    mainPosition: u.mainPosition ?? undefined,
    phone: u.phone ?? undefined,
    preferredNumber: u.preferredNumber ?? undefined,
    provider: u.provider ?? undefined,
    subPositions: u.subPositions ? [...u.subPositions] : undefined,
  };
}
