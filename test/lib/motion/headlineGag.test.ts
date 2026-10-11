import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { setMediaQueryMatches } from "@test/support/matchMedia";
import { gagFirstLine, headlineGagAttribute, headlineGagScript } from "@/lib/motion/headlineGag";
import { reducedMotionQuery } from "@/lib/motion/reducedMotion";

function runGagScript() {
  new Function(headlineGagScript)();
  return document.documentElement.hasAttribute(headlineGagAttribute);
}

describe("headlineGag", () => {
  beforeEach(() => {
    sessionStorage.clear();
    window.history.pushState({}, "", "/");
  });

  afterEach(() => {
    document.documentElement.removeAttribute(headlineGagAttribute);
  });

  it("arms the gag on the first home page load of the session only", () => {
    expect(runGagScript()).toBe(true);

    document.documentElement.removeAttribute(headlineGagAttribute);
    expect(runGagScript()).toBe(false);
  });

  it("skips the gag with reduced motion or away from the home page", () => {
    setMediaQueryMatches(reducedMotionQuery, true);
    expect(runGagScript()).toBe(false);

    setMediaQueryMatches(reducedMotionQuery, false);
    window.history.pushState({}, "", "/missing");
    expect(runGagScript()).toBe(false);
  });

  it("spells the first line for each stage", () => {
    expect(gagFirstLine("typo")).toEqual({ beforeCursor: "FULL-STU", afterCursor: "CK" });
    expect(gagFirstLine("deleted")).toEqual({ beforeCursor: "FULL-ST", afterCursor: "CK" });
    expect(gagFirstLine("done")).toEqual({ beforeCursor: "FULL-STA", afterCursor: "CK" });
  });
});
