import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { JellyFigure } from "@/components/jelly/JellyFigure/JellyFigure";
import { RoundEyes, SquintEyes } from "@/components/jelly/JellyFigure/JellyEyes";
import { eyeCenters } from "@/components/jelly/JellyFigure/jellyShapes";

describe("JellyFigure", () => {
  it("exposes a labelled figure as an image", () => {
    render(
      <JellyFigure facing="right" label="Jelly waiting">
        <RoundEyes centers={eyeCenters.rightNeutral} />
      </JellyFigure>,
    );

    const figure = screen.getByRole("img", { name: "Jelly waiting" });
    expect(figure.querySelectorAll("[data-jelly-eyes] circle")).toHaveLength(6);
  });

  it("hides an unlabelled figure and draws the white ring when outlined", () => {
    const { container } = render(
      <JellyFigure facing="left" isOutlined className="extra">
        <SquintEyes />
      </JellyFigure>,
    );

    const svg = container.querySelector("svg");
    expect(svg?.getAttribute("aria-hidden")).toBe("true");
    expect(svg?.getAttribute("viewBox")).toBe("-20 250 1960 1700");
    expect(svg?.querySelectorAll("polyline")).toHaveLength(2);
  });
});
