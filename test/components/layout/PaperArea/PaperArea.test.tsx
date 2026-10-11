import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PaperArea } from "@/components/layout/PaperArea/PaperArea";

describe("PaperArea", () => {
  it("wraps the page with two decorative wave bands", () => {
    const { container } = render(
      <PaperArea>
        <p>Page</p>
      </PaperArea>,
    );

    expect(screen.getByText("Page")).toBeTruthy();
    const bands = container.querySelectorAll("[aria-hidden='true']");
    expect(bands).toHaveLength(2);
    expect(bands[0].className).toContain("drawn");
  });
});
