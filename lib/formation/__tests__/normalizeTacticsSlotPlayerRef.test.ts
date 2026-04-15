import { normalizeTacticsSlotPlayerRef } from "../normalizeTacticsSlotPlayerRef";

describe("normalizeTacticsSlotPlayerRef", () => {
  it("용병 mercenaryId를 문자열(Type:id)로 받아도 정규화한다", () => {
    const ref = normalizeTacticsSlotPlayerRef({
      kind: "MERCENARY",
      mercenaryId: "MatchMercenaryModel:9",
      displayName: "태스키",
      backNumber: 0,
      position: "용병",
    });
    expect(ref).toEqual({
      kind: "MERCENARY",
      mercenaryId: 9,
      displayName: "태스키",
      backNumber: 0,
      position: "용병",
    });
  });

  it("팀원 teamMemberId를 문자열로 받아도 정규화한다", () => {
    const ref = normalizeTacticsSlotPlayerRef({
      teamMemberId: "20",
      displayName: "디알로",
    });
    expect(ref).toEqual({
      kind: "TEAM_MEMBER",
      teamMemberId: 20,
      displayName: "디알로",
      backNumber: undefined,
      position: undefined,
    });
  });

  it("용병 id 파싱 실패면 null", () => {
    expect(
      normalizeTacticsSlotPlayerRef({
        kind: "MERCENARY",
        mercenaryId: "MatchMercenaryModel:x",
      }),
    ).toBeNull();
  });
});
