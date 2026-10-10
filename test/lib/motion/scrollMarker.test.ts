import { describe, expect, it } from "vitest";
import { currentSectionNumber, scrollProgress, shouldFlipLabel } from "@/lib/motion/scrollMarker";

describe("scrollMarker", () => {
  it("maps the scroll position to 0 at the top and 1 at the bottom", () => {
    expect(scrollProgress(0, 5000, 1000)).toBe(0);
    expect(scrollProgress(2000, 5000, 1000)).toBe(0.5);
    expect(scrollProgress(4000, 5000, 1000)).toBe(1);
    expect(scrollProgress(4200, 5000, 1000)).toBe(1);
  });

  it("stays at 0 when the page does not scroll", () => {
    expect(scrollProgress(0, 800, 1000)).toBe(0);
  });

  it("names the hero 00 and then the last section that has passed the probe", () => {
    const sections = [
      { number: "01", top: 900 },
      { number: "02", top: 1500 },
    ];
    expect(currentSectionNumber(sections, 100)).toBe("00");
    expect(currentSectionNumber(sections, 900)).toBe("01");
    expect(currentSectionNumber(sections, 2000)).toBe("02");
  });

  it("flips the label before it would clip at the right edge", () => {
    expect(shouldFlipLabel(100, 1000, 30)).toBe(false);
    expect(shouldFlipLabel(980, 1000, 30)).toBe(true);
  });
});
