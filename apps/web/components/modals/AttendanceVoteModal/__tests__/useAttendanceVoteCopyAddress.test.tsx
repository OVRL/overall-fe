import { render, screen, fireEvent, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import type { findMatchQuery } from "@/__generated__/findMatchQuery.graphql";
import { useAttendanceVoteCopyAddress } from "../useAttendanceVoteCopyAddress";

type MatchNode = findMatchQuery["response"]["findMatch"][number];

jest.mock("@/lib/toast", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

const { toast } = jest.requireMock("@/lib/toast") as {
  toast: { success: jest.Mock; error: jest.Mock };
};

function CopyTrigger({ match }: { match: MatchNode | null }) {
  const { handleCopyAddress } = useAttendanceVoteCopyAddress(match);
  return (
    <button type="button" onClick={handleCopyAddress}>
      주소 복사
    </button>
  );
}

describe("useAttendanceVoteCopyAddress", () => {
  const writeText = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    Object.assign(navigator, {
      clipboard: { writeText },
    });
  });

  it("venue.address가 없으면 복사를 시도하지 않는다", () => {
    render(<CopyTrigger match={{ venue: null } as unknown as MatchNode} />);
    fireEvent.click(screen.getByRole("button", { name: "주소 복사" }));
    expect(writeText).not.toHaveBeenCalled();
    expect(toast.success).not.toHaveBeenCalled();
  });

  it("주소가 있으면 clipboard에 쓰고 성공 토스트를 띄운다", async () => {
    writeText.mockResolvedValue(undefined);
    const match = {
      venue: { address: "수원시 팔달구" },
    } as MatchNode;

    render(<CopyTrigger match={match} />);
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "주소 복사" }));
    });

    expect(writeText).toHaveBeenCalledWith("수원시 팔달구");
    expect(toast.success).toHaveBeenCalledWith("주소가 복사되었습니다.");
  });

  it("clipboard 실패 시 에러 토스트를 띄운다", async () => {
    writeText.mockRejectedValue(new Error("denied"));
    const match = {
      venue: { address: "실패 주소" },
    } as MatchNode;

    render(<CopyTrigger match={match} />);
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "주소 복사" }));
    });

    expect(toast.error).toHaveBeenCalledWith("주소 복사에 실패했습니다.");
  });
});
