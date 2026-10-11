import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { FooterTrees } from "@/components/layout/FooterTrees/FooterTrees";

describe("FooterTrees", () => {
  it("renders two different decorative bonsai", () => {
    const { container } = render(<FooterTrees />);

    const trees = [...container.querySelectorAll("img")];
    expect(trees.map((tree) => tree.getAttribute("alt"))).toEqual(["", ""]);
    expect(trees.every((tree) => tree.getAttribute("aria-hidden") === "true")).toBe(true);
    expect(trees[0].getAttribute("src")).toContain("tree-1-white.svg");
    expect(trees[1].getAttribute("src")).toContain("tree-2-white.svg");
  });
});
