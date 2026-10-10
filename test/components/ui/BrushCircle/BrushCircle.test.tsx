import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
  BrushCircle,
  BrushCircleSprite,
  brushCircleSymbolId,
} from "@/components/ui/BrushCircle/BrushCircle";

describe("BrushCircle", () => {
  it("points every brush circle at the shared symbol", () => {
    const { container } = render(
      <>
        <BrushCircleSprite />
        <BrushCircle className="extra" />
        <BrushCircle />
      </>,
    );
    expect(container.querySelector(`symbol#${brushCircleSymbolId}`)).not.toBeNull();
    expect(container.querySelectorAll("use")).toHaveLength(2);
    expect(container.querySelector("use")?.getAttribute("href")).toBe(`#${brushCircleSymbolId}`);
  });
});
