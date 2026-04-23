import type { ReactElement } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { SelectedTeamProvider } from "@/components/providers/SelectedTeamProvider";
import type { ProfileTeamMemberRow } from "../../types/profileTeamMemberTypes";
import TeamSelectButtonContainer from "../TeamSelectButtonContainer";

const mockRefresh = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    refresh: mockRefresh,
    prefetch: jest.fn(),
  }),
}));

function renderWithTeamProvider(
  ui: ReactElement,
  initialSelectedTeamId: string | null,
) {
  return render(
    <SelectedTeamProvider initialSelectedTeamId={initialSelectedTeamId}>
      {ui}
    </SelectedTeamProvider>,
  );
}

describe("TeamSelectButtonContainer", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("team이 없는 멤버만 있으면 라디오 버튼을 렌더링하지 않는다", () => {
    const members = [
      { team: null },
    ] as unknown as ProfileTeamMemberRow[];

    renderWithTeamProvider(
      <TeamSelectButtonContainer members={members} />,
      null,
    );

    expect(screen.queryByRole("radio")).not.toBeInTheDocument();
  });

  it("팀 버튼을 렌더링하고 선택 시 refresh를 호출한다", () => {
    const members = [
      {
        team: {
          id: "VGVhbTox",
          name: "팀 알파",
          emblem: null,
        },
      },
      {
        team: {
          id: "VGVhbToy",
          name: "팀 베타",
          emblem: null,
        },
      },
    ] as unknown as ProfileTeamMemberRow[];

    renderWithTeamProvider(
      <TeamSelectButtonContainer members={members} />,
      "VGVhbTox",
    );

    expect(screen.getByRole("radio", { name: /팀 알파/ })).toHaveAttribute(
      "aria-checked",
      "true",
    );

    fireEvent.click(screen.getByRole("radio", { name: /팀 베타/ }));

    expect(mockRefresh).toHaveBeenCalledTimes(1);
  });
});
