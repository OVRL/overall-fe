import { render, screen, fireEvent } from "@testing-library/react";
import RegisterGameButton from "../RegisterGameButton";

const mockOpenModal = jest.fn();

jest.mock("@/hooks/useModal", () => ({
  __esModule: true,
  default: () => ({ openModal: mockOpenModal }),
}));

describe("RegisterGameButton", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("경기 등록하기 버튼이 렌더링된다", () => {
    render(<RegisterGameButton />);
    expect(
      screen.getByRole("button", { name: /경기 등록하기/i }),
    ).toBeInTheDocument();
  });

  it("클릭 시 openModal(REGISTER_GAME)이 호출된다", () => {
    render(<RegisterGameButton />);
    fireEvent.click(screen.getByRole("button", { name: /경기 등록하기/i }));
    expect(mockOpenModal).toHaveBeenCalledWith({});
    expect(mockOpenModal).toHaveBeenCalledTimes(1);
  });
});
