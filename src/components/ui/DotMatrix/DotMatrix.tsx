"use client";

import { animate } from "animejs";
import { useCallback, useRef, type PointerEvent } from "react";
import { useLoopWhileVisible } from "@/hooks/useLoopWhileVisible";
import { gridStepsBetween, nearestCell } from "@/lib/motion/dotRipple";
import { prefersReducedMotion } from "@/lib/motion/reducedMotion";
import styles from "./styles/DotMatrix.module.css";

const cellSize = 14;
const circleDiameter = 42;
const rippleDurationMs = 300;
const rippleStepDelayMs = 30;
const waveIntervalMs = 2400;

type DotMatrixProps = {
  columns: number;
  rows: number;
  circleLeft: number;
  tone: "ink" | "paper";
  className?: string;
};

function readDots(svg: SVGSVGElement) {
  return [...svg.querySelectorAll<SVGCircleElement>("[data-column]")].map((element) => ({
    element,
    cell: { column: Number(element.dataset.column), row: Number(element.dataset.row) },
  }));
}

function playRipple(dotElements: SVGCircleElement[], stepsPerDot: number[]): number {
  animate(dotElements, {
    scale: [{ to: 1.8 }, { to: 1 }],
    duration: rippleDurationMs,
    delay: (_dot: unknown, index?: number) => stepsPerDot[index ?? 0] * rippleStepDelayMs,
  });
  return Math.max(...stepsPerDot) * rippleStepDelayMs + rippleDurationMs;
}

export function DotMatrix({ columns, rows, circleLeft, tone, className }: DotMatrixProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const isPointerRipplingRef = useRef(false);
  const width = columns * cellSize;
  const height = rows * cellSize;
  const dots = Array.from({ length: columns * rows }, (_, index) => ({
    column: index % columns,
    row: Math.floor(index / columns),
  }));

  const playWave = useCallback(() => {
    const svg = svgRef.current;
    if (!svg || isPointerRipplingRef.current) return;
    const dotsInSvg = readDots(svg);
    playRipple(
      dotsInSvg.map((dot) => dot.element),
      dotsInSvg.map((dot) => dot.cell.column),
    );
  }, []);
  useLoopWhileVisible(svgRef, playWave, waveIntervalMs);

  const startPointerRipple = (event: PointerEvent<SVGSVGElement>) => {
    const svg = svgRef.current;
    if (!svg || isPointerRipplingRef.current || prefersReducedMotion()) return;

    const bounds = svg.getBoundingClientRect();
    const origin = nearestCell(
      ((event.clientX - bounds.left) / bounds.width) * width,
      ((event.clientY - bounds.top) / bounds.height) * height,
      cellSize,
      columns,
      rows,
    );
    const dotsInSvg = readDots(svg);
    const rippleDurationTotal = playRipple(
      dotsInSvg.map((dot) => dot.element),
      dotsInSvg.map((dot) => gridStepsBetween(origin, dot.cell)),
    );

    isPointerRipplingRef.current = true;
    setTimeout(() => {
      isPointerRipplingRef.current = false;
    }, rippleDurationTotal);
  };

  return (
    <svg
      ref={svgRef}
      aria-hidden="true"
      viewBox={`0 0 ${width} ${height}`}
      className={[styles.matrix, styles[tone], className].filter(Boolean).join(" ")}
      style={{ width: `${width / 16}rem`, height: `${height / 16}rem` }}
      onPointerEnter={(event) => event.pointerType === "mouse" && startPointerRipple(event)}
      onPointerDown={(event) => event.pointerType !== "mouse" && startPointerRipple(event)}
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
