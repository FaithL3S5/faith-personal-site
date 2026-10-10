import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { JellyImage } from "@/components/jelly/JellyImage/JellyImage";

describe("JellyImage", () => {
  it("loads static poses from the public jelly folder", () => {
    render(<JellyImage pose="surprised" alt="Jelly, startled" />);
    expect(screen.getByRole("img", { name: "Jelly, startled" }).getAttribute("src")).toContain(
      "jelly-surprised.svg",
    );
  });
});
