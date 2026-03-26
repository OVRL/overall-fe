import { renderHook } from "@testing-library/react";
import { SHOW_TEAM_CREATED_MODAL_KEY } from "@/lib/teamCreatedModalStorage";

const openModal = jest.fn();

jest.mock("../useModal", () => ({
  __esModule: true,
  default: jest.fn(() => ({ openModal })),
}));

import { useTeamCreatedModalTrigger } from "../useTeamCreatedModalTrigger";

describe("useTeamCreatedModalTrigger", () => {
  beforeEach(() => {
    openModal.mockClear();
    sessionStorage.clear();
  });

  it("sessionStorage 플래그가 1이면 openModal 후 키를 제거한다", () => {
    sessionStorage.setItem(SHOW_TEAM_CREATED_MODAL_KEY, "1");

    renderHook(() => useTeamCreatedModalTrigger());

    expect(openModal).toHaveBeenCalledWith({});
    expect(sessionStorage.getItem(SHOW_TEAM_CREATED_MODAL_KEY)).toBeNull();
  });

  it("플래그가 없으면 openModal을 호출하지 않는다", () => {
    renderHook(() => useTeamCreatedModalTrigger());
    expect(openModal).not.toHaveBeenCalled();
  });
});
