import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { RelayEnvironmentProvider } from "react-relay";
import { createMockEnvironment } from "relay-test-utils";
import LandingStartForm from "../LandingStartForm";
import "@testing-library/jest-dom";

const mockOpenModal = jest.fn();

jest.mock("@/hooks/useModal", () => ({
  __esModule: true,
  default: () => ({
    openModal: mockOpenModal,
    hideModal: jest.fn(),
  }),
}));

jest.mock("@/lib/relay/observableToPromise", () => ({
  observableToPromise: jest.fn(() => Promise.resolve({})),
}));

jest.mock("@/components/modals/TeamInfoModal/TeamInfoModal", () => ({
  __esModule: true,
  default: function MockTeamInfoModal() {
    return <div data-testid="team-info-modal-mock" />;
  },
}));

describe("LandingStartForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  function renderWithRelay(ui: React.ReactElement) {
    const environment = createMockEnvironment();
    return {
      ...render(
        <RelayEnvironmentProvider environment={environment}>
          {ui}
        </RelayEnvironmentProvider>,
      ),
      environment,
    };
  }

  it("팀 코드 없으면 제출 버튼 비활성", () => {
    renderWithRelay(<LandingStartForm />);
    const submit = screen.getByRole("button", { name: /가입 신청하기/i });
    expect(submit).toBeDisabled();
  });

  it("코드 입력 후 제출 시 프리패치 완료 뒤 TEAM_INFO 모달 오픈", async () => {
    const { observableToPromise } = jest.requireMock(
      "@/lib/relay/observableToPromise",
    ) as { observableToPromise: jest.Mock };
    observableToPromise.mockResolvedValueOnce({});

    renderWithRelay(<LandingStartForm />);
    const input = screen.getByPlaceholderText(/TEAM2025/i);
    fireEvent.change(input, { target: { value: "MYCODE" } });

    const submit = screen.getByRole("button", { name: /가입 신청하기/i });
    expect(submit).not.toBeDisabled();

    fireEvent.click(submit);

    await waitFor(() => {
      expect(mockOpenModal).toHaveBeenCalledWith({
        inviteCode: "MYCODE",
        prefetchedAtOpen: true,
      });
    });
    expect(observableToPromise).toHaveBeenCalled();
  });

  it("프리패치 실패 시 토스트·모달 미호출", async () => {
    const { toast } = jest.requireMock("@/lib/toast") as {
      toast: { error: jest.Mock };
    };
    const { observableToPromise } = jest.requireMock(
      "@/lib/relay/observableToPromise",
    ) as { observableToPromise: jest.Mock };
    observableToPromise.mockRejectedValueOnce(new Error("network"));

    renderWithRelay(<LandingStartForm />);
    fireEvent.change(screen.getByPlaceholderText(/TEAM2025/i), {
      target: { value: "FAIL" },
    });
    fireEvent.click(screen.getByRole("button", { name: /가입 신청하기/i }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalled();
    });
    expect(mockOpenModal).not.toHaveBeenCalled();
  });
});
