import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { HeaderWithRuler } from "@/components/layout/HeaderWithRuler/HeaderWithRuler";

describe("HeaderWithRuler", () => {
  it("renders the header followed by the ruler", () => {
    const { container } = render(<HeaderWithRuler variant="error" />);

    expect(screen.getByRole("banner")).toBeTruthy();
    expect(container.lastElementChild?.getAttribute("aria-hidden")).toBe("true");
  });

  it("adds the scroll marker only on the home page", () => {
    const home = render(<HeaderWithRuler variant="home" />);
    const homeRuler = home.container.lastElementChild as HTMLElement;
    expect(homeRuler.querySelector("[style*='translateX']")).not.toBeNull();
    home.unmount();

    const error = render(<HeaderWithRuler variant="error" />);
    const errorRuler = error.container.lastElementChild as HTMLElement;
    expect(errorRuler.querySelector("[style*='translateX']")).toBeNull();
  });
});
