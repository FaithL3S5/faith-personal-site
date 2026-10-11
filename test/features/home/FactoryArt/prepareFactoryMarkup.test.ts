import { describe, expect, it } from "vitest";
import { prepareFactoryMarkup } from "@/features/home/FactoryArt/prepareFactoryMarkup";

const classNames = { headlights: "headlights", beam: "beam", glow: "glow", core: "core" };

const markup = [
  '<svg xmlns="http://www.w3.org/2000/svg">',
  '<g id="red-truck-2"></g>',
  '<g id="red-truck-1"></g>',
  '<g id="grey-truck"></g>',
  '<g id="tall-grey-building-1"></g>',
  '<g id="grey-mini-truck"></g>',
  "</svg>",
].join("");

function layerOrder(svgMarkup: string) {
  const document = new DOMParser().parseFromString(svgMarkup, "image/svg+xml");
  return [...document.documentElement.children].map((layer) => layer.id || layer.getAttribute("data-truck"));
}

describe("prepareFactoryMarkup", () => {
  it("draws the grey truck over the tall building, on both sides of the mini truck, with each headlight right above its truck", () => {
    expect(layerOrder(prepareFactoryMarkup(markup, classNames))).toEqual([
      "red-truck-2",
      "red-truck-2",
      "red-truck-1",
      "red-truck-1",
      "tall-grey-building-1",
      "grey-truck",
      "grey-mini-truck",
      "grey-truck-over",
    ]);
  });

  it("gives every headlight a beam, two glows, and two bright cores", () => {
    const document = new DOMParser().parseFromString(prepareFactoryMarkup(markup, classNames), "image/svg+xml");
    const headlights = [...document.querySelectorAll(".headlights")];

    expect(headlights).toHaveLength(2);
    for (const headlight of headlights) {
      expect(headlight.querySelectorAll(".beam")).toHaveLength(1);
      expect(headlight.querySelectorAll(".glow")).toHaveLength(2);
      expect(headlight.querySelectorAll(".core")).toHaveLength(2);
    }
  });

  it("leaves the art alone when the named groups are missing", () => {
    const bare = '<svg xmlns="http://www.w3.org/2000/svg"><g id="land"></g></svg>';
    expect(layerOrder(prepareFactoryMarkup(bare, classNames))).toEqual(["land"]);
  });
});
