import { mapRegisterGameValuesToCreateMatchInput } from "../../lib/mapRegisterGameValuesToCreateMatchInput";
import type { RegisterGameValues } from "../../schema";

const baseFormValues: RegisterGameValues = {
  matchType: "MATCH",
  opponentName: "상대팀",
  opponentTeamId: 2,
  startDate: "2025-03-20",
  startTime: "14:00",
  endDate: "2025-03-20",
  endTime: "16:00",
  venue: {
    address: "서울시 강남구",
    latitude: 37.5,
    longitude: 127.0,
  },
  quarterCount: 4,
  quarterDuration: 25,
  voteDeadline: "1_DAY_BEFORE",
  uniformType: "HOME",
  description: "메모",
};

describe("mapRegisterGameValuesToCreateMatchInput", () => {
  it("폼 값을 CreateMatchInput 형태로 변환한다", () => {
    const result = mapRegisterGameValuesToCreateMatchInput(
      baseFormValues,
      1,
    );

    expect(result.createdTeamId).toBe(1);
    expect(result.matchDate).toBe("2025-03-20");
    expect(result.startTime).toBe("14:00");
    expect(result.endTime).toBe("16:00");
    expect(result.matchType).toBe("MATCH");
    expect(result.opponentTeamId).toBe(2);
    expect(result.teamName).toBe("상대팀");
    expect(result.quarterCount).toBe(4);
    expect(result.quarterDuration).toBe(25);
    expect(result.uniformType).toBe("HOME");
    expect(result.description).toBe("메모");
    expect(result.venue).toEqual({
      address: "서울시 강남구",
      latitude: 37.5,
      longitude: 127.0,
    });
    expect(result.voteDeadline).toBe("2025-03-19 00:00:00");
  });

  it("description·teamName 공백만 있으면 null로 변환한다", () => {
    const result = mapRegisterGameValuesToCreateMatchInput(
      {
        ...baseFormValues,
        description: "   ",
        opponentName: "   ",
      },
      1,
    );
    expect(result.description).toBeNull();
    expect(result.teamName).toBeNull();
  });

  it("opponentTeamId가 없으면 null로 변환한다", () => {
    const result = mapRegisterGameValuesToCreateMatchInput(
      {
        ...baseFormValues,
        opponentTeamId: null,
      },
      1,
    );
    expect(result.opponentTeamId).toBeNull();
  });
});
