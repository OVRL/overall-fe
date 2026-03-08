import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import RegisterGameModal from "../RegisterGameModal";
import { getRegisterGameDefaultValues } from "../schema";
import type { RegisterGameValues } from "../schema";
import "@testing-library/jest-dom";

const mockHideModal = jest.fn();
const mockOpenAddressModal = jest.fn();
const mockHideAddressModal = jest.fn();
const mockResetToDefaults = jest.fn();

jest.mock("@/hooks/useModal", () => ({
  __esModule: true,
  default: (key?: string) => {
    if (key === "DETAIL_ADDRESS_SEARCH") {
      return {
        openModal: mockOpenAddressModal,
        hideModal: mockHideAddressModal,
      };
    }
    return { hideModal: mockHideModal };
  },
}));

jest.mock("next/dynamic", () => ({
  __esModule: true,
  default: () =>
    function MockNaverMap() {
      return <div data-testid="naver-map" />;
    },
}));

const defaultFormValues = getRegisterGameDefaultValues();

jest.mock("react-hook-form", () => {
  const actual = jest.requireActual("react-hook-form");
  const defaults = jest
    .requireActual("../schema")
    .getRegisterGameDefaultValues();
  return {
    ...actual,
    useWatch: (opts: { name: string }) => {
      if (opts.name === "matchType") return "MATCH";
      if (opts.name === "venue") return defaults.venue;
      return undefined;
    },
    Controller: (props: {
      name: keyof RegisterGameValues;
      control: unknown;
      render: (opts: {
        field: { value: unknown; onChange: (v: unknown) => void };
        fieldState: { error?: { message?: string } };
      }) => React.ReactElement;
    }) => {
      const value = (defaults as Record<string, unknown>)[props.name] ?? "";
      return props.render({
        field: { value, onChange: jest.fn() },
        fieldState: {},
      });
    },
  };
});

jest.mock("../useRegisterGameForm", () => ({
  useRegisterGameForm: jest.fn(),
}));

const mockUseRegisterGameForm = jest.requireMock(
  "../useRegisterGameForm",
).useRegisterGameForm;

function createMockForm(overrides = {}) {
  const register = jest.fn(() => ({
    onChange: jest.fn(),
    onBlur: jest.fn(),
    ref: jest.fn(),
  }));
  const setValue = jest.fn();
  const handleSubmit = jest.fn(
    (fn: (data: unknown) => void) => (e: React.FormEvent) => {
      e?.preventDefault();
      fn(defaultFormValues);
    },
  );
  return {
    control: {},
    register,
    handleSubmit,
    setValue,
    formState: { isValid: true },
    ...overrides,
  };
}

describe("RegisterGameModal", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseRegisterGameForm.mockReturnValue({
      form: createMockForm(),
      resetToDefaults: mockResetToDefaults,
    });
  });

  it("모달 타이틀과 주요 섹션이 렌더링된다", () => {
    render(<RegisterGameModal />);

    expect(screen.getByText("경기 등록")).toBeInTheDocument();
    expect(screen.getByText("경기 성격")).toBeInTheDocument();
    expect(screen.getByText("일정")).toBeInTheDocument();
    expect(screen.getByText("경기 장소")).toBeInTheDocument();
    expect(screen.getByText("쿼터")).toBeInTheDocument();
    expect(screen.getByText("투표 마감 일정")).toBeInTheDocument();
    expect(screen.getByText("메모")).toBeInTheDocument();
  });

  it("등록·취소 버튼이 렌더링된다", () => {
    render(<RegisterGameModal />);

    expect(screen.getByRole("button", { name: "등록" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "취소" })).toBeInTheDocument();
  });

  it("취소 버튼 클릭 시 resetToDefaults와 hideModal이 호출된다", () => {
    render(<RegisterGameModal />);

    fireEvent.click(screen.getByRole("button", { name: "취소" }));

    expect(mockResetToDefaults).toHaveBeenCalledTimes(1);
    expect(mockHideModal).toHaveBeenCalledTimes(1);
  });

  it("폼 제출 시 handleSubmit 콜백이 호출된 뒤 hideModal이 호출된다", () => {
    const handleSubmitFn = jest.fn(
      (fn: (data: unknown) => void) => (e: React.FormEvent) => {
        e?.preventDefault();
        fn(defaultFormValues);
      },
    );
    mockUseRegisterGameForm.mockReturnValue({
      form: createMockForm({ handleSubmit: handleSubmitFn }),
      resetToDefaults: mockResetToDefaults,
    });

    render(<RegisterGameModal />);
    fireEvent.click(screen.getByRole("button", { name: "등록" }));

    expect(handleSubmitFn).toHaveBeenCalled();
    expect(mockHideModal).toHaveBeenCalledTimes(1);
  });

  it("경기 성격이 매칭일 때 상대팀 입력 필드가 노출된다", () => {
    mockUseRegisterGameForm.mockReturnValue({
      form: createMockForm(),
      resetToDefaults: mockResetToDefaults,
    });
    render(<RegisterGameModal />);

    expect(
      screen.getByPlaceholderText("상대팀 이름을 입력해주세요."),
    ).toBeInTheDocument();
  });
});
