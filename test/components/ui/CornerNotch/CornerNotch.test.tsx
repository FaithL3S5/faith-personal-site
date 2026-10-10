import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CornerNotch } from "@/components/ui/CornerNotch/CornerNotch";

describe("CornerNotch", () => {
  it("renders both notch marks as decoration", () => {
    const { container } = render(
      <>
        <CornerNotch mark="triangle" isOutlined />
        <CornerNotch mark="corner" isOutlined={false} className="extra" />
      </>,
    );
    expect(container.querySelectorAll("[aria-hidden='true']")).toHaveLength(2);
    expect(container.querySelector("svg path")?.getAttribute("d")).toBe("M2 2h12v12z");
  });
});
