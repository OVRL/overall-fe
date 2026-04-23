import type { momVoteModalQuery } from "@/__generated__/momVoteModalQuery.graphql";
import {
  matchMomRowToPickValue,
  myVotesToTopPicks,
  pickLabelFromRow,
  sortMyMatchMomVotes,
} from "../momVoteMyVotesMapping";

type Row = momVoteModalQuery["response"]["findMyMatchMom"][number];

function base(overrides: Partial<Row> = {}): Row {
  return {
    id: 1,
    matchId: 1,
    teamId: 1,
    voterUserId: 100,
    candidateUserId: 10,
    candidateMercenaryId: null,
    createdAt: "2024-06-01T12:00:00.000Z",
    candidateUser: { name: "유저" },
    candidateMercenary: null,
    ...overrides,
  } as Row;
}

describe("sortMyMatchMomVotes", () => {
  it("createdAt 오름차순으로 정렬한다", () => {
    const a = base({
      id: 2,
      createdAt: "2024-06-01T14:00:00.000Z",
      candidateUserId: 2,
    });
    const b = base({
      id: 1,
      createdAt: "2024-06-01T13:00:00.000Z",
      candidateUserId: 1,
    });
    expect(sortMyMatchMomVotes([a, b]).map((r) => r.id)).toEqual([1, 2]);
  });
});

describe("matchMomRowToPickValue", () => {
  it("팀원이면 userId 문자열", () => {
    expect(matchMomRowToPickValue(base({ candidateUserId: 42 }))).toBe("42");
  });

  it("용병이면 m:id", () => {
    expect(
      matchMomRowToPickValue(
        base({
          candidateUserId: null,
          candidateMercenaryId: 7,
          candidateUser: null,
          candidateMercenary: { name: "M" },
        }),
      ),
    ).toBe("m:7");
  });
});

describe("myVotesToTopPicks", () => {
  it("최대 3슬롯을 TOP1~3에 매핑한다", () => {
    const r1 = base({ id: 1, candidateUserId: 1 });
    const r2 = base({ id: 2, candidateUserId: 2 });
    const r3 = base({ id: 3, candidateUserId: 3 });
    expect(myVotesToTopPicks([r1, r2, r3])).toEqual(["1", "2", "3"]);
  });

  it("행이 2개면 세 번째 슬롯은 undefined", () => {
    const r1 = base({ id: 1, candidateUserId: 1 });
    const r2 = base({ id: 2, candidateUserId: 2 });
    expect(myVotesToTopPicks([r1, r2])).toEqual(["1", "2", undefined]);
  });
});

describe("pickLabelFromRow", () => {
  it("용병 이름을 우선한다", () => {
    expect(
      pickLabelFromRow(
        base({
          candidateMercenary: { name: "용병" },
          candidateUser: { name: "유저" },
        }),
      ),
    ).toBe("용병");
  });

  it("이름이 없으면 후보로 표시한다", () => {
    expect(
      pickLabelFromRow(
        base({ candidateUser: null, candidateMercenary: null }),
      ),
    ).toBe("후보");
  });
});
