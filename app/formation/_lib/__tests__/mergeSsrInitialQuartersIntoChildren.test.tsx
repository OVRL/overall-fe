import type { ReactNode } from "react";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import type { QuarterData } from "@/types/formation";
import type { FormationMatchPageSnapshot } from "@/types/formationMatchPageSnapshot";
import { mergeSsrInitialQuartersIntoChildren } from "../mergeSsrInitialQuartersIntoChildren";

function ReadPropsChild(props: {
  savedInitialQuarters?: QuarterData[] | null;
  savedDraftMatchFormationId?: number | null;
}) {
  return (
    <div>
      <span data-testid="quarter-count">
        {props.savedInitialQuarters?.length ?? 0}
      </span>
      <span data-testid="draft-id">
        {props.savedDraftMatchFormationId ?? "null"}
      </span>
    </div>
  );
}

function baseSnapshot(
  overrides: Partial<FormationMatchPageSnapshot> = {},
): FormationMatchPageSnapshot {
  return {
    players: [],
    initialQuarters: null,
    initialInHouseDraftTeamByKey: {},
    savedDraftMatchFormationId: null,
    savedLatestConfirmedMatchFormationId: null,
    savedInitialFormationPrimarySource: null,
    savedInitialFormationSourceRevision: null,
    ...overrides,
  };
}

describe("mergeSsrInitialQuartersIntoChildren", () => {
  it("initialQuarters가 비어 있으면 자식 props를 바꾸지 않는다", () => {
    const snapshot = baseSnapshot({ initialQuarters: null });
    const node = mergeSsrInitialQuartersIntoChildren(
      <ReadPropsChild
        savedInitialQuarters={[
          {
            id: 9,
            type: "MATCHING",
            formation: "4-3-3",
            matchup: { home: "A", away: "B" },
          },
        ]}
      />,
      snapshot,
    );
    render(<>{node}</>);
    expect(screen.getByTestId("quarter-count")).toHaveTextContent("1");
  });

  it("initialQuarters가 있으면 자식에 SSR 쿼터·메타 id를 주입한다", () => {
    const q: QuarterData[] = [
      {
        id: 1,
        type: "MATCHING",
        formation: "4-3-3",
        matchup: { home: "A", away: "B" },
      },
    ];
    const snapshot = baseSnapshot({
      initialQuarters: q,
      initialInHouseDraftTeamByKey: { "t:1": "A" },
      savedDraftMatchFormationId: 42,
      savedLatestConfirmedMatchFormationId: 7,
      savedInitialFormationPrimarySource: "draft",
      savedInitialFormationSourceRevision: "rev",
    });
    const node = mergeSsrInitialQuartersIntoChildren(
      <ReadPropsChild savedDraftMatchFormationId={0} />,
      snapshot,
    );
    render(<>{node}</>);
    expect(screen.getByTestId("quarter-count")).toHaveTextContent("1");
    expect(screen.getByTestId("draft-id")).toHaveTextContent("42");
  });

  it("문자열 등 비엘리먼트 자식은 그대로 둔다", () => {
    const snapshot = baseSnapshot({
      initialQuarters: [
        {
          id: 1,
          type: "MATCHING",
          formation: "4-4-2",
          matchup: { home: "A", away: "B" },
        },
      ],
    });
    const node = mergeSsrInitialQuartersIntoChildren(
      "unchanged" as unknown as ReactNode,
      snapshot,
    );
    expect(node).toEqual(["unchanged"]);
  });
});
