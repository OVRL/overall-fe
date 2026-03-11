import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import StartingXI from "../StartingXI";
import { Player } from "@/types/player";

// Use a simplified mock for createDataTransfer since jsdom doesn't implement it fully
const createDataTransfer = () => ({
  dropEffect: "none",
  effectAllowed: "none",
  setData: jest.fn(),
  getData: jest.fn(),
});

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
    // Need to mock FormationField or ensure it renders identifiable elements
    const handleChange = jest.fn();
    render(<StartingXI players={mockPlayers} onPlayersChange={handleChange} />);

    // Check for some text or element that confirms rendering.
    // ManagerInfo is rendered inside StartingXI
    expect(screen.getByText(/감독/i)).toBeInTheDocument();
  });

  // Note: Drag and Drop testing in JSDOM is complex and often requires user-event or specific event firing.
  // We will add a basic render test first.
});
