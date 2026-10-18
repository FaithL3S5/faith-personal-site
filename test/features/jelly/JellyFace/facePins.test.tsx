import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { collectFacePins, pinShift } from "@/features/jelly/JellyFace/facePins";
import { JellyFace } from "@/features/jelly/JellyFace/JellyFace";
import { softJellyRing } from "@/features/jelly/softJellyShape";
import { centroidOf } from "@/lib/softbody/vector";

const scale = 0.1;
const restCentroid = centroidOf(softJellyRing);
const centroid = { x: 300, y: 200 };
const atRest = softJellyRing.map((point) => ({
  x: centroid.x + (point.x - restCentroid.x) * scale,
  y: centroid.y + (point.y - restCentroid.y) * scale,
}));

function renderFace() {
  const { container } = render(
    <svg>
      <JellyFace faceRef={null} eyesRef={null} lookRef={null} raisedBrowRef={null} />
    </svg>,
  );
  return container.querySelector("[data-expression]") as Element;
}

describe("face pins", () => {
  it("finds both eyes for every expression, plus the flat brow", () => {
    const pins = collectFacePins(renderFace());
    expect(pins).toHaveLength(7);
    pins.forEach((pin) => expect(pin.weights).toHaveLength(softJellyRing.length));
  });

  it("leaves every feature where it is drawn while he holds his shape", () => {
    const pins = collectFacePins(renderFace());
    pins.forEach((pin) => {
      const shift = pinShift(pin, atRest, { centroid, rotation: 0 }, scale, restCentroid);
      expect(shift.x).toBeCloseTo(0);
      expect(shift.y).toBeCloseTo(0);
    });
  });

  it("moves the eyes toward his middle when he narrows", () => {
    const [firstEye, secondEye] = collectFacePins(renderFace());
    const narrow = atRest.map(({ x, y }) => ({ x: centroid.x + (x - centroid.x) * 0.6, y }));
    const frame = { centroid: centroidOf(narrow), rotation: 0 };
    [firstEye, secondEye].forEach((eye) => {
      const shift = pinShift(eye, narrow, frame, scale, restCentroid);
      expect(Math.sign(shift.x)).toBe(-Math.sign(eye.rest.x - restCentroid.x));
    });
  });
});
