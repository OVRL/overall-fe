import { render, screen, fireEvent, within } from "@testing-library/react";
import TeamSelector from "../TeamSelector";

jest.mock("@/hooks/useClickOutside", () => ({
  useClickOutside: jest.fn(),
}));

jest.mock("next/image", () => ({
  __esModule: true,
  default: ({ src, alt }: { src: string; alt: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} data-testid="team-image" />
  ),
}));

jest.mock("@/components/ui/Icon", () => {
  return function MockIcon() {
    return <span data-testid="icon" />;
  };
});

jest.mock("motion/react", () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

describe("TeamSelector", () => {
  const teams = [
    { id: "1", name: "팀A", imageUrl: "/img/a.png" },
    { id: "2", name: "팀B", imageUrl: "/img/b.png" },
  ];

  const defaultProps = {
    teams,
    selectedTeamId: null,
    onSelect: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("팀이 없을 때 팀 만들기 버튼이 표시된다", () => {
    render(
      <TeamSelector teams={[]} selectedTeamId={null} onSelect={jest.fn()} />,
    );
    expect(screen.getByText("팀 만들기")).toBeInTheDocument();
  });

  it("팀이 있고 선택이 없을 때 트리거 클릭 시 드롭다운 목록이 보인다", () => {
    render(<TeamSelector {...defaultProps} />);
    const combobox = screen.getByRole("combobox", { name: /팀 선택/i });
    const trigger = within(combobox).getByRole("button", { name: /팀 만들기/i });
    fireEvent.click(trigger);
    expect(screen.getByRole("listbox")).toBeInTheDocument();
    expect(screen.getByRole("option", { name: /팀A/i })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: /팀B/i })).toBeInTheDocument();
  });

  it("선택된 팀이 있으면 트리거에 해당 팀 이름이 표시된다", () => {
    render(
      <TeamSelector {...defaultProps} selectedTeamId="1" />,
    );
    expect(screen.getByText("팀A")).toBeInTheDocument();
  });

  it("팀 옵션 클릭 시 onSelect가 해당 팀 id로 호출되고 드롭다운이 닫힌다", () => {
    const onSelect = jest.fn();
    render(<TeamSelector {...defaultProps} onSelect={onSelect} />);
    const combobox = screen.getByRole("combobox");
    fireEvent.click(within(combobox).getByRole("button"));
    fireEvent.click(screen.getByRole("option", { name: /팀B/i }));
    expect(onSelect).toHaveBeenCalledWith("2");
  });

  it("onCreateTeam이 있으면 팀 만들기 버튼이 목록 아래에 있고 클릭 시 호출된다", () => {
    const onCreateTeam = jest.fn();
    render(
      <TeamSelector
        {...defaultProps}
        onCreateTeam={onCreateTeam}
      />,
    );
    const combobox = screen.getByRole("combobox");
    fireEvent.click(within(combobox).getByRole("button"));
    const listbox = screen.getByRole("listbox");
    const createButton = within(listbox).getByRole("button", { name: /팀 만들기/i });
    expect(createButton).toBeInTheDocument();
    fireEvent.click(createButton);
    expect(onCreateTeam).toHaveBeenCalledTimes(1);
  });
});
