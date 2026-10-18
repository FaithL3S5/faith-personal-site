import { describe, expect, it } from "vitest";
import { createExpression, stepExpression, type ExpressionCues } from "@/features/jelly/jellyExpression";

const params = { hardHitSpeed: 600, squintSeconds: 0.35, airborneAfterSeconds: 0.08 };
const step = 1 / 120;
const resting: ExpressionCues = {
  isHeld: false,
  isSqueezing: false,
  isJumping: false,
  impacts: { floor: 20, wall: 0, ceiling: 0 },
};
const flying: ExpressionCues = { ...resting, impacts: { floor: 0, wall: 0, ceiling: 0 } };

function run(cues: ExpressionCues, steps: number, state = createExpression()) {
  for (let index = 0; index < steps; index++) stepExpression(state, cues, step, params);
  return state;
}

describe("Jelly's expression", () => {
  it("keeps his eyes open on the ground", () => {
    expect(run(resting, 10).current).toBe("open");
  });

  it("closes his eyes once he has been in the air for a moment", () => {
    expect(run(flying, 5).current).toBe("open");
    expect(run(flying, 20).current).toBe("closed");
  });

  it("squints for a moment after a hard hit on a wall, the ceiling, or the floor", () => {
    for (const impacts of [
      { floor: 0, wall: 900, ceiling: 0 },
      { floor: 0, wall: 0, ceiling: 900 },
      { floor: 900, wall: 0, ceiling: 0 },
    ]) {
      const state = run({ ...flying, impacts }, 1);
      expect(state.current).toBe("squint");
      expect(run(flying, 60, state).current).toBe("closed");
    }
  });

  it("squints while squeezing for a jump", () => {
    expect(run({ ...resting, isSqueezing: true }, 1).current).toBe("squint");
  });

  it("closes his eyes the moment he jumps, even before leaving the floor", () => {
    expect(run({ ...resting, isJumping: true }, 1).current).toBe("closed");
  });

  it("raises his brow while held, whatever else is going on", () => {
    expect(run({ ...flying, isHeld: true, impacts: { floor: 0, wall: 900, ceiling: 0 } }, 30).current).toBe("held");
  });
});
