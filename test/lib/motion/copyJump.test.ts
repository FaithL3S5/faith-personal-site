import { describe, expect, it, vi } from "vitest";
import * as anime from "animejs";
import { playCopyJump } from "@/lib/motion/copyJump";

vi.mock("animejs", { spy: true });

describe("playCopyJump", () => {
  it("jumps 1.2 times his own height in about 950ms", () => {
    const figure = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    vi.spyOn(figure, "getBoundingClientRect").mockReturnValue(new DOMRect(0, 0, 68, 50));

    const timeline = playCopyJump(figure, () => {});

    expect(anime.createTimeline).toHaveBeenCalledOnce();
    expect(timeline.duration).toBe(930);
  });
});
