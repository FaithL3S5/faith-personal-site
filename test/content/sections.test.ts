import { describe, expect, it } from "vitest";
import { getSection, sections, type SectionId } from "@/content/sections";

describe("sections", () => {
  it("numbers the five sections in order", () => {
    expect(sections.map((section) => section.number)).toEqual(["01", "02", "03", "04", "05"]);
  });

  it("finds a section by id", () => {
    expect(getSection("stack")).toMatchObject({ label: "Stack", kanji: "技術", romaji: "gijutsu" });
  });

  it("throws for an unknown id", () => {
    expect(() => getSection("missing" as SectionId)).toThrow("Unknown section: missing");
  });
});
