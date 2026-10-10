import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Arrow, type ArrowDirection } from "@/components/ui/Arrow/Arrow";

describe("Arrow", () => {
  it.each<ArrowDirection>(["down", "download", "out", "up", "back", "retry"])(
    "draws the %s arrow as a hidden icon",
    (direction) => {
      const { container } = render(<Arrow direction={direction} size="small" />);
      const arrow = container.querySelector(`[data-arrow='${direction}']`);
      expect(arrow?.getAttribute("aria-hidden")).toBe("true");
      expect(arrow?.querySelector("path")?.getAttribute("d")).toBeTruthy();
    },
  );
});
