import { render, screen, fireEvent } from "@testing-library/react";
import { PendingActionButton } from "../ui/PendingActionButton";

describe("PendingActionButton", () => {
  it("pending이 아니면 children을 표시한다", () => {
    render(
      <PendingActionButton pending={false} pendingLabel="처리 중">
        저장
      </PendingActionButton>,
    );
    const button = screen.getByRole("button", { name: "저장" });
    expect(button).toBeInTheDocument();
    expect(button.getAttribute("aria-busy")).not.toBe("true");
    expect(screen.queryByText("처리 중")).not.toBeInTheDocument();
  });

  it("pending이면 스피너 라벨(sr-only)과 aria-busy를 설정하고 비활성화한다", () => {
    render(
      <PendingActionButton pending pendingLabel="처리 중입니다">
        저장
      </PendingActionButton>,
    );
    const button = screen.getByRole("button", { name: "처리 중입니다" });
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("aria-busy", "true");
    expect(document.body).toHaveTextContent("처리 중입니다");
    expect(screen.queryByRole("button", { name: "저장" })).not.toBeInTheDocument();
  });

  it("disabled와 pending을 병합한다 — 다른 이유만 disabled여도 pending이 아니면 클릭 가능", () => {
    const onClick = jest.fn();
    render(
      <PendingActionButton
        pending={false}
        pendingLabel="처리 중"
        disabled={false}
        onClick={onClick}
      >
        실행
      </PendingActionButton>,
    );
    fireEvent.click(screen.getByRole("button", { name: "실행" }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("pending이면 onClick이 호출되지 않는다", () => {
    const onClick = jest.fn();
    render(
      <PendingActionButton pending pendingLabel="로딩 중" onClick={onClick}>
        제출
      </PendingActionButton>,
    );
    fireEvent.click(screen.getByRole("button", { name: "로딩 중" }));
    expect(onClick).not.toHaveBeenCalled();
  });

  it("pending이면 버튼에 cursor-wait 클래스를 붙인다", () => {
    render(
      <PendingActionButton pending pendingLabel="대기">
        확인
      </PendingActionButton>,
    );
    expect(screen.getByRole("button", { name: "대기" })).toHaveClass("cursor-wait");
  });

  it("spinnerSize에 따라 스피너 크기 클래스를 전달한다", () => {
    const { rerender } = render(
      <PendingActionButton pending pendingLabel="로딩" spinnerSize="sm">
        A
      </PendingActionButton>,
    );
    let button = screen.getByRole("button", { name: "로딩" });
    expect(button.querySelector(".size-6")).not.toBeNull();
    expect(button.querySelector(".size-8")).toBeNull();

    rerender(
      <PendingActionButton pending pendingLabel="로딩" spinnerSize="md">
        A
      </PendingActionButton>,
    );
    button = screen.getByRole("button", { name: "로딩" });
    expect(button.querySelector(".size-8")).not.toBeNull();
    expect(button.querySelector(".size-6")).toBeNull();
  });

  it("disabled만 true이면 비활성이지만 aria-busy는 true가 아니다", () => {
    render(
      <PendingActionButton pending={false} pendingLabel="처리 중" disabled>
        실행
      </PendingActionButton>,
    );
    const button = screen.getByRole("button", { name: "실행" });
    expect(button).toBeDisabled();
    expect(button).not.toHaveAttribute("aria-busy", "true");
  });

  it("다른 버튼이 로딩 중일 때 이 버튼만 disabled인 경우 스피너를 띄우지 않는다", () => {
    render(
      <PendingActionButton
        pending={false}
        pendingLabel="가입 취소 처리 중"
        disabled
      >
        가입 신청
      </PendingActionButton>,
    );
    expect(screen.getByRole("button", { name: "가입 신청" })).toBeInTheDocument();
    expect(screen.queryByText("가입 취소 처리 중")).not.toBeInTheDocument();
  });

  it("Button variant 등 하위 props를 전달한다", () => {
    render(
      <PendingActionButton
        pending={false}
        pendingLabel="로딩"
        variant="ghost"
        size="xl"
        className="flex-1"
      >
        취소
      </PendingActionButton>,
    );
    const button = screen.getByRole("button", { name: "취소" });
    expect(button).toHaveClass("bg-Fill_Quatiary", "flex-1");
  });
});
