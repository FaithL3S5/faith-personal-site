import type { EarChainParams } from "@/lib/softbody/earChain";
import type { SelfRightingParams } from "@/lib/softbody/selfRighting";
import type { ShapeSteeringParams } from "@/lib/softbody/shapeSteering";
import type { SoftBodyParams } from "@/lib/softbody/softBody";
import type { ExpressionParams } from "../jellyExpression";

const outlineWidth = 1700;
const jellyWidthPx = 220;
const outlineStrokeWidth = 50;
const scale = jellyWidthPx / outlineWidth;
const shapeStiffness = 0.03;

export const jellyPlaygroundTuning = {
  scale,
  strokeWidth: outlineStrokeWidth * scale,
  stepsPerSecond: 120,
  maxStepsPerFrame: 8,
  earSegments: 5,
  earBaseExtension: 30,
  earBaseCutoff: 2,
  earSplay: { left: (10 * Math.PI) / 180, right: (32 * Math.PI) / 180 },
  body: {
    gravity: 2400,
    damping: 0.995,
    iterations: 4,
    edgeStiffness: 0.6,
    braceStiffness: 0.04,
    pressureStiffness: 0.5,
    shapeStiffness,
    recoveryStiffness: 0.4,
    grabStiffness: 0.35,
    heldSwingDamping: 0.04,
    restitution: 0.25,
    friction: 0.15,
    edgeMargin: (outlineStrokeWidth * scale) / 2,
  } satisfies SoftBodyParams,
  ear: {
    pinnedPoints: 2,
    baseStiffness: 3000,
    tipStiffness: 1200,
    damping: 0.95,
    iterations: 3,
  } satisfies EarChainParams,
  steering: {
    roundSeconds: 0.2,
    reformSeconds: 0.5,
    reformAfterStillSeconds: 0.3,
    settleSpeed: 30,
    looseStiffness: shapeStiffness,
    heldStiffness: 0.12,
    heldEaseSeconds: 0.3,
    dropAspect: 1.6,
    swingShare: 0.5,
    swingSmoothing: 0.15,
    maxLean: Math.PI / 3,
    squashPerSpeed: 0.00015,
    maxSquash: 0.25,
    squashSeconds: 0.25,
    squashStiffness: 0.08,
    restFlatten: 0.05,
    floorMemorySeconds: 0.1,
  } satisfies ShapeSteeringParams,
  righting: {
    tiltThreshold: Math.PI / 2,
    groundTolerance: 1,
    stillSpeed: 8,
    stillSeconds: 0.6,
    pauseSeconds: { min: 0.2, max: 0.5 },
    squeezeSeconds: 0.35,
    squeeze: { top: 0.6, bottom: 0.9, width: 1.15 },
    squeezeStiffness: 0.4,
    jumpHeight: { min: 300, max: 420 },
    extraHeightForHalfTurn: 60,
    takeoffStretch: 0.25,
    headingRecordSpeed: 400,
    landingAirSeconds: 0.15,
    headingShare: 0.5,
    maxSideSpeed: 500,
    rollWithTravelWithin: Math.PI / 6,
    minTravelSpeed: 60,
    alignShare: 1,
    alignStiffness: 0.03,
    landingSeconds: 1,
    landingStiffness: 0.1,
    landingSettleAngle: 0.05,
    maxCorrectionSpeed: Math.PI,
    landingBrake: 0.7,
  } satisfies SelfRightingParams,
  expression: {
    hardHitSpeed: 600,
    squintSeconds: 0.35,
    airborneAfterSeconds: 0.08,
  } satisfies ExpressionParams,
  heldLook: {
    followShare: 0.35,
    reach: { left: 60, right: 60, up: 60, down: 60 },
  },
  browKnockoutGap: 25,
};
