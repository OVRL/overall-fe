import { renderHook, act } from "@testing-library/react";
import { useEditUserProfileForm } from "../useEditUserProfileForm";
import type { UserProfileEditFormInitial } from "../../types";

const mockCommit = jest.fn();

jest.mock("react-relay", () => ({
  useMutation: () => [mockCommit, false],
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

describe("useEditUserProfileForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("초기값을 올바르게 설정해야 합니다.", () => {
    const { result } = renderHook(() => useEditUserProfileForm(mockInitial));

    expect(result.current.form).toEqual(mockInitial);
    expect(result.current.isSubmitting).toBe(false);
  });

  it("form 상태를 업데이트할 수 있어야 합니다.", () => {
    const { result } = renderHook(() => useEditUserProfileForm(mockInitial));

    act(() => {
      result.current.setForm((prev) => ({ ...prev, height: "185" }));
    });

    expect(result.current.form.height).toBe("185");
  });

  it("handleSubmit 호출 시 relay commit 함수를 올바른 input과 함께 호출해야 합니다.", () => {
    const mockOnSuccess = jest.fn();
    const { result } = renderHook(() =>
      useEditUserProfileForm(mockInitial, mockOnSuccess),
    );

    act(() => {
      result.current.handleSubmit();
    });

    expect(mockCommit).toHaveBeenCalledTimes(1);
    expect(mockCommit).toHaveBeenCalledWith(
      expect.objectContaining({
        variables: {
          input: {
            id: 1,
            name: "테스트",
            birthDate: "1999-01-01",
            activityArea: "11000",
            mainPosition: "ST",
            subPositions: ["LW"],
            foot: "R",
            height: 180,
            weight: 75,
            favoritePlayer: "손흥민",
          },
        },
      }),
    );
  });
});
