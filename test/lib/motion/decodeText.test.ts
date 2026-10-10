import { describe, expect, it } from "vitest";
import { decodeFrame, pickScrambleCharacter, scrambleCharacters } from "@/lib/motion/decodeText";

describe("decodeText", () => {
  const scrambled = [..."XXXXXXXXXXXXXXXXXXXXXX"];

  it("locks spaces and punctuation from the first frame", () => {
    expect(decodeFrame("6.2088° S, 106.8456° E", 0, scrambled)).toBe("X.XXXX° X, XXX.XXXX° X");
  });

  it("locks characters left to right as the count grows", () => {
    expect(decodeFrame("Java, TypeScript", 3, scrambled)).toBe("JavX, XXXXXXXXXX");
  });

  it("ends on the real text", () => {
    const target = "3 years in production";
    expect(decodeFrame(target, target.length, scrambled)).toBe(target);
  });

  it("picks from the scramble set", () => {
    expect(pickScrambleCharacter(() => 0)).toBe("A");
    expect(pickScrambleCharacter(() => 0.9999)).toBe("+");
    expect(scrambleCharacters).toContain("°");
  });
});
