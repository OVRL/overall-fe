import React from "react";
import { render, screen } from "@testing-library/react";
import { SelectedTeamProvider } from "@/components/providers/SelectedTeamProvider";
import { Player } from "@/types/player";
import StartingXI from "../StartingXI";

// motion/react 패스스루 — 애니메이션·viewport 이슈 회피
jest.mock("motion/react", () => {
  const ReactMod = jest.requireActual<typeof import("react")>("react");
  function stripMotionProps(props: Record<string, unknown>) {
    const next = { ...props };
    delete next.initial;
    delete next.animate;
    delete next.exit;
    delete next.transition;
    delete next.variants;
    delete next.whileInView;
    delete next.viewport;
    delete next.whileTap;
    delete next.whileHover;
    return next;
  }
  const MotionDiv = ({
    children,
    ...rest
  }: React.PropsWithChildren<Record<string, unknown>>) =>
    ReactMod.createElement(
      "div",
      stripMotionProps(rest) as React.HTMLAttributes<HTMLDivElement>,
      children,
    );
  return {
    motion: { div: MotionDiv },
    MotionConfig: ({ children }: React.PropsWithChildren) => children,
    useReducedMotion: () => false,
  };
});

function renderWithSelectedTeamProvider(
  ui: React.ReactElement,
  options?: { initialSelectedTeamId?: string | null; initialSelectedTeamName?: string | null },
) {
  const {
    initialSelectedTeamId = null,
    initialSelectedTeamName = null,
  } = options ?? {};
  return render(
    <SelectedTeamProvider
      initialSelectedTeamId={initialSelectedTeamId}
      initialSelectedTeamName={initialSelectedTeamName}
    >
      {ui}
    </SelectedTeamProvider>,
  );
}

const mockPlayers: Player[] = [
  {
    id: 1,
    name: "Player 1",
    position: "GK",
    number: 1,
    overall: 80,
    season: "24",
    seasonType: "general",
    shooting: 50,
    passing: 50,
    dribbling: 50,
    defending: 50,
    physical: 50,
    pace: 50,
    image: "",
  },
  {
    id: 2,
    name: "Player 2",
    position: "ST",
    number: 9,
    overall: 85,
    season: "24",
    seasonType: "general",
    shooting: 80,
    passing: 70,
    dribbling: 75,
    defending: 40,
    physical: 70,
    pace: 80,
    image: "",
  },
];

describe("StartingXI", () => {
  it("renders formation field", () => {
    const handleChange = jest.fn();
    renderWithSelectedTeamProvider(
      <StartingXI
        players={mockPlayers}
        isSoloTeam={false}
        onPlayersChange={handleChange}
      />,
    );

    expect(screen.getByText(/감독/i)).toBeInTheDocument();
  });

  // Note: Drag and Drop testing in JSDOM is complex and often requires user-event or specific event firing.
  // We will add a basic render test first.
});
