"use client";

import { useCallback, useEffect, useRef, type PointerEvent } from "react";
import { useFixedStepLoop } from "@/hooks/useFixedStepLoop";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import {
  bindOutline,
  createEarChain,
  interpolatedChain,
  skinOutline,
  stepEarChain,
  type EarBase,
  type EarChain,
} from "@/lib/softbody/earChain";
import { createSelfRighting, stepSelfRighting, type SelfRighting } from "@/lib/softbody/selfRighting";
import { createShapeSteering, heldShare, stepShapeSteering, type ShapeSteering } from "@/lib/softbody/shapeSteering";
import { smoothClosedPath } from "@/lib/softbody/smoothPath";
import {
  createSoftBody,
  grabNearestPoint,
  interpolatedFrame,
  interpolatedPositions,
  moveGrab,
  releaseGrab,
  stepSoftBody,
  surfaceRotation,
  type Bounds,
  type SoftBody,
} from "@/lib/softbody/softBody";
import { centroidOf, rotate, type Vec } from "@/lib/softbody/vector";
import { collectFacePins, pinShift, type FacePin } from "../JellyFace/facePins";
import { heldLookOffset, placedTransform } from "../JellyFace/faceTransforms";
import { BrowKnockout, browKnockoutId, JellyFace } from "../JellyFace/JellyFace";
import { createExpression, stepExpression, type ExpressionState } from "../jellyExpression";
import { softJellyBrows, softJellyEars, softJellyEyes, softJellyRing } from "../softJellyShape";
import { jellyPlaygroundTuning } from "./jellyPlaygroundTuning";
import styles from "./styles/JellyPlayground.module.css";
import { useBlinkTimer } from "./useBlinkTimer";
import { useLockedPageScroll } from "./useLockedPageScroll";

type Simulation = {
  body: SoftBody;
  ears: EarChain[];
  righting: SelfRighting;
  steering: ShapeSteering;
  expression: ExpressionState;
  bounds: Bounds;
};

type JellyElements = {
  bodyFill: SVGPathElement | null;
  bodyOutline: SVGPathElement | null;
  ears: readonly (SVGPathElement | null)[];
  face: SVGGElement | null;
  eyes: SVGGElement | null;
  look: SVGGElement | null;
  raisedBrow: SVGGElement | null;
  maskBrow: SVGGElement | null;
  facePins: readonly FacePin[];
};

const { scale, strokeWidth, earSegments, earBaseExtension, earBaseCutoff, earSplay, stepsPerSecond, maxStepsPerFrame } =
  jellyPlaygroundTuning;
const { body: bodyParams, ear: earParams, righting: rightingParams, steering: steeringParams } = jellyPlaygroundTuning;
const { expression: expressionParams, heldLook, browKnockoutGap } = jellyPlaygroundTuning;
const restCentroid = centroidOf(softJellyRing);
const eyesCenter = centroidOf(softJellyEyes);
const browAnchor = softJellyRing[softJellyBrows.raisedAnchorIndex];
const lowestRestOffset = Math.max(...softJellyRing.map((point) => (point.y - restCentroid.y) * scale));
const earBindings = softJellyEars.map(({ outline, root, tip }) =>
  bindOutline(outline, root, tip, scale, earBaseExtension, earBaseCutoff),
);
const earRootOffsets = softJellyEars.map(({ root, anchorIndex }) => ({
  x: (root.x - softJellyRing[anchorIndex].x) * scale,
  y: (root.y - softJellyRing[anchorIndex].y) * scale,
}));

function windowBounds(): Bounds {
  return { width: window.innerWidth, height: window.innerHeight };
}

function startingCentroid(bounds: Bounds, isResting: boolean): Vec {
  const restingY = bounds.height - lowestRestOffset - bodyParams.edgeMargin;
  return { x: bounds.width / 2, y: isResting ? restingY : bounds.height * 0.35 };
}

function earBase(body: SoftBody, positions: readonly Vec[], earIndex: number, splayShare = 0): EarBase {
  const { anchorIndex, side } = softJellyEars[earIndex];
  const rotation = surfaceRotation(body, positions, anchorIndex);
  const offset = rotate(earRootOffsets[earIndex], rotation);
  const splay = side === "left" ? -earSplay.left : earSplay.right;
  return {
    position: { x: positions[anchorIndex].x + offset.x, y: positions[anchorIndex].y + offset.y },
    rotation: rotation + splay * splayShare,
  };
}

function createSimulation(bounds: Bounds, isResting: boolean): Simulation {
  const body = createSoftBody(softJellyRing, scale, startingCentroid(bounds, isResting));
  const ears = softJellyEars.map(({ root, tip }, index) =>
    createEarChain(root, tip, scale, earSegments, earBase(body, body.positions, index)),
  );
  return {
    body,
    ears,
    righting: createSelfRighting(rightingParams),
    steering: createShapeSteering(),
    expression: createExpression(),
    bounds,
  };
}

function drawFace(simulation: Simulation, elements: JellyElements, positions: readonly Vec[], alpha: number) {
  const { body } = simulation;
  const frame = interpolatedFrame(body, alpha);
  const pointer = simulation.expression.current === "held" ? body.grab?.target : undefined;
  const look = pointer ? heldLookOffset(pointer, frame, scale, restCentroid, eyesCenter, heldLook) : null;
  const browIndex = softJellyBrows.raisedAnchorIndex;
  const browTransform = placedTransform(
    positions[browIndex],
    surfaceRotation(body, positions, browIndex),
    scale,
    browAnchor,
  );

  elements.face?.setAttribute("data-expression", simulation.expression.current);
  elements.eyes?.setAttribute("transform", placedTransform(frame.centroid, frame.rotation, scale, restCentroid));
  elements.look?.setAttribute("transform", look ? `translate(${look.x} ${look.y})` : "");
  elements.facePins.forEach((pin) => {
    const shift = pinShift(pin, positions, frame, scale, restCentroid);
    pin.element.setAttribute("transform", `translate(${shift.x} ${shift.y})`);
  });
  elements.raisedBrow?.setAttribute("transform", browTransform);
  elements.maskBrow?.setAttribute("transform", browTransform);
  if (pointer) elements.bodyOutline?.setAttribute("mask", `url(#${browKnockoutId})`);
  else elements.bodyOutline?.removeAttribute("mask");
}

function drawSimulation(simulation: Simulation | null, elements: JellyElements, alpha: number) {
  if (!simulation) return;
  const positions = interpolatedPositions(simulation.body, alpha);
  const bodyPath = smoothClosedPath(positions);

  elements.bodyFill?.setAttribute("d", bodyPath);
  elements.bodyOutline?.setAttribute("d", bodyPath);
  drawFace(simulation, elements, positions, alpha);
  simulation.ears.forEach((chain, index) => {
    const outline = skinOutline(interpolatedChain(chain, alpha), earBindings[index], chain.segmentLength);
    elements.ears[index]?.setAttribute("d", smoothClosedPath(outline));
  });
}

function stepSimulation(simulation: Simulation, seconds: number) {
  const { body, bounds, righting } = simulation;
  const world = { floorY: bounds.height - bodyParams.edgeMargin, gravity: bodyParams.gravity, damping: bodyParams.damping };
  const rightingGoal = stepSelfRighting(righting, body, seconds, world, rightingParams);
  const steeringGoal = stepShapeSteering(simulation.steering, body, seconds, world, steeringParams);
  stepSoftBody(body, seconds, bounds, bodyParams, rightingGoal ?? steeringGoal);
  stepExpression(
    simulation.expression,
    {
      isHeld: body.grab !== null,
      isSqueezing: righting.phase === "squeezing",
      isJumping: righting.phase === "airborne",
      impacts: body.impacts,
    },
    seconds,
    expressionParams,
  );
  const splayShare = heldShare(simulation.steering);
  simulation.ears.forEach((chain, index) =>
    stepEarChain(chain, earBase(body, body.positions, index, splayShare), seconds, earParams),
  );
}

export function JellyPlayground() {
  const isReducedMotion = usePrefersReducedMotion();
  const isRunning = isReducedMotion === false;
  const stageRef = useRef<SVGSVGElement>(null);
  const bodyFillRef = useRef<SVGPathElement>(null);
  const bodyOutlineRef = useRef<SVGPathElement>(null);
  const earRefs = useRef<(SVGPathElement | null)[]>([]);
  const faceRef = useRef<SVGGElement>(null);
  const eyesRef = useRef<SVGGElement>(null);
  const lookRef = useRef<SVGGElement>(null);
  const raisedBrowRef = useRef<SVGGElement>(null);
  const maskBrowRef = useRef<SVGGElement>(null);
  const simulationRef = useRef<Simulation | null>(null);
  const facePinsRef = useRef<FacePin[] | null>(null);

  const currentElements = useCallback((): JellyElements => {
    if (!facePinsRef.current && faceRef.current) facePinsRef.current = collectFacePins(faceRef.current);
    return {
      bodyFill: bodyFillRef.current,
      bodyOutline: bodyOutlineRef.current,
      ears: earRefs.current,
      face: faceRef.current,
      eyes: eyesRef.current,
      look: lookRef.current,
      raisedBrow: raisedBrowRef.current,
      maskBrow: maskBrowRef.current,
      facePins: facePinsRef.current ?? [],
    };
  }, []);

  useLockedPageScroll();
  useBlinkTimer(stageRef);

  useEffect(() => {
    if (isReducedMotion === null) return;
    const elements = currentElements();
    simulationRef.current = createSimulation(windowBounds(), isReducedMotion);
    drawSimulation(simulationRef.current, elements, 1);

    const onResize = () => {
      const simulation = simulationRef.current;
      if (!simulation) return;
      simulation.bounds = windowBounds();
      if (!isReducedMotion) return;
      simulationRef.current = createSimulation(simulation.bounds, true);
      drawSimulation(simulationRef.current, elements, 1);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [isReducedMotion, currentElements]);

  useFixedStepLoop({
    stepsPerSecond,
    maxStepsPerFrame,
    isRunning,
    step: (seconds) => {
      if (simulationRef.current) stepSimulation(simulationRef.current, seconds);
    },
    render: (alpha) => drawSimulation(simulationRef.current, currentElements(), alpha),
  });

  const pointerPosition = (event: PointerEvent<SVGSVGElement>): Vec => ({ x: event.clientX, y: event.clientY });

  const onPointerDown = (event: PointerEvent<SVGSVGElement>) => {
    const simulation = simulationRef.current;
    if (!isRunning || !simulation || !grabNearestPoint(simulation.body, pointerPosition(event))) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    event.currentTarget.setAttribute("data-grabbing", "");
  };

  const onPointerMove = (event: PointerEvent<SVGSVGElement>) => {
    const simulation = simulationRef.current;
    if (simulation) moveGrab(simulation.body, pointerPosition(event));
  };

  const onPointerUp = (event: PointerEvent<SVGSVGElement>) => {
    const simulation = simulationRef.current;
    if (simulation) releaseGrab(simulation.body);
    event.currentTarget.removeAttribute("data-grabbing");
  };

  return (
    <main id="main" tabIndex={-1}>
      <h1 className={styles.title}>Jelly playground</h1>
      <svg
        ref={stageRef}
        className={styles.stage}
        role="img"
        aria-label="J三LLY, a soft jelly you can drag and throw around the window"
        data-draggable={isRunning ? "" : undefined}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <g fill="#141414" stroke="#141414" strokeWidth={strokeWidth} strokeLinejoin="round">
          {softJellyEars.map((ear, index) => (
            <path
              key={ear.anchorIndex}
              ref={(element) => {
                earRefs.current[index] = element;
              }}
            />
          ))}
        </g>
        <path ref={bodyFillRef} fill="#fff" />
        <path ref={bodyOutlineRef} fill="none" stroke="#141414" strokeWidth={strokeWidth} />
        <JellyFace faceRef={faceRef} eyesRef={eyesRef} lookRef={lookRef} raisedBrowRef={raisedBrowRef} />
        <BrowKnockout maskBrowRef={maskBrowRef} gap={browKnockoutGap} />
      </svg>
    </main>
  );
}
