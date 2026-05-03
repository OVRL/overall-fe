import { renderHook, act } from "@testing-library/react";
import { useUpdateTeamMemberProfileImage } from "../useUpdateTeamMemberProfileImage";
import { useUpdateTeamMemberMutation } from "@/components/team-management/hooks/useUpdateTeamMemberMutation";
import { useBridge } from "@/hooks/bridge/useBridge";
import { useProfileImageUploadFlow } from "@/hooks/useProfileImageUploadFlow";
import { toast } from "@/lib/toast";
import { parseNumericIdFromRelayGlobalId } from "@/lib/relay/parseRelayGlobalId";

// Mocking dependencies
jest.mock("@/components/team-management/hooks/useUpdateTeamMemberMutation");
jest.mock("@/hooks/bridge/useBridge");
jest.mock("@/hooks/useProfileImageUploadFlow");
jest.mock("@/lib/toast");
jest.mock("@/lib/relay/parseRelayGlobalId");

describe("useUpdateTeamMemberProfileImage", () => {
  const mockExecuteMutation = jest.fn();
  const mockOpenPhotoPicker = jest.fn();
  const mockPickFromAlbum = jest.fn();
  const mockOnHiddenFileChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    (useUpdateTeamMemberMutation as jest.Mock).mockReturnValue({
      executeMutation: mockExecuteMutation,
      isInFlight: false,
    });

    (useBridge as jest.Mock).mockReturnValue({
      isNativeApp: false,
      openPhotoPicker: mockOpenPhotoPicker,
    });

    (useProfileImageUploadFlow as jest.Mock).mockReturnValue({
      pickFromAlbum: mockPickFromAlbum,
      fileInputRef: { current: null },
      onHiddenFileChange: mockOnHiddenFileChange,
    });

    const actualParse = jest.requireActual(
      "@/lib/relay/parseRelayGlobalId",
    ) as typeof import("@/lib/relay/parseRelayGlobalId");
    (parseNumericIdFromRelayGlobalId as jest.Mock).mockImplementation(
      actualParse.parseNumericIdFromRelayGlobalId,
    );

    global.URL.createObjectURL = jest.fn().mockReturnValue("blob:mock-object-url");
    global.URL.revokeObjectURL = jest.fn();

    global.fetch = jest.fn().mockResolvedValue({
      blob: async () => new Blob(["x"], { type: "image/jpeg" }),
    }) as jest.Mock;
  });

  it("웹 환경에서 pickFromAlbum 호출 시 useProfileImageUploadFlow의 pickFromAlbum이 실행되어야 한다", async () => {
    const { result } = renderHook(() =>
      useUpdateTeamMemberProfileImage({ memberId: 1, currentImage: "old.jpg" }),
    );

    await act(async () => {
      await result.current.pickFromAlbum();
    });

    expect(mockPickFromAlbum).toHaveBeenCalled();
    expect(mockOpenPhotoPicker).not.toHaveBeenCalled();
  });

  it("앱 환경에서 pickFromAlbum 호출 시 openPhotoPicker가 실행되어야 한다", async () => {
    mockOpenPhotoPicker.mockResolvedValue({});

    (useBridge as jest.Mock).mockReturnValue({
      isNativeApp: true,
      openPhotoPicker: mockOpenPhotoPicker,
    });

    const { result } = renderHook(() =>
      useUpdateTeamMemberProfileImage({ memberId: 1, currentImage: "old.jpg" }),
    );

    await act(async () => {
      await result.current.pickFromAlbum();
    });

    expect(mockOpenPhotoPicker).toHaveBeenCalled();
    expect(mockPickFromAlbum).not.toHaveBeenCalled();
  });

  it("앱에서 피커가 base64를 반환하면 fetch 후 뮤테이션까지 실행해야 한다", async () => {
    mockExecuteMutation.mockResolvedValue({
      updateTeamMember: { profileImg: "native.jpg" },
    });
    mockOpenPhotoPicker.mockResolvedValue({
      base64: "AAA",
      mimeType: "image/jpeg",
    });

    (useBridge as jest.Mock).mockReturnValue({
      isNativeApp: true,
      openPhotoPicker: mockOpenPhotoPicker,
    });

    const { result } = renderHook(() =>
      useUpdateTeamMemberProfileImage({ memberId: 1, currentImage: "old.jpg" }),
    );

    await act(async () => {
      await result.current.pickFromAlbum();
    });

    expect(global.fetch).toHaveBeenCalledWith("data:image/jpeg;base64,AAA");
    expect(mockExecuteMutation).toHaveBeenCalledWith({ id: 1 }, expect.any(File));
    expect(toast.success).toHaveBeenCalledWith("프로필 이미지가 수정되었습니다.");
  });

  it("Relay 글로벌 ID 문자열에서 숫자 ID를 추출해 뮤테이션에 넘겨야 한다", async () => {
    mockExecuteMutation.mockResolvedValue({
      updateTeamMember: { profileImg: "new.jpg" },
    });

    const { result } = renderHook(() =>
      useUpdateTeamMemberProfileImage({
        memberId: "TeamMember:42",
        currentImage: "old.jpg",
      }),
    );

    const onFileSelect = (useProfileImageUploadFlow as jest.Mock).mock.calls[0][0].onFileSelect;

    await act(async () => {
      await onFileSelect(new File([], "test.jpg"));
    });

    expect(mockExecuteMutation).toHaveBeenCalledWith({ id: 42 }, expect.any(File));
  });

  it("ID가 유효하지 않을 경우 토스트 에러를 표시해야 한다", async () => {
    (parseNumericIdFromRelayGlobalId as jest.Mock).mockReturnValue(null);

    const { result } = renderHook(() =>
      useUpdateTeamMemberProfileImage({ memberId: "invalid", currentImage: "old.jpg" }),
    );

    const onFileSelect = (useProfileImageUploadFlow as jest.Mock).mock.calls[0][0].onFileSelect;

    await act(async () => {
      await onFileSelect(new File([], "test.jpg"));
    });

    expect(toast.error).toHaveBeenCalledWith("유효하지 않은 팀 멤버 ID입니다.");
    expect(mockExecuteMutation).not.toHaveBeenCalled();
  });

  it("성공적으로 이미지를 저장하면 낙관적 업데이트와 뮤테이션이 순차적으로 실행되어야 한다", async () => {
    mockExecuteMutation.mockResolvedValue({
      updateTeamMember: { profileImg: "new.jpg" },
    });

    const { result } = renderHook(() =>
      useUpdateTeamMemberProfileImage({ memberId: 1, currentImage: "old.jpg" }),
    );

    const onFileSelect = (useProfileImageUploadFlow as jest.Mock).mock.calls[0][0].onFileSelect;

    await act(async () => {
      await onFileSelect(new File([], "test.jpg"));
    });

    expect(mockExecuteMutation).toHaveBeenCalledWith({ id: 1 }, expect.any(File));
    expect(toast.success).toHaveBeenCalledWith("프로필 이미지가 수정되었습니다.");
    expect(result.current.previewImage).toBe("new.jpg");
    expect(global.URL.revokeObjectURL).toHaveBeenCalledWith("blob:mock-object-url");
  });

  it("뮤테이션 실패 시 에러 토스트를 표시해야 한다", async () => {
    mockExecuteMutation.mockRejectedValue(new Error("network"));
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    const { result } = renderHook(() =>
      useUpdateTeamMemberProfileImage({ memberId: 1, currentImage: "old.jpg" }),
    );

    const onFileSelect = (useProfileImageUploadFlow as jest.Mock).mock.calls[0][0].onFileSelect;

    await act(async () => {
      await onFileSelect(new File([], "test.jpg"));
    });

    expect(toast.error).toHaveBeenCalledWith("프로필 이미지 수정에 실패했습니다.");
    expect(toast.success).not.toHaveBeenCalled();
    expect(global.URL.revokeObjectURL).toHaveBeenCalledWith("blob:mock-object-url");

    consoleSpy.mockRestore();
  });

  it("응답에 profileImg가 없으면 syncedImage가 갱신되지 않아 완료 후 currentImage로 되돌아간다", async () => {
    mockExecuteMutation.mockResolvedValue({
      updateTeamMember: { profileImg: null },
    });

    const { result } = renderHook(() =>
      useUpdateTeamMemberProfileImage({ memberId: 1, currentImage: "old.jpg" }),
    );

    const onFileSelect = (useProfileImageUploadFlow as jest.Mock).mock.calls[0][0].onFileSelect;

    await act(async () => {
      await onFileSelect(new File([], "test.jpg"));
    });

    expect(toast.success).toHaveBeenCalled();
    expect(result.current.previewImage).toBe("old.jpg");
  });
});
