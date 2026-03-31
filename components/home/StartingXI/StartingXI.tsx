import StartingXIView, { type StartingXIProps } from "./StartingXIView";

export type { StartingXIProps };

/**
 * 포메이션 카드 — UI는 클라이언트(StartingXIView)에서 렌더링
 */
export default function StartingXI(props: StartingXIProps) {
  return <StartingXIView {...props} />;
}
