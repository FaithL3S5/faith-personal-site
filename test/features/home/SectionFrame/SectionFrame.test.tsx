import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { triggerIntersection } from "@test/support/intersectionObserver";
import { setMediaQueryMatches } from "@test/support/matchMedia";
import { SectionFrame } from "@/features/home/SectionFrame/SectionFrame";
import { hasPlayed, resetPlayedKeys } from "@/lib/motion/playOnce";
import { reducedMotionQuery } from "@/lib/motion/reducedMotion";

function renderStackFrame(hasBottomRule?: boolean) {
  return render(
    <SectionFrame
      sectionId="stack"
      contentClassName="content"
      hasBottomRule={hasBottomRule}
      decoration={<span data-testid="decoration" />}
    >
      <p data-reveal-item="">Body</p>
    </SectionFrame>,
  );
}

describe("SectionFrame", () => {
  beforeEach(() => {
    resetPlayedKeys();
  });

  it("labels the section by its heading and anchors it by id", () => {
    const { container } = renderStackFrame();

    const section = screen.getByRole("region", { name: "Stack" });
    expect(section.id).toBe("stack");
    expect(container.querySelector("[data-count-up]")?.textContent).toBe("04");
    expect(screen.getByTestId("decoration")).toBeTruthy();
    expect(container.querySelectorAll("[data-hairline='horizontal']")).toHaveLength(2);
  });

  it("leaves out the bottom rule when asked", () => {
    const { container } = renderStackFrame(false);
    expect(container.querySelectorAll("[data-hairline='horizontal']")).toHaveLength(1);
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

  it("hides its content until it scrolls into view, then reveals it once", () => {
    const { container, unmount } = renderStackFrame();
    const body = screen.getByText("Body");
    expect(body.style.opacity).toBe("0");

    triggerIntersection(container.querySelector("section") as Element, true);
    expect(hasPlayed("section-04")).toBe(true);

    unmount();
    const remounted = renderStackFrame();
    expect(remounted.getByText("Body").style.opacity).toBe("");
  });

  it("holds the number at its final width while it counts up", () => {
    const { container, unmount } = renderStackFrame();
    const number = container.querySelector<HTMLElement>("[data-count-up]") as HTMLElement;
    vi.spyOn(number, "getBoundingClientRect").mockReturnValue({ width: 96 } as DOMRect);

    triggerIntersection(container.querySelector("section") as Element, true);
    expect(number.style.width).toBe("96px");
    expect(number.textContent).toBe("00");

    unmount();
    expect(number.style.width).toBe("");
    expect(number.textContent).toBe("04");
  });

  it("keeps everything at rest with reduced motion", () => {
    setMediaQueryMatches(reducedMotionQuery, true);
    renderStackFrame();
    expect(screen.getByText("Body").style.opacity).toBe("");
  });
});
