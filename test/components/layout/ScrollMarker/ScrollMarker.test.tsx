import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ScrollMarker } from "@/components/layout/ScrollMarker/ScrollMarker";

describe("ScrollMarker", () => {
  it("starts on the hero and cleans up its listeners", () => {
    const { container, unmount } = render(
      <div>
        <ScrollMarker />
      </div>,
    );

    const marker = container.querySelector("span") as HTMLSpanElement;
    expect(marker.textContent).toBe("00");
    expect(marker.style.transform).toBe("translateX(0px)");
    unmount();
  });
});
