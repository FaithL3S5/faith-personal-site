import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SkipLink } from "@/components/layout/SkipLink/SkipLink";

describe("SkipLink", () => {
  it("jumps to the main content", () => {
    render(<SkipLink />);
    expect(screen.getByRole("link", { name: "Skip to content" }).getAttribute("href")).toBe("#main");
  });
});
