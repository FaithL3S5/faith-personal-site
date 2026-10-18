import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { JellyFigure } from "@/components/jelly/JellyFigure/JellyFigure";
import { ClosedEyes, RoundEyes, SquintEyes } from "@/components/jelly/JellyFigure/JellyEyes";
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

  it("draws closed eyes as two flat lines centred on the neutral eyes", () => {
    const { container } = render(
      <JellyFigure facing="right">
        <ClosedEyes />
      </JellyFigure>,
    );

    const lines = [...container.querySelectorAll("[data-jelly-eyes] line")];
    expect(lines).toHaveLength(2);
    lines.forEach((line) => expect(line.getAttribute("y1")).toBe(line.getAttribute("y2")));
    const centres = lines.map((line) => (Number(line.getAttribute("x1")) + Number(line.getAttribute("x2"))) / 2);
    expect(centres[0]).toBeCloseTo(eyeCenters.rightNeutral[0].x, 0);
    expect(centres[1]).toBeCloseTo(eyeCenters.rightNeutral[1].x, 0);
  });
});
