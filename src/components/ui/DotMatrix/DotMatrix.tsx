"use client";

import { animate } from "animejs";
import { useRef, type PointerEvent } from "react";
import { gridStepsBetween, nearestCell } from "@/lib/motion/dotRipple";
import { prefersReducedMotion } from "@/lib/motion/reducedMotion";
import styles from "./styles/DotMatrix.module.css";

const cellSize = 14;
const circleDiameter = 42;
const rippleDurationMs = 300;
const rippleStepDelayMs = 30;

type DotMatrixProps = {
  columns: number;
  rows: number;
  circleLeft: number;
  tone: "ink" | "paper";
  className?: string;
};

export function DotMatrix({ columns, rows, circleLeft, tone, className }: DotMatrixProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const isRipplingRef = useRef(false);
  const width = columns * cellSize;
  const height = rows * cellSize;
  const dots = Array.from({ length: columns * rows }, (_, index) => ({
    column: index % columns,
    row: Math.floor(index / columns),
  }));

  const startRipple = (event: PointerEvent<SVGSVGElement>) => {
    const svg = svgRef.current;
    if (!svg || isRipplingRef.current || prefersReducedMotion()) return;

    const bounds = svg.getBoundingClientRect();
    const origin = nearestCell(
      ((event.clientX - bounds.left) / bounds.width) * width,
      ((event.clientY - bounds.top) / bounds.height) * height,
      cellSize,
      columns,
      rows,
    );
    const dotElements = [...svg.querySelectorAll<SVGCircleElement>("[data-column]")];
    const stepsFromOrigin = dotElements.map((dot) =>
      gridStepsBetween(origin, { column: Number(dot.dataset.column), row: Number(dot.dataset.row) }),
    );
    const farthestSteps = Math.max(...stepsFromOrigin);

    isRipplingRef.current = true;
    animate(dotElements, {
      scale: [{ to: 1.8 }, { to: 1 }],
      duration: rippleDurationMs,
      delay: (_dot: unknown, index?: number) => stepsFromOrigin[index ?? 0] * rippleStepDelayMs,
    });
    setTimeout(() => {
      isRipplingRef.current = false;
    }, farthestSteps * rippleStepDelayMs + rippleDurationMs);
  };

  return (
    <svg
      ref={svgRef}
      aria-hidden="true"
      viewBox={`0 0 ${width} ${height}`}
      className={[styles.matrix, styles[tone], className].filter(Boolean).join(" ")}
      style={{ width: `${width / 16}rem`, height: `${height / 16}rem` }}
      onPointerEnter={(event) => event.pointerType === "mouse" && startRipple(event)}
      onPointerDown={(event) => event.pointerType !== "mouse" && startRipple(event)}
    >
      <circle
        className={styles.circle}
        cx={circleLeft + circleDiameter / 2}
        cy={circleDiameter / 2}
        r={circleDiameter / 2}
      />
      {dots.map(({ column, row }) => (
        <circle
          key={`${column}-${row}`}
          className={styles.dot}
          data-column={column}
          data-row={row}
          cx={column * cellSize + cellSize / 2}
          cy={row * cellSize + cellSize / 2}
          r={1.8}
        />
      ))}
    </svg>
  );
}
