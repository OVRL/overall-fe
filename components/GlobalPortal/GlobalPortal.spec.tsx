import { GlobalPortal } from "./GlobalPortal";
import { screen, render } from "@testing-library/react";
describe("Portal", () => {
  it("portal의 컨텐츠가 정상적으로 렌더링 되어야 한다.", () => {
    render(
      <GlobalPortal.Provider>
        <GlobalPortal.Consumer>
          <div data-testid="portal-content">Portal Content</div>
        </GlobalPortal.Consumer>
      </GlobalPortal.Provider>,
    );

    expect(screen.getByTestId("portal-content")).toBeInTheDocument();
  });

  it("포탈 컨테이너가 없다면 포탈 컨텐츠가 렌더링 되지 않아야 한다.", () => {
    render(
      <GlobalPortal.Consumer>
        <div data-testid="portal-content">Portal Content</div>
      </GlobalPortal.Consumer>,
    );

    expect(screen.queryByTestId("portal-content")).toBeNull();
  });
});
