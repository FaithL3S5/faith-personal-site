import { describe, expect, it } from "vitest";
import { hasPlayed, markPlayed, resetPlayedKeys } from "@/lib/motion/playOnce";

describe("playOnce", () => {
  it("remembers played keys until reset", () => {
    resetPlayedKeys();
    expect(hasPlayed("hero")).toBe(false);

    markPlayed("hero");
    expect(hasPlayed("hero")).toBe(true);

    resetPlayedKeys();
    expect(hasPlayed("hero")).toBe(false);
  });
});
