import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MomVoteRankPicker } from "../MomVoteRankPicker";

describe("MomVoteRankPicker", () => {
  const options = [
    { label: "플레이어 A", value: "10" },
    { label: "플레이어 B", value: "20" },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("rank=1일 때 라벨·id·htmlFor와 트리거 id를 연결한다", () => {
    const onChange = jest.fn();
    render(
      <MomVoteRankPicker
        rank={1}
        options={options}
        value={undefined}
        onChange={onChange}
      />,
    );

    expect(screen.getByText("MOM TOP1")).toBeInTheDocument();

    const label = document.getElementById("mom-vote-label-top1");
    const trigger = document.getElementById("mom-vote-top1");

    expect(label).not.toBeNull();
    expect(trigger).not.toBeNull();
    expect(label).toHaveAttribute("for", "mom-vote-top1");
  });

  it("드롭다운에서 옵션을 선택하면 onChange에 해당 value를 넘긴다", () => {
    const onChange = jest.fn();
    render(
      <MomVoteRankPicker
        rank={1}
        options={options}
        value={undefined}
        onChange={onChange}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "MOM TOP1" }));

    fireEvent.click(screen.getByRole("option", { name: "플레이어 B" }));

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith("20");
  });
});
