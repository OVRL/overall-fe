import { act, render } from "@testing-library/react";
import { NativeLiquidNavModalOverlayBridge } from "../NativeLiquidNavModalOverlayBridge";

const sendToNative = jest.fn();

const bridgeState = {
  isNativeApp: false as boolean,
};

jest.mock("@/hooks/bridge/useBridge", () => ({
  useBridge: () => ({
    isNativeApp: bridgeState.isNativeApp,
    sendToNative,
  }),
}));

let pathnameMock = "/";
jest.mock("next/navigation", () => ({
  usePathname: () => pathnameMock,
}));

let modalInstances: { id: string }[] = [];
jest.mock("@/contexts/ModalContext", () => ({
  useModalStore: (selector: (s: unknown) => unknown) =>
    selector({
      modals: modalInstances,
      showModal: jest.fn(),
      closeModal: jest.fn(),
      closeAll: jest.fn(),
    }),
}));

describe("NativeLiquidNavModalOverlayBridge", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    bridgeState.isNativeApp = false;
    pathnameMock = "/";
    modalInstances = [];
  });

  it("인앱이 아니면 SET_NATIVE_LIQUID_NAV_MODAL_OVERLAY 브리지를 보내지 않는다", () => {
    bridgeState.isNativeApp = false;
    modalInstances = [{ id: "a" }];

    render(<NativeLiquidNavModalOverlayBridge />);

    expect(sendToNative).not.toHaveBeenCalledWith(
      expect.objectContaining({
        type: "SET_NATIVE_LIQUID_NAV_MODAL_OVERLAY",
      }),
    );
  });

  it("인앱이고 탭 셸 경로에서 모달이 있으면 hidden true를 보낸다", () => {
    bridgeState.isNativeApp = true;
    pathnameMock = "/";
    modalInstances = [{ id: "a" }];

    render(<NativeLiquidNavModalOverlayBridge />);

    expect(sendToNative).toHaveBeenCalledWith({
      type: "SET_NATIVE_LIQUID_NAV_MODAL_OVERLAY",
      payload: { hidden: true },
    });
  });

  it("인앱이어도 탭 셸이 아니면 모달이 있어도 hidden false를 보낸다", () => {
    bridgeState.isNativeApp = true;
    pathnameMock = "/team-management";
    modalInstances = [{ id: "a" }];

    render(<NativeLiquidNavModalOverlayBridge />);

    expect(sendToNative).toHaveBeenCalledWith({
      type: "SET_NATIVE_LIQUID_NAV_MODAL_OVERLAY",
      payload: { hidden: false },
    });
  });

  it("모달을 닫으면 hidden false를 보낸다", () => {
    bridgeState.isNativeApp = true;
    pathnameMock = "/";
    modalInstances = [{ id: "a" }];

    const { rerender } = render(<NativeLiquidNavModalOverlayBridge />);
    expect(sendToNative).toHaveBeenLastCalledWith({
      type: "SET_NATIVE_LIQUID_NAV_MODAL_OVERLAY",
      payload: { hidden: true },
    });

    modalInstances = [];
    act(() => {
      rerender(<NativeLiquidNavModalOverlayBridge />);
    });

    expect(sendToNative).toHaveBeenLastCalledWith({
      type: "SET_NATIVE_LIQUID_NAV_MODAL_OVERLAY",
      payload: { hidden: false },
    });
  });
});
