import { render, screen, act } from "@testing-library/react";
import { useContext } from "react";
import { RelayEnvironmentProvider } from "react-relay";
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils";
import "@testing-library/jest-dom";

import FormationMatchDataLoader from "@/app/formation/[matchId]/_components/FormationMatchDataLoader";
import { FormationMatchPlayersContext } from "@/app/formation/_context/FormationMatchPlayersContext";
import { FormationMatchContext } from "@/app/formation/_context/FormationMatchContext";
import type { Player } from "@/types/formation";

/**
 * 테스트용 자식 컴포넌트: Context가 올바르게 주입되었는지 확인
 */
function TestChild() {
  const players = useContext(FormationMatchPlayersContext);
  const matchInfo = useContext(FormationMatchContext);

  if (!players || !matchInfo) return <div>Context Missing</div>;

  return (
    <div>
      <div data-testid="match-id">{matchInfo.matchId}</div>
      <div data-testid="player-count">{players.length}</div>
      <ul data-testid="player-list">
        {players.map((p: Player) => (
          <li key={String(p.id)}>{p.name}</li>
        ))}
      </ul>
    </div>
  );
}

describe("FormationMatchDataLoader", () => {
  let environment: ReturnType<typeof createMockEnvironment>;

  beforeEach(() => {
    environment = createMockEnvironment();
    jest.clearAllMocks();
  });

  function renderLoader() {
    return render(
      <RelayEnvironmentProvider environment={environment}>
        <FormationMatchDataLoader matchId={123} teamId={456}>
          <TestChild />
        </FormationMatchDataLoader>
      </RelayEnvironmentProvider>,
    );
  }

  it("마운트 초기에는 클라이언트 실행 보장을 위한 로딩 UI를 보여준다", () => {
    renderLoader();
    expect(
      screen.getByRole("status", { name: "포메이션 로딩 중" }),
    ).toBeInTheDocument();
  });

  it("데이터 로드 성공 시 Context를 통해 선수 명단과 경기 정보를 자식에게 전달한다", async () => {
    renderLoader();

    // isMounted 이후 Suspense 단계로 진입
    act(() => {
      // 렌더링 사이클을 한 번 돌려 useEffect 실행 유도
    });

    await act(async () => {
      environment.mock.resolveMostRecentOperation((operation) =>
        MockPayloadGenerator.generate(operation, {
          Query: () => ({
            findMatchAttendance: [
              {
                attendanceStatus: "ATTEND",
                teamMember: {
                  id: "TeamMember:1",
                  user: { id: "User:1", name: "선수1" },
                  overall: { ovr: 80 },
                  position: "ST",
                },
              },
              {
                attendanceStatus: "ATTEND",
                teamMember: {
                  id: "TeamMember:2",
                  user: { id: "User:2", name: "선수2" },
                  overall: { ovr: 75 },
                  position: "CM",
                },
              },
              {
                attendanceStatus: "ABSENT", // 불참자는 제외되어야 함
                teamMember: {
                  id: "TeamMember:3",
                  user: { id: "User:3", name: "불참자" },
                },
              },
            ],
          }),
        }),
      );
    });

    expect(await screen.findByTestId("match-id")).toHaveTextContent("123");
    expect(screen.getByTestId("player-count")).toHaveTextContent("2");
    expect(screen.getByText("선수1")).toBeInTheDocument();
    expect(screen.getByText("선수2")).toBeInTheDocument();
    expect(screen.queryByText("불참자")).not.toBeInTheDocument();
  });

  it("데이터 로드 실패 시 ErrorBoundary의 폴백 UI를 보여준다", async () => {
    // console.error를 잠깐 비워 테스트 출력을 깔끔하게 함 (React ErrorBoundary 로그 제외)
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    renderLoader();

    await act(async () => {
      environment.mock.rejectMostRecentOperation(new Error("Network Error"));
    });

    expect(screen.getByText("데이터를 불러오지 못했습니다.")).toBeInTheDocument();
    
    consoleSpy.mockRestore();
  });
});
