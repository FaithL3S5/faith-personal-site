import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { KanjiRuby } from "@/components/ui/KanjiRuby/KanjiRuby";

describe("KanjiRuby", () => {
  it("marks the kanji as hidden Japanese with romaji", () => {
    const { container } = render(<KanjiRuby kanji="技術" romaji="gijutsu" />);
    const wrapper = container.firstElementChild;
    expect(wrapper?.getAttribute("lang")).toBe("ja");
    expect(wrapper?.getAttribute("aria-hidden")).toBe("true");
    expect(container.querySelector("rt")?.textContent).toBe("gijutsu");
  });
});
