import type { findMatchAttendanceQuery } from "@/__generated__/findMatchAttendanceQuery.graphql";
import { buildPlayerOptions, optionsExcludingOthers } from "../momVotePickerUtils";

type Row = findMatchAttendanceQuery["response"]["findMatchAttendance"][number];

function row(input: Partial<Row> & Pick<Row, "userId">): Row {
  return {
    id: input.id ?? input.userId,
    attendanceStatus: input.attendanceStatus ?? "ATTEND",
    userId: input.userId,
    user: input.user,
  } as Row;
}

describe("buildPlayerOptions", () => {
  it("이름이 없는 행은 건너뛴다", () => {
    const rows: findMatchAttendanceQuery["response"]["findMatchAttendance"] =
      [
        row({
          userId: 1,
          user: null,
        }),
        row({
          userId: 2,
          user: { id: 2, name: null, profileImage: null },
        }),
        row({
          userId: 3,
          user: { id: 3, name: "   ", profileImage: null },
        }),
        row({
          userId: 4,
          user: { id: 4, name: "홍길동", profileImage: null },
        }),
      ];

    expect(buildPlayerOptions(rows)).toEqual([{ label: "홍길동", value: "4" }]);
  });

  it("userId 기준으로 중복을 제거하고 value는 문자열 userId다", () => {
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

    expect(buildPlayerOptions(rows)).toEqual([{ label: "첫번째", value: "7" }]);
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
