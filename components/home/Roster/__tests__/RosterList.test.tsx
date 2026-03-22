import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import RosterList from "../RosterList/index";
import type { RosterMember } from "../useFindManyTeamMemberQuery";

const mockMembers: readonly RosterMember[] = [
  {
    __typename: "TeamMemberModel",
    id: 1,
    position: "FW",
    backNumber: 10,
    joinedAt: "2023-09-03T00:00:00Z",
    profileImg: null,
    user: {
      __typename: "UserModel",
      id: "u1",
      name: "Player A",
      profileImage: null,
      birthDate: null,
      subPositions: [],
    },
    overall: {
      __typename: "OverallModel",
      ovr: 85,
      appearances: 25,
      goals: 10,
      assists: 5,
      keyPasses: 16,
      attackPoints: 26,
      cleanSheets: 0,
      mom3: 1,
      mom8: 0,
      winRate: 60,
    },
  },
  {
    __typename: "TeamMemberModel",
    id: 2,
    position: "MF",
    backNumber: 8,
    joinedAt: "2023-09-03T00:00:00Z",
    profileImg: null,
    user: {
      __typename: "UserModel",
      id: "u2",
      name: "Player B",
      profileImage: null,
      birthDate: null,
      subPositions: [],
    },
    overall: {
      __typename: "OverallModel",
      ovr: 82,
      appearances: 20,
      goals: 2,
      assists: 8,
      keyPasses: 24,
      attackPoints: 10,
      cleanSheets: 0,
      mom3: 0,
      mom8: 0,
      winRate: 55,
    },
  },
];

describe("RosterList", () => {
  it("renders player list correctly", () => {
    render(<RosterList members={mockMembers} />);

    expect(screen.getByText("Player A")).toBeInTheDocument();
    expect(screen.getByText("Player B")).toBeInTheDocument();
  });

  it("calls onMemberSelect when a member is clicked", () => {
    const handleSelect = jest.fn();
    render(
      <RosterList members={mockMembers} onMemberSelect={handleSelect} />,
    );

    fireEvent.click(screen.getByText("Player A"));
    expect(handleSelect).toHaveBeenCalledWith(mockMembers[0]);
  });

  it("shows empty state when no members provided", () => {
    render(<RosterList members={[]} />);
    expect(screen.getByText("선수가 없습니다.")).toBeInTheDocument();
  });
});
