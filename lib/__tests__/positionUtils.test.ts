import { getMainPositionFromRole } from "../positionUtils";

describe("positionUtils", () => {
  describe("getMainPositionFromRole", () => {
    it("FW 포지션들을 FW로 반환한다", () => {
      expect(getMainPositionFromRole("ST")).toBe("FW");
      expect(getMainPositionFromRole("CF")).toBe("FW");
      expect(getMainPositionFromRole("RW")).toBe("FW");
      expect(getMainPositionFromRole("LW")).toBe("FW");
      expect(getMainPositionFromRole("st")).toBe("FW");
    });

    it("MF 포지션들을 MF로 반환한다", () => {
      expect(getMainPositionFromRole("CM")).toBe("MF");
      expect(getMainPositionFromRole("CAM")).toBe("MF");
      expect(getMainPositionFromRole("CDM")).toBe("MF");
      expect(getMainPositionFromRole("LCM")).toBe("MF");
    });

    it("DF 포지션들을 DF로 반환한다", () => {
      expect(getMainPositionFromRole("CB")).toBe("DF");
      expect(getMainPositionFromRole("LB")).toBe("DF");
      expect(getMainPositionFromRole("RB")).toBe("DF");
      expect(getMainPositionFromRole("LWB")).toBe("DF");
      expect(getMainPositionFromRole("SW")).toBe("DF");
    });

    it("GK는 GK로 반환한다", () => {
      expect(getMainPositionFromRole("GK")).toBe("GK");
      expect(getMainPositionFromRole("gk")).toBe("GK");
    });

    it("경기 용병(용병)은 MF로 반환한다", () => {
      expect(getMainPositionFromRole("용병")).toBe("MF");
    });

    it("매핑되지 않은 포지션은 전체를 반환한다", () => {
      expect(getMainPositionFromRole("UNKNOWN")).toBe("전체");
      expect(getMainPositionFromRole("")).toBe("전체");
    });
  });
});
