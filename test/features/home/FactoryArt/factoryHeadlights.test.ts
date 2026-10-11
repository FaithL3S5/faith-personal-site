import { describe, expect, it } from "vitest";
import { beamPoints, type ParkedTruck } from "@/features/home/FactoryArt/factoryHeadlights";

describe("beamPoints", () => {
  it("throws the beam forward from both headlights and widens it at the far end", () => {
    const truck: ParkedTruck = {
      truckId: "test-truck",
      lights: [
        [0, 0],
        [10, 0],
      ],
      facing: [0, 1],
    };

    expect(beamPoints(truck)).toBe("0,0 10,0 26,110 -16,110");
  });
});
