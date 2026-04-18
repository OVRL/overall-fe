import { resolveFormationSavePrimarySource } from "../resolveFormationSavePrimarySource";

describe("resolveFormationSavePrimarySource", () => {
  it("SSR에서 primarySource가 있으면 그대로 반환한다", () => {
    expect(
      resolveFormationSavePrimarySource({
        savedInitialFormationPrimarySource: "draft",
        savedLatestConfirmedMatchFormationId: 10,
        savedDraftMatchFormationId: 99,
      }),
    ).toBe("draft");
    expect(
      resolveFormationSavePrimarySource({
        savedInitialFormationPrimarySource: "confirmed",
        savedLatestConfirmedMatchFormationId: 1,
        savedDraftMatchFormationId: 2,
      }),
    ).toBe("confirmed");
  });

  it("primarySource가 없고 확정·드래프트 id가 모두 있으면 confirmed를 반환한다", () => {
    expect(
      resolveFormationSavePrimarySource({
        savedInitialFormationPrimarySource: null,
        savedLatestConfirmedMatchFormationId: 5,
        savedDraftMatchFormationId: 100,
      }),
    ).toBe("confirmed");
  });

  it("primarySource가 없고 id 쌍이 없으면 null이다", () => {
    expect(
      resolveFormationSavePrimarySource({
        savedInitialFormationPrimarySource: null,
        savedLatestConfirmedMatchFormationId: null,
        savedDraftMatchFormationId: null,
      }),
    ).toBeNull();
    expect(
      resolveFormationSavePrimarySource({
        savedInitialFormationPrimarySource: null,
        savedLatestConfirmedMatchFormationId: 1,
        savedDraftMatchFormationId: null,
      }),
    ).toBeNull();
    expect(
      resolveFormationSavePrimarySource({
        savedInitialFormationPrimarySource: null,
        savedLatestConfirmedMatchFormationId: null,
        savedDraftMatchFormationId: 1,
      }),
    ).toBeNull();
  });
});
