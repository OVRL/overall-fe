import { computeVoteDeadlineDateTime } from "../../lib/voteDeadline";

describe("computeVoteDeadlineDateTime", () => {
  it("SAME_DAY이면 경기일 자정을 반환한다", () => {
    expect(
      computeVoteDeadlineDateTime("2025-03-20", "SAME_DAY"),
    ).toBe("2025-03-20 00:00:00");
  });

  it("1_DAY_BEFORE이면 경기일 하루 전 자정을 반환한다", () => {
    expect(
      computeVoteDeadlineDateTime("2025-03-20", "1_DAY_BEFORE"),
    ).toBe("2025-03-19 00:00:00");
  });

  it("2_DAYS_BEFORE이면 경기일 이틀 전 자정을 반환한다", () => {
    expect(
      computeVoteDeadlineDateTime("2025-03-20", "2_DAYS_BEFORE"),
    ).toBe("2025-03-18 00:00:00");
  });

  it("3_DAYS_BEFORE이면 경기일 3일 전 자정을 반환한다", () => {
    expect(
      computeVoteDeadlineDateTime("2025-03-20", "3_DAYS_BEFORE"),
    ).toBe("2025-03-17 00:00:00");
  });

  it("1_WEEK_BEFORE이면 경기일 7일 전 자정을 반환한다", () => {
    expect(
      computeVoteDeadlineDateTime("2025-03-20", "1_WEEK_BEFORE"),
    ).toBe("2025-03-13 00:00:00");
  });
});
