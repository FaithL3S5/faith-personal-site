import { clampEyeOffset, type EyeBounds, type EyeOffset } from "@/lib/motion/jellyMotion";
import type { BodyFrame } from "@/lib/softbody/softBody";
import { rotate, type Vec } from "@/lib/softbody/vector";

export type HeldLook = { followShare: number; reach: EyeBounds };

export function toDegrees(radians: number): number {
  return (radians * 180) / Math.PI;
}

export function placedTransform(position: Vec, rotation: number, scale: number, anchor: Vec): string {
  return `translate(${position.x} ${position.y}) rotate(${toDegrees(rotation)}) scale(${scale}) translate(${-anchor.x} ${-anchor.y})`;
}

export function heldLookOffset(
  pointer: Vec,
  frame: BodyFrame,
  scale: number,
  restCentroid: Vec,
  eyesCenter: Vec,
  look: HeldLook,
): EyeOffset {
  const local = rotate({ x: pointer.x - frame.centroid.x, y: pointer.y - frame.centroid.y }, -frame.rotation);
  return clampEyeOffset(
    (restCentroid.x + local.x / scale - eyesCenter.x) * look.followShare,
    (restCentroid.y + local.y / scale - eyesCenter.y) * look.followShare,
    look.reach,
  );
}
