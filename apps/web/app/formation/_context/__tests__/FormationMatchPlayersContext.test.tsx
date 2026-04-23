import { render, screen } from "@testing-library/react";
import {
  FormationMatchPlayersProvider,
  useFormationMatchPlayers,
} from "../FormationMatchPlayersContext";
import type { Player } from "@/types/formation";

const samplePlayers: Player[] = [
  { id: 1, name: "A", position: "ST", number: 9, overall: 80 },
  { id: 2, name: "B", position: "CM", number: 8, overall: 82 },
];

function PlayerCountProbe() {
  const players = useFormationMatchPlayers();
  return <span data-testid="player-count">{players.length}</span>;
}

function FirstNameProbe() {
  const players = useFormationMatchPlayers();
  return <span data-testid="first-name">{players[0]?.name ?? ""}</span>;
}

describe("FormationMatchPlayersContext", () => {
  it("Provider가 주입한 선수 배열을 훅으로 읽는다", () => {
    render(
      <FormationMatchPlayersProvider players={samplePlayers}>
        <PlayerCountProbe />
        <FirstNameProbe />
      </FormationMatchPlayersProvider>,
    );

    expect(screen.getByTestId("player-count")).toHaveTextContent("2");
    expect(screen.getByTestId("first-name")).toHaveTextContent("A");
  });

  it("빈 배열도 유효한 컨텍스트 값이다", () => {
    render(
      <FormationMatchPlayersProvider players={[]}>
        <PlayerCountProbe />
      </FormationMatchPlayersProvider>,
    );

    expect(screen.getByTestId("player-count")).toHaveTextContent("0");
  });

  it("Provider 없이 훅을 쓰면 에러를 던진다", () => {
    const Bad = () => {
      useFormationMatchPlayers();
      return null;
    };

    expect(() => render(<Bad />)).toThrow(
      "FormationMatchPlayersProvider 하위에서만",
    );
  });
});
