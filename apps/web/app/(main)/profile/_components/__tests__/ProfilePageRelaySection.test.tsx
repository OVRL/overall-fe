import { render, screen } from "@testing-library/react";
import { SelectedTeamProvider } from "@/components/providers/SelectedTeamProvider";
import ProfilePageRelaySection from "../ProfilePageRelaySection";
import { useUserId } from "@/hooks/useUserId";
import { useLazyLoadQuery } from "react-relay";

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

// 하위 컴포넌트들을 모킹하여 Relay 데이터 복잡성을 피함
jest.mock("../ProfileStats", () => ({
  __esModule: true,
  default: () => <div data-testid="profile-stats">ProfileStats</div>,
}));

jest.mock("../TeamSelectButtonContainer", () => ({
  __esModule: true,
  default: ({ members }: any) => (
    <div data-testid="team-select">
      {members.map((m: any) => (
        <span key={m.team.id}>{m.team.name}</span>
      ))}
    </div>
  ),
}));

jest.mock("../SeasonIntegratedRecords", () => ({
  __esModule: true,
  default: () => <div data-testid="season-records">SeasonIntegratedRecords</div>,
}));

jest.mock("../AttackContributionSection", () => ({
  __esModule: true,
  default: () => <div data-testid="attack-section">AttackContributionSection</div>,
}));

jest.mock("../ProfileRevealSection", () => ({
  __esModule: true,
  default: ({ children }: any) => <div>{children}</div>,
}));

const mockUseUserId = useUserId as jest.MockedFunction<typeof useUserId>;
const mockUseLazyLoadQuery = useLazyLoadQuery as jest.MockedFunction<typeof useLazyLoadQuery>;

describe("ProfilePageRelaySection", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("userId가 null이면 아무것도 렌더링하지 않는다", () => {
    mockUseUserId.mockReturnValue(null);
    const { container } = render(<ProfilePageRelaySection />);
    expect(container.firstChild).toBeNull();
  });

  it("Relay 데이터가 있을 때 하위 섹션들을 렌더링한다", () => {
    mockUseUserId.mockReturnValue(1);
    mockUseLazyLoadQuery.mockReturnValue({
      findTeamMember: [
        {
          team: { id: "TeamModel:1", name: "팀 하나", emblem: null },
        },
      ],
    });

    render(
      <SelectedTeamProvider initialSelectedTeamId="TeamModel:1">
        <ProfilePageRelaySection />
      </SelectedTeamProvider>,
    );

    expect(screen.getByTestId("team-select")).toBeInTheDocument();
    expect(screen.getByText("팀 하나")).toBeInTheDocument();
    expect(screen.getByTestId("profile-stats")).toBeInTheDocument();
    expect(screen.getByTestId("season-records")).toBeInTheDocument();
    expect(screen.getByTestId("attack-section")).toBeInTheDocument();
  });
});
