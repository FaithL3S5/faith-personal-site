import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { FooterTrees } from "@/components/layout/FooterTrees/FooterTrees";

describe("FooterTrees", () => {
  it("renders the single decorative bonsai for the right corner", () => {
    const { container } = render(<FooterTrees />);

    const trees = [...container.querySelectorAll("img")];
    expect(trees).toHaveLength(1);
    expect(trees[0].getAttribute("alt")).toBe("");
    expect(trees[0].getAttribute("aria-hidden")).toBe("true");
    expect(trees[0].getAttribute("src")).toContain("tree-1-white.svg");
  });
});
