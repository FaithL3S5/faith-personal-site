import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { setMediaQueryMatches } from "@test/support/matchMedia";
import { CountUpStatus } from "@/features/error/CountUpStatus/CountUpStatus";
import { reducedMotionQuery } from "@/lib/motion/reducedMotion";

describe("CountUpStatus", () => {
  it("starts the count from zero and restores the code on unmount", () => {
    const { container, unmount } = render(<CountUpStatus statusCode="5xx" className="status" />);
    const status = container.querySelector("p") as HTMLParagraphElement;
    expect(status.textContent).toMatch(/^[0-5]xx$/);

    unmount();
    expect(status.textContent).toBe("5xx");
  });

  it("shows the final code straight away with reduced motion", () => {
    setMediaQueryMatches(reducedMotionQuery, true);
    const { container } = render(<CountUpStatus statusCode="404" className="status" />);
    expect(container.textContent).toBe("404");
  });
});
