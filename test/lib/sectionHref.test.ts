import { describe, expect, it } from "vitest";
import { sectionHref } from "@/lib/sectionHref";

describe("sectionHref", () => {
  it("uses in-page anchors on the home page", () => {
    expect(sectionHref("about", "home")).toBe("#about");
  });

  it("points back to the home page from error pages", () => {
    expect(sectionHref("about", "error")).toBe("/#about");
  });
});
