import type { findMatchAttendanceQuery } from "@/__generated__/findMatchAttendanceQuery.graphql";
import {
  buildMomVoteCandidateOptions,
  optionsExcludingOthers,
  parseMomVoteSelectionToCandidateInput,
  picksToCandidateUserIds,
  withOptionForValue,
} from "../momVotePickerUtils";

type Row = findMatchAttendanceQuery["response"]["findMatchAttendance"][number];

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

    expect(buildMomVoteCandidateOptions(rows, MATCH_ID)).toEqual([
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

    expect(buildMomVoteCandidateOptions(rows, MATCH_ID)).toEqual([
      { label: "이번경기", value: "2" },
    ]);
  });

  it("userId 기준 중복을 제거하고, 용병(matchMercenaries)은 후보에 넣지 않는다", () => {
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

    expect(buildMomVoteCandidateOptions(rows, MATCH_ID)).toEqual([
      { label: "첫번째", value: "7" },
    ]);
  });

  it("후보 표시명 기준 한국어 로케일 오름차순으로 정렬한다", () => {
    const rows: findMatchAttendanceQuery["response"]["findMatchAttendance"] =
      [
        row({
          userId: 1,
          user: { id: 1, name: "홍길동", profileImage: null },
        }),
        row({
          userId: 2,
          user: { id: 2, name: "가나다", profileImage: null },
        }),
      ];

    expect(buildMomVoteCandidateOptions(rows, MATCH_ID)).toEqual([
      { label: "가나다", value: "2" },
      { label: "홍길동", value: "1" },
    ]);
  });

  it("excludeUserId가 지정되면 해당 팀원 후보를 제외한다", () => {
    const rows: findMatchAttendanceQuery["response"]["findMatchAttendance"] =
      [
        row({
          userId: 5,
          user: { id: 5, name: "본인", profileImage: null },
        }),
        row({
          userId: 6,
          user: { id: 6, name: "타인", profileImage: null },
        }),
      ];

    expect(
      buildMomVoteCandidateOptions(rows, MATCH_ID, { excludeUserId: 5 }),
    ).toEqual([{ label: "타인", value: "6" }]);
  });
});

describe("withOptionForValue", () => {
  const all = [
    { label: "A", value: "1" },
    { label: "B", value: "2" },
  ];

  it("선택값이 목록에 없으면 fallback 라벨로 한 줄 추가한다", () => {
    expect(withOptionForValue(all, "99", "레거시")).toEqual([
      { label: "A", value: "1" },
      { label: "B", value: "2" },
      { label: "레거시", value: "99" },
    ]);
  });

  it("값이 비어 있으면 원본을 그대로 반환한다", () => {
    expect(withOptionForValue(all, undefined, "x")).toEqual(all);
  });
});

describe("picksToCandidateUserIds", () => {
  it("세 슬롯이 모두 팀원이면 userId 3개를 반환한다", () => {
    expect(picksToCandidateUserIds("1", "2", "3")).toEqual([1, 2, 3]);
  });

  it("용병 m:id 값은 후보에 없지만 레거시 문자열이면 파싱에서 제외한다", () => {
    expect(picksToCandidateUserIds("1", "m:9", "3")).toEqual([1, 3]);
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
