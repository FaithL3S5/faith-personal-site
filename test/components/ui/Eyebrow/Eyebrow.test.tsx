import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Eyebrow } from "@/components/ui/Eyebrow/Eyebrow";

describe("Eyebrow", () => {
  it("keeps the square out of the accessible text", () => {
    const { container } = render(
      <>
        <Eyebrow className="extra">Walkthrough</Eyebrow>
        <Eyebrow>Lost</Eyebrow>
      </>,
    );
    expect(container.textContent).toBe("WalkthroughLost");
    expect(container.querySelectorAll("[aria-hidden='true']")).toHaveLength(2);
  });
});
