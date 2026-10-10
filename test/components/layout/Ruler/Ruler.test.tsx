import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Ruler } from "@/components/layout/Ruler/Ruler";

describe("Ruler", () => {
  it("draws the thirteen tick labels as decoration", () => {
    const { container } = render(
      <Ruler>
        <span data-testid="marker" />
      </Ruler>,
    );

    const ruler = container.firstElementChild;
    expect(ruler?.getAttribute("aria-hidden")).toBe("true");
    expect(container.querySelectorAll("[data-tick]")).toHaveLength(13);
    expect(container.querySelector("[data-tick='12']")?.textContent).toBe("12");
    expect(container.querySelector("[data-testid='marker']")).not.toBeNull();
  });
});
