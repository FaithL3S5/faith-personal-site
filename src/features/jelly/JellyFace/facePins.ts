import { closedEyeLines, squintStrokes } from "@/components/jelly/JellyFigure/jellyShapes";
import { meanValueWeights, pinnedPoint } from "@/lib/softbody/meanValue";
import type { BodyFrame } from "@/lib/softbody/softBody";
import { rotate, type Vec } from "@/lib/softbody/vector";
import { softJellyBrows, softJellyEyes, softJellyRing } from "../softJellyShape";
import styles from "./styles/JellyFace.module.css";

export type FacePin = { element: Element; weights: readonly number[]; rest: Vec };

function strokeCentre(points: string): Vec {
  const values = points.split(" ").map(Number);
  const xs = values.filter((_, index) => index % 2 === 0);
  const ys = values.filter((_, index) => index % 2 === 1);
  return { x: (Math.min(...xs) + Math.max(...xs)) / 2, y: (Math.min(...ys) + Math.max(...ys)) / 2 };
}

function lineCentre({ x1, y1, x2, y2 }: { x1: number; y1: number; x2: number; y2: number }): Vec {
  return { x: (x1 + x2) / 2, y: (y1 + y2) / 2 };
}

function pinsFor(elements: ArrayLike<Element> | undefined, centres: readonly Vec[]): FacePin[] {
  return Array.from(elements ?? [], (element, index) => ({
    element,
    rest: centres[index],
    weights: meanValueWeights(softJellyRing, centres[index]),
  }));
}

export function collectFacePins(face: Element): FacePin[] {
  const eyesIn = (className: string | undefined) => face.querySelector(`.${className} [data-jelly-eyes]`)?.children;
  const flatBrow = face.querySelector(`.${styles.open} line.${styles.brow}`);
  return [
    ...pinsFor(eyesIn(styles.open), softJellyEyes),
    ...pinsFor(eyesIn(styles.squint), squintStrokes.map(strokeCentre)),
    ...pinsFor(eyesIn(styles.closed), closedEyeLines.map(lineCentre)),
    ...pinsFor(flatBrow ? [flatBrow] : [], [lineCentre(softJellyBrows.flat)]),
  ];
}

export function pinShift(pin: FacePin, positions: readonly Vec[], frame: BodyFrame, scale: number, restCentroid: Vec): Vec {
  const pinned = pinnedPoint(pin.weights, positions);
  const placed = rotate({ x: (pin.rest.x - restCentroid.x) * scale, y: (pin.rest.y - restCentroid.y) * scale }, frame.rotation);
  const drift = { x: pinned.x - frame.centroid.x - placed.x, y: pinned.y - frame.centroid.y - placed.y };
  const local = rotate(drift, -frame.rotation);
  return { x: local.x / scale, y: local.y / scale };
}
