import { act, fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import * as anime from "animejs";
import { triggerIntersection } from "@test/support/intersectionObserver";
import { setMediaQueryMatches } from "@test/support/matchMedia";
import { FooterJelly } from "@/components/jelly/FooterJelly/FooterJelly";

vi.mock("animejs", { spy: true });

describe("FooterJelly", () => {
  it("follows a fine pointer with his eyes", async () => {
    setMediaQueryMatches("(pointer: fine)", true);
    render(<FooterJelly className="jelly" />);
    const figure = screen.getByRole("img", { name: "Jelly looking up" });
    vi.spyOn(figure, "getBoundingClientRect").mockReturnValue(new DOMRect(0, 0, 140, 120));
    act(() => triggerIntersection(figure, true));

    fireEvent.pointerMove(window, { clientX: 900, clientY: 60 });
    await act(() => new Promise((resolve) => requestAnimationFrame(resolve)));

    const eyeUpdate = vi.mocked(anime.utils.set).mock.calls.at(-1)?.[1] as { translateX: number };
    expect(eyeUpdate.translateX).toBeCloseTo(200);
  });

  it("only blinks on touch screens", () => {
    render(<FooterJelly className="jelly" />);
    act(() => triggerIntersection(screen.getByRole("img"), true));

    fireEvent.pointerMove(window, { clientX: 900, clientY: 60 });
    expect(anime.utils.set).not.toHaveBeenCalled();
  });
});
