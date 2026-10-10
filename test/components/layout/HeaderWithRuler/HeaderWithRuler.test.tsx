import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { HeaderWithRuler } from "@/components/layout/HeaderWithRuler/HeaderWithRuler";

describe("HeaderWithRuler", () => {
  it("renders the header followed by the ruler", () => {
    const { container } = render(<HeaderWithRuler variant="error" />);

    expect(screen.getByRole("banner")).toBeTruthy();
    expect(container.lastElementChild?.getAttribute("aria-hidden")).toBe("true");
  });
});
