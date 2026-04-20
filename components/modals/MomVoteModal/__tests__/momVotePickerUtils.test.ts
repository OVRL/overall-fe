import type { findMatchAttendanceQuery } from "@/__generated__/findMatchAttendanceQuery.graphql";
import {
  buildMomVoteCandidateOptions,
  optionsExcludingOthers,
  parseMomVoteSelectionToCandidateInput,
} from "../momVotePickerUtils";

type Row = findMatchAttendanceQuery["response"]["findMatchAttendance"][number];
type Merc = findMatchAttendanceQuery["response"]["matchMercenaries"][number];

const MATCH_ID = 9001;

function row(
  input: Partial<Row> & Pick<Row, "userId">,
): Row {
  return {
    id: input.id ?? input.userId,
    matchId: input.matchId ?? MATCH_ID,
    attendanceStatus: input.attendanceStatus ?? "ATTEND",
    userId: input.userId,
    user: input.user,
  } as Row;
}

function merc(partial: Partial<Merc> & Pick<Merc, "id" | "name">): Merc {
  return {
    matchId: partial.matchId ?? MATCH_ID,
    teamId: partial.teamId ?? 1,
    id: partial.id,
    name: partial.name,
  } as Merc;
}

describe("buildMomVoteCandidateOptions", () => {
  it("ATTEND만 포함하고 ABSENT·이름 없음은 제외한다", () => {
    const rows: findMatchAttendanceQuery["response"]["findMatchAttendance"] =
      [
        row({
          userId: 1,
          attendanceStatus: "ABSENT",
          user: { id: 1, name: "불참자", profileImage: null },
        }),
        row({
          userId: 2,
          user: null,
        }),
        row({
          userId: 3,
          user: { id: 3, name: "   ", profileImage: null },
        }),
        row({
          userId: 4,
          user: { id: 4, name: "참석자", profileImage: null },
        }),
      ];

    expect(buildMomVoteCandidateOptions(rows, [], MATCH_ID)).toEqual([
      { label: "참석자", value: "4" },
    ]);
  });

  it("다른 matchId 행은 제외한다", () => {
    const rows: findMatchAttendanceQuery["response"]["findMatchAttendance"] =
      [
        row({
          userId: 1,
          matchId: 999,
          user: { id: 1, name: "다른경기", profileImage: null },
        }),
        row({
          userId: 2,
          matchId: MATCH_ID,
          user: { id: 2, name: "이번경기", profileImage: null },
        }),
      ];

    expect(buildMomVoteCandidateOptions(rows, [], MATCH_ID)).toEqual([
      { label: "이번경기", value: "2" },
    ]);
  });

  it("userId 기준 중복을 제거하고, 용병은 m:id 형태로 붙인다", () => {
    const rows: findMatchAttendanceQuery["response"]["findMatchAttendance"] =
      [
        row({
          userId: 7,
          user: { id: 7, name: "첫번째", profileImage: null },
        }),
        row({
          userId: 7,
          user: { id: 7, name: "두번째", profileImage: null },
        }),
      ];
    const mercenaries: findMatchAttendanceQuery["response"]["matchMercenaries"] =
      [merc({ id: 10, name: "용병A" })];

    expect(buildMomVoteCandidateOptions(rows, mercenaries, MATCH_ID)).toEqual([
      { label: "첫번째", value: "7" },
      { label: "용병A", value: "m:10" },
    ]);
  });
});

describe("parseMomVoteSelectionToCandidateInput", () => {
  it("팀원 userId 문자열을 candidateUserId로 변환한다", () => {
    expect(parseMomVoteSelectionToCandidateInput("42")).toEqual({
      candidateUserId: 42,
    });
  });

  it("용병 m:id 형태를 candidateMercenaryId로 변환한다", () => {
    expect(parseMomVoteSelectionToCandidateInput("m:7")).toEqual({
      candidateMercenaryId: 7,
    });
  });
});

describe("optionsExcludingOthers", () => {
  const all = [
    { label: "A", value: "1" },
    { label: "B", value: "2" },
    { label: "C", value: "3" },
  ];

  it.each<
    [
      string,
      string | undefined,
      (string | undefined)[],
      { label: string; value: string }[],
    ]
  >([
    [
      "다른 슬롯에서 선택한 값은 목록에서 제외한다",
      undefined,
      ["2"],
      [
        { label: "A", value: "1" },
        { label: "C", value: "3" },
      ],
    ],
    [
      "현재 슬롯에 선택된 값은 다른 슬롯과 겹쳐도 목록에 남는다",
      "2",
      ["2", "3"],
      [
        { label: "A", value: "1" },
        { label: "B", value: "2" },
      ],
    ],
    [
      "빈 문자열·undefined는 others에서 막힌 값으로 취급하지 않는다",
      undefined,
      ["", undefined, "2"],
      [
        { label: "A", value: "1" },
        { label: "C", value: "3" },
      ],
    ],
  ])("%s", (_title, current, others, expected) => {
    expect(optionsExcludingOthers(all, current, others)).toEqual(expected);
  });
});
