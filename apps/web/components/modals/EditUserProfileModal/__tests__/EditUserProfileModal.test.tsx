import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import EditUserProfileModal from "../EditUserProfileModal";
import type { UserProfileEditFormInitial } from "../types";
import { useEditUserProfileForm } from "../hooks/useEditUserProfileForm";

const mockHideModal = jest.fn();
const mockOpenAddressModal = jest.fn();
const mockOpenPositionModal = jest.fn();
const mockHandleSubmit = jest.fn();

jest.mock("@/hooks/useModal", () => ({
  __esModule: true,
  default: (key?: string) => {
    if (key === "ADDRESS_SEARCH") {
      return { openModal: mockOpenAddressModal };
    }
    if (key === "USER_POSITION_PICKER") {
      return { openModal: mockOpenPositionModal };
    }
    return { hideModal: mockHideModal };
  },
}));

jest.mock("../hooks/useEditUserProfileForm");

jest.mock("@/components/ui/TextField", () => ({
  __esModule: true,
  default: function MockTextField(props: {
    label: string;
    value: string;
    readOnly?: boolean;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  }) {
    return (
      <div>
        <span>{props.label}</span>
        {props.readOnly ? (
          <span data-testid={`field-value-${props.label}`}>{props.value}</span>
        ) : (
          <input
            data-testid={`input-${props.label}`}
            aria-label={props.label}
            value={props.value}
            onChange={props.onChange}
          />
        )}
      </div>
    );
  },
}));

jest.mock("@/components/OnboardingPositionChip", () => ({
  __esModule: true,
  default: ({ position }: { position: string }) => (
    <span data-testid="position-chip">{position}</span>
  ),
}));

jest.mock("@/components/ui/Icon", () => ({
  __esModule: true,
  default: () => <span data-testid="edit-icon" />,
}));

const mockInitial: UserProfileEditFormInitial = {
  id: 1,
  name: "테스트",
  birthDate: "1999-01-01",
  activityArea: "서울",
  activityAreaCode: "11000",
  mainPosition: "ST",
  subPositions: ["LW"],
  foot: "R",
  height: "180",
  weight: "75",
  favoritePlayer: "손흥민",
};

describe("EditUserProfileModal", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.mocked(useEditUserProfileForm).mockImplementation((initial) => {
      const [form, setForm] = React.useState(() => ({
        ...initial,
        subPositions: [...initial.subPositions],
      }));
      return {
        form,
        setForm,
        handleSubmit: mockHandleSubmit,
        isSubmitting: false,
      };
    });
  });

  it("제목과 초기 폼 값을 렌더링한다", () => {
    render(<EditUserProfileModal initial={mockInitial} />);

    expect(screen.getByRole("heading", { name: "프로필 수정" })).toBeInTheDocument();
    expect(screen.getByTestId("field-value-이름")).toHaveTextContent("테스트");
    expect(screen.getByTestId("field-value-생년월일")).toHaveTextContent("1999-01-01");
    expect(screen.getByTestId("field-value-활동지역")).toHaveTextContent("서울");
    const chips = screen.getAllByTestId("position-chip");
    expect(chips.map((el) => el.textContent)).toEqual(["ST", "LW"]);
    expect(screen.getByTestId("input-신장")).toHaveDisplayValue("180");
    expect(screen.getByTestId("input-좋아하는 선수")).toHaveDisplayValue("손흥민");
  });

  it("취소 버튼 클릭 시 hideModal을 호출한다", () => {
    render(<EditUserProfileModal initial={mockInitial} />);

    fireEvent.click(screen.getByRole("button", { name: "취소" }));

    expect(mockHideModal).toHaveBeenCalledTimes(1);
  });

  it("저장 버튼 클릭 시 handleSubmit을 호출한다", () => {
    render(<EditUserProfileModal initial={mockInitial} />);

    fireEvent.click(screen.getByRole("button", { name: "저장" }));

    expect(mockHandleSubmit).toHaveBeenCalledTimes(1);
  });

  it("활동지역 영역 클릭 시 주소 검색 모달을 연다", () => {
    render(<EditUserProfileModal initial={mockInitial} />);

    fireEvent.click(screen.getByRole("button", { name: /활동지역/i }));

    expect(mockOpenAddressModal).toHaveBeenCalledTimes(1);
    expect(mockOpenAddressModal.mock.calls[0][0]).toEqual(
      expect.objectContaining({
        onComplete: expect.any(Function),
      }),
    );
  });

  it("주소 선택 완료 시 활동지역 필드가 갱신된다", () => {
    render(<EditUserProfileModal initial={mockInitial} />);

    fireEvent.click(screen.getByRole("button", { name: /활동지역/i }));
    const onComplete = mockOpenAddressModal.mock.calls[0][0].onComplete as (args: {
      address: string;
      code: string;
    }) => void;

    act(() => {
      onComplete({ address: "부산광역시", code: "26000" });
    });

    expect(screen.getByTestId("field-value-활동지역")).toHaveTextContent("부산광역시");
  });

  it("주 포지션 편집 클릭 시 포지션 피커를 연다", () => {
    render(<EditUserProfileModal initial={mockInitial} />);

    fireEvent.click(screen.getByRole("button", { name: "주 포지션 편집" }));

    expect(mockOpenPositionModal).toHaveBeenCalledWith(
      expect.objectContaining({
        mode: "main",
        mainPosition: "ST",
        subPositions: ["LW"],
        onConfirm: expect.any(Function),
      }),
    );
  });

  it("서브 포지션 편집 클릭 시 포지션 피커를 연다", () => {
    render(<EditUserProfileModal initial={mockInitial} />);

    fireEvent.click(screen.getByRole("button", { name: "서브 포지션 편집" }));

    expect(mockOpenPositionModal).toHaveBeenCalledWith(
      expect.objectContaining({
        mode: "sub",
        mainPosition: "ST",
        subPositions: ["LW"],
        onConfirm: expect.any(Function),
      }),
    );
  });

  it("저장 중일 때 스크린 리더용 로딩 문구가 표시된다", () => {
    jest.mocked(useEditUserProfileForm).mockImplementationOnce(() => ({
      form: mockInitial,
      setForm: jest.fn(),
      handleSubmit: mockHandleSubmit,
      isSubmitting: true,
    }));

    render(<EditUserProfileModal initial={mockInitial} />);

    expect(screen.getByText("프로필 저장 중")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "프로필 저장 중" })).toHaveAttribute(
      "aria-busy",
      "true",
    );
  });
});
