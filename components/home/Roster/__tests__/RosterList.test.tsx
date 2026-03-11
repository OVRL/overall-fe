import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import RosterList from "../RosterList/index";
import { Player } from "@/types/player";

// Mock data
const mockPlayers: Player[] = [
  {
    id: 1,
    name: "Player A",
    position: "FW",
    number: 10,
    overall: 85,
    season: "24",
    seasonType: "general",
    shooting: 80,
    passing: 75,
    dribbling: 82,
    defending: 40,
    physical: 70,
    pace: 88,
    image: "",
  },
  {
    id: 2,
    name: "Player B",
    position: "MF",
    number: 8,
    overall: 82,
    season: "24",
    seasonType: "general",
    shooting: 70,
    passing: 85,
    dribbling: 78,
    defending: 60,
    physical: 65,
    pace: 75,
    image: "",
  },
];

describe("RosterList", () => {
  it("renders player list correctly", () => {
    render(<RosterList players={mockPlayers} />);

    expect(screen.getByText("Player A")).toBeInTheDocument();
    expect(screen.getByText("Player B")).toBeInTheDocument();
  });

  it("calls onPlayerSelect when a player is clicked", () => {
    const handleSelect = jest.fn();
    render(<RosterList players={mockPlayers} onPlayerSelect={handleSelect} />);

    fireEvent.click(screen.getByText("Player A"));
    expect(handleSelect).toHaveBeenCalledWith(mockPlayers[0]);
  });

  it("shows empty state when no players provided", () => {
    render(<RosterList players={[]} />);
    expect(screen.getByText("선수가 없습니다.")).toBeInTheDocument();
  });
});
