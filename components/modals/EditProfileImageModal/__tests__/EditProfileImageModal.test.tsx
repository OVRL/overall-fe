import { render, screen, fireEvent } from "@testing-library/react";
import EditProfileImageModal from "../EditProfileImageModal";
import useEditProfileImage from "../hooks/useEditProfileImage";

// 커스텀 훅 모킹
jest.mock("../hooks/useEditProfileImage");

// 자식 컴포넌트 모킹
jest.mock("../ProfileImageCanvas", () => {
  return function DummyProfileImageCanvas({ imageSrc }: { imageSrc: string }) {
    return <div data-testid="profile-image-canvas">{imageSrc}</div>;
  };
});
jest.mock(
  "../../ModalLayout",
  () =>
    function MockModalLayout({
      children,
      title,
    }: {
      children: React.ReactNode;
      title: string;
    }) {
      return (
        <div>
          <h1>{title}</h1>
          {children}
        </div>
      );
    },
);
jest.mock("@/components/ui/Button", () => ({
  Button: ({
    children,
    onClick,
  }: {
    children: React.ReactNode;
    onClick: () => void;
  }) => <button onClick={onClick}>{children}</button>,
}));

describe("EditProfileImageModal", () => {
  const mockOnSave = jest.fn();
  const mockHandleSave = jest.fn();
  const mockHandleRemoveBackground = jest.fn();
  const mockHandleFileClick = jest.fn();
  const mockHandleFileChange = jest.fn();
  const mockRef = { current: null };

  const defaultHookValues = {
    currentImage: "test-image.jpg",
    canvasRef: mockRef,
    fileInputRef: mockRef,
    handleFileChange: mockHandleFileChange,
    handleSave: mockHandleSave,
    handleRemoveBackground: mockHandleRemoveBackground,
    handleFileClick: mockHandleFileClick,
  };

  beforeEach(() => {
    (useEditProfileImage as jest.Mock).mockReturnValue(defaultHookValues);
    jest.clearAllMocks();
  });

  it("정상적으로 렌더링된다", () => {
    render(
      <EditProfileImageModal
        initialImage="test-image.jpg"
        onSave={mockOnSave}
      />,
    );

    expect(screen.getByText("프로필 이미지 편집")).toBeInTheDocument();
    expect(screen.getByText("사진 변경")).toBeInTheDocument();
    expect(screen.getByText("배경 제거")).toBeInTheDocument();
    expect(screen.getByText("저장")).toBeInTheDocument();
  });

  it("저장 버튼 클릭 시 handleSave를 호출한다", () => {
    render(
      <EditProfileImageModal
        initialImage="test-image.jpg"
        onSave={mockOnSave}
      />,
    );

    fireEvent.click(screen.getByText("저장"));
    expect(mockHandleSave).toHaveBeenCalled();
  });

  it("배경 제거 버튼 클릭 시 handleRemoveBackground를 호출한다", () => {
    render(
      <EditProfileImageModal
        initialImage="test-image.jpg"
        onSave={mockOnSave}
      />,
    );

    fireEvent.click(screen.getByText("배경 제거"));
    expect(mockHandleRemoveBackground).toHaveBeenCalled();
  });

  it("사진 변경 버튼 클릭 시 handleFileClick을 호출한다", () => {
    render(
      <EditProfileImageModal
        initialImage="test-image.jpg"
        onSave={mockOnSave}
      />,
    );

    fireEvent.click(screen.getByText("사진 변경"));
    expect(mockHandleFileClick).toHaveBeenCalled();
  });
});
