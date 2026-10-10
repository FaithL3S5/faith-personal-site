import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { DotMatrix } from "@/components/ui/DotMatrix/DotMatrix";

describe("DotMatrix", () => {
  it("draws one dot per grid cell plus the crimson circle", () => {
    const { container } = render(<DotMatrix columns={11} rows={6} circleLeft={105} tone="ink" />);
    const svg = container.querySelector("svg");
    expect(svg?.getAttribute("aria-hidden")).toBe("true");
    expect(svg?.querySelectorAll("[data-column]")).toHaveLength(66);
    expect(svg?.style.width).toBe("9.625rem");
  });
});
