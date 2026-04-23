import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MatchAccordionItem } from "../MatchAccordionItem";
import { MOCK_MATCH_RECORDS } from "../mockMatchRecords";

// motion/react를 단순 패스스루로 두어 애니메이션·레이아웃 이슈를 피함
jest.mock("motion/react", () => {
  const ReactMod = jest.requireActual<typeof import("react")>("react");
  function stripMotionProps(props: Record<string, unknown>) {
    const next = { ...props };
    delete next.initial;
    delete next.animate;
    delete next.exit;
    delete next.transition;
    return next;
  }
  const MotionDiv = ({
    children,
    ...rest
  }: React.PropsWithChildren<Record<string, unknown>>) =>
    ReactMod.createElement(
      "div",
      stripMotionProps(rest) as React.HTMLAttributes<HTMLDivElement>,
      children,
    );
  return {
    motion: { div: MotionDiv },
    AnimatePresence: ({
      children,
    }: {
      children?: React.ReactNode;
    }) => ReactMod.createElement(ReactMod.Fragment, null, children),
  };
});

const record = MOCK_MATCH_RECORDS[0];

describe("MatchAccordionItem", () => {
  beforeEach(() => {
    Element.prototype.scrollIntoView = jest.fn();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("트리거 클릭 시 열림 상태가 토글되고 상세가 나타나야 한다", () => {
    render(<MatchAccordionItem record={record} />);

    const trigger = screen.getByRole("button", {
      name: new RegExp(record.opponentName),
    });
    expect(trigger).toHaveAttribute("aria-expanded", "false");

    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(
      screen.getByRole("heading", { name: "쿼터별 스코어" }),
    ).toBeInTheDocument();

    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  it("펼친 뒤 지연 후 scrollIntoView가 호출되어야 한다", () => {
    jest.useFakeTimers();
    render(<MatchAccordionItem record={record} />);
    const scrollIntoView = Element.prototype.scrollIntoView as jest.Mock;

    const trigger = screen.getByRole("button", {
      name: new RegExp(record.opponentName),
    });
    fireEvent.click(trigger);

    expect(scrollIntoView).not.toHaveBeenCalled();
    act(() => {
      jest.advanceTimersByTime(300);
    });
    expect(scrollIntoView).toHaveBeenCalled();
  });
});
