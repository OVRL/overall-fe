import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MatchRecordPageHeader } from "../MatchRecordPageHeader";

const dateOptions = [
  { value: "all", label: "전체" },
  { value: "2026. 3. 5.", label: "2026. 3. 5." },
];

describe("MatchRecordPageHeader", () => {
  it("페이지 제목과 검색 폼을 렌더링해야 한다", () => {
    const onPending = jest.fn();
    const onSearch = jest.fn();
    render(
      <MatchRecordPageHeader
        dateOptions={dateOptions}
        pendingDateValue="all"
        onPendingDateChange={onPending}
        onSearchClick={onSearch}
      />,
    );

    expect(
      screen.getByRole("heading", { level: 1, name: "경기 기록" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("search", { name: "경기 기록 검색" })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "기록 검색" }),
    ).toBeInTheDocument();
  });

  it("폼 제출 시 onSearchClick이 호출되어야 한다", () => {
    const onSearch = jest.fn();
    render(
      <MatchRecordPageHeader
        dateOptions={dateOptions}
        pendingDateValue="all"
        onPendingDateChange={jest.fn()}
        onSearchClick={onSearch}
      />,
    );

    fireEvent.submit(screen.getByRole("search", { name: "경기 기록 검색" }));
    expect(onSearch).toHaveBeenCalledTimes(1);
  });
});
