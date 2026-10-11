import { createTimeline } from "animejs";

export function playCopyJump(figure: SVGSVGElement, onComplete: () => void) {
  const jumpHeight = figure.getBoundingClientRect().height * 1.2;

  return createTimeline({ onComplete })
    .add(figure, { scaleY: 0.86, scaleX: 1.1, duration: 90 })
    .add(figure, { translateY: -jumpHeight, scaleY: 1.08, scaleX: 0.94, duration: 260, ease: "outQuad" })
    .add(figure, { translateY: 0, scaleY: 1, scaleX: 1, duration: 220, ease: "inQuad" })
    .add(figure, { scaleY: 0.82, scaleX: 1.12, duration: 80 })
    .add(figure, { translateY: -12, scaleY: 1, scaleX: 1, duration: 70, ease: "outQuad" })
    .add(figure, { translateY: 0, duration: 70, ease: "inQuad" })
    .add(figure, { translateY: -4, duration: 70, ease: "outQuad" })
    .add(figure, { translateY: 0, duration: 70, ease: "inQuad" });
}
