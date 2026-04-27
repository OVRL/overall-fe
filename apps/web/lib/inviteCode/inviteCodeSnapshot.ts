/** 팀 초대 코드 조회·생성 응답에서 공통으로 쓰는 스냅샷 (만료 판별용 시각 포함) */
export type InviteCodeSnapshot = {
  code: string;
  expiredAt: string;
};
