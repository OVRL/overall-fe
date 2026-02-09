import { render, screen, fireEvent } from "@testing-library/react";
import EditProfileImageModal from "../EditProfileImageModal";
import useEditProfileImage from "../useEditProfileImage";

// Mock the custom hook
jest.mock("../useEditProfileImage");

// Mock child components
jest.mock("../ProfileImageCanvas", () => {
  return function DummyProfileImageCanvas({ imageSrc }: { imageSrc: string }) {
    return <div data-testid="profile-image-canvas">{imageSrc}</div>;
  };
});
jest.mock(
  "../../ModalLayout",
  () =>
    ({ children, title }: { children: React.ReactNode; title: string }) => (
      <div>
        <h1>{title}</h1>
        {children}
      </div>
    ),
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

  it("renders correctly", () => {
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

  it("calls handleSave when save button is clicked", () => {
    render(
      <EditProfileImageModal
        initialImage="test-image.jpg"
        onSave={mockOnSave}
      />,
    );

    fireEvent.click(screen.getByText("저장"));
    expect(mockHandleSave).toHaveBeenCalled();
  });

  it("calls handleRemoveBackground when background remove button is clicked", () => {
    render(
      <EditProfileImageModal
        initialImage="test-image.jpg"
        onSave={mockOnSave}
      />,
    );

    fireEvent.click(screen.getByText("배경 제거"));
    expect(mockHandleRemoveBackground).toHaveBeenCalled();
  });

  it("calls handleFileClick when change photo button is clicked", () => {
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
