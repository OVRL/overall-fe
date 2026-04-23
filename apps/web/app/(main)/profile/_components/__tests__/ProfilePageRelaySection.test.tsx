import { render, screen } from "@testing-library/react";
import { SelectedTeamProvider } from "@/components/providers/SelectedTeamProvider";
import type { ProfileTeamMemberRow } from "../../types/profileTeamMemberTypes";
import ProfilePageRelaySection from "../ProfilePageRelaySection";

jest.mock("@/hooks/useUserId", () => ({
  useUserId: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    refresh: jest.fn(),
    prefetch: jest.fn(),
  }),
}));

jest.mock("react-relay", () => {
  const actual = jest.requireActual<typeof import("react-relay")>("react-relay");
  return {
    ...actual,
    useLazyLoadQuery: jest.fn(),
  };
});

jest.mock("@/components/charts/AttackContributionLineChart", () => ({
  __esModule: true,
  default: () => <div data-testid="attack-line-chart" />,
}));

import { useLazyLoadQuery } from "react-relay";
import { useUserId } from "@/hooks/useUserId";

const mockUseUserId = useUserId as jest.MockedFunction<typeof useUserId>;
const mockUseLazyLoadQuery = useLazyLoadQuery as jest.MockedFunction<
  typeof useLazyLoadQuery
>;

function makeMembers(): ProfileTeamMemberRow[] {
  return [
    {
      team: { id: "TeamModel:1", name: "팀 하나", emblem: null },
      user: { name: "김철수", region: { name: "서울" } },
      profileImg: null,
      joinedAt: "2023-06-01T00:00:00.000Z",
      overall: {
        ovr: 77,
        appearances: 5,
        goals: 2,
        assists: 1,
        keyPasses: 3,
        cleanSheets: 0,
        mom3: 1,
        mom8: 0,
      },
    },
  ] as unknown as ProfileTeamMemberRow[];
}

describe("ProfilePageRelaySection", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("userId가 null이면 아무것도 렌더링하지 않는다", () => {
    mockUseUserId.mockReturnValue(null);

    const { container } = render(<ProfilePageRelaySection />);

    expect(container.firstChild).toBeNull();
  });

  it("Relay 데이터와 선택 팀에 맞춰 프로필 구역을 렌더링한다", () => {
    mockUseUserId.mockReturnValue(1);
    mockUseLazyLoadQuery.mockReturnValue({
      findTeamMember: makeMembers(),
    });

    render(
      <SelectedTeamProvider initialSelectedTeamId="TeamModel:1">
        <ProfilePageRelaySection />
      </SelectedTeamProvider>,
    );

    expect(screen.getByRole("radio", { name: /팀 하나/ })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "김철수" })).toBeInTheDocument();
    expect(screen.getByText("77")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "시즌별 통합 기록" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "공격 기여도" }),
    ).toBeInTheDocument();
  });
});
