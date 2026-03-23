import { formatFormationMatchSchedule } from "../formatFormationMatchSchedule";

describe("formatFormationMatchSchedule", () => {
  it("YYYY-MM-DD(요일)과 시작~종료 시각을 한 줄로 반환한다", () => {
    expect(
      formatFormationMatchSchedule("2026-02-03", "18:00:00", "20:00:00"),
    ).toBe("2026-02-03(화) 18:00~20:00");
  });
});
