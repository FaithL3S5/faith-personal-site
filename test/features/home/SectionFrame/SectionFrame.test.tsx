import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SectionFrame } from "@/features/home/SectionFrame/SectionFrame";

describe("SectionFrame", () => {
  it("labels the section by its heading and anchors it by id", () => {
    const { container } = render(
      <SectionFrame
        sectionId="stack"
        className="extra"
        contentClassName="content"
        decoration={<span data-testid="decoration" />}
      >
        <p>Body</p>
      </SectionFrame>,
    );

    const section = screen.getByRole("region", { name: "Stack" });
    expect(section.id).toBe("stack");
    expect(container.querySelector("[data-count-up='04']")?.getAttribute("aria-hidden")).toBe("true");
    expect(screen.getByTestId("decoration")).toBeTruthy();
    expect(screen.getByText("Body")).toBeTruthy();
  });

  it("fills only the progress segment for the current section", () => {
    const { container } = render(
      <SectionFrame sectionId="work">
        <p>Body</p>
      </SectionFrame>,
    );

    const segments = [...container.querySelectorAll("[data-progress-segment]")];
    expect(segments.map((segment) => segment.hasAttribute("data-current"))).toEqual([
      false,
      true,
      false,
      false,
      false,
    ]);
    expect(container.textContent).toContain("02 / 05");
  });
});
