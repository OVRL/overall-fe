import { render, waitFor } from "@testing-library/react";
import { toast } from "@/lib/toast";
import { SocialOAuthCallbackToast } from "@/app/login/social/SocialOAuthCallbackToast";

const replace = jest.fn();

jest.mock("next/navigation", () => ({
  useSearchParams: jest.fn(),
  usePathname: jest.fn(() => "/login/social"),
  useRouter: jest.fn(() => ({
    replace,
  })),
}));

import {
  useSearchParams as useSearchParamsMock,
} from "next/navigation";

const mockedUseSearchParams = jest.mocked(useSearchParamsMock);

describe("SocialOAuthCallbackToast", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    replace.mockClear();
  });

  it("socialErr 가 있으면 알려진 코드에 맞게 toast 후 쿼리 제거", async () => {
    mockedUseSearchParams.mockReturnValue(
      new URLSearchParams("socialErr=missing_code") as ReturnType<
        typeof useSearchParamsMock
      >,
    );

    render(<SocialOAuthCallbackToast />);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("인가 코드를 받지 못했습니다.", {
        description: "다시 로그인해 주세요.",
      });
    });

    expect(replace).toHaveBeenCalledWith("/login/social", { scroll: false });
  });

  it("알 수 없는 코드는 일반 메시지", async () => {
    mockedUseSearchParams.mockReturnValue(
      new URLSearchParams("socialErr=unknown_xyz") as ReturnType<
        typeof useSearchParamsMock
      >,
    );

    render(<SocialOAuthCallbackToast />);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        "소셜 로그인 처리 중 문제가 발생했습니다.",
      );
    });
  });
});
