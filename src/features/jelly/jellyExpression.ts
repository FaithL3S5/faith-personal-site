import type { SurfaceImpacts } from "@/lib/softbody/softBody";

export type JellyExpression = "open" | "closed" | "squint" | "held";

export type ExpressionParams = { hardHitSpeed: number; squintSeconds: number; airborneAfterSeconds: number };

export type ExpressionState = { current: JellyExpression; squintLeft: number; airFor: number };

export type ExpressionCues = { isHeld: boolean; isSqueezing: boolean; isJumping: boolean; impacts: SurfaceImpacts };

export function createExpression(): ExpressionState {
  return { current: "open", squintLeft: 0, airFor: 0 };
}

function pickExpression(state: ExpressionState, cues: ExpressionCues, params: ExpressionParams): JellyExpression {
  if (cues.isHeld) return "held";
  if (cues.isSqueezing || state.squintLeft > 0) return "squint";
  return cues.isJumping || state.airFor > params.airborneAfterSeconds ? "closed" : "open";
}

export function stepExpression(
  state: ExpressionState,
  cues: ExpressionCues,
  seconds: number,
  params: ExpressionParams,
): JellyExpression {
  const { floor, wall, ceiling } = cues.impacts;
  const isHardHit = Math.max(floor, wall, ceiling) > params.hardHitSpeed;
  state.squintLeft = isHardHit ? params.squintSeconds : Math.max(state.squintLeft - seconds, 0);
  state.airFor = floor > 0 ? 0 : state.airFor + seconds;
  state.current = pickExpression(state, cues, params);
  return state.current;
}
