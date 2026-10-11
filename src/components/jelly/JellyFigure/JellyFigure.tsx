import type { ReactNode, Ref } from "react";
import { jellyOutlines, viewBoxes, type JellyFacing } from "./jellyShapes";
import styles from "./styles/JellyFigure.module.css";

type JellyFigureProps = {
  facing: JellyFacing;
  isOutlined?: boolean;
  label?: string;
  className?: string;
  ref?: Ref<SVGSVGElement>;
  children: ReactNode;
};

export function JellyFigure({ facing, isOutlined, label, className, ref, children }: JellyFigureProps) {
  const outline = jellyOutlines[facing];
  const accessibility = label ? { role: "img", "aria-label": label } : { "aria-hidden": true };

  return (
    <svg
      ref={ref}
      viewBox={isOutlined ? viewBoxes.outlined : viewBoxes.plain}
      className={className ? `${styles.figure} ${className}` : styles.figure}
      {...accessibility}
    >
      {isOutlined && (
        <g fill="#fff" stroke="#fff" strokeWidth={170} strokeLinejoin="round">
          <path d={outline.leftEar} />
          <path d={outline.rightEar} />
          <path d={outline.body} />
        </g>
      )}
      <g fill="#141414" stroke="#141414" strokeWidth={50} strokeLinejoin="round">
        <path d={outline.leftEar} />
        <path d={outline.rightEar} />
      </g>
      <path d={outline.body} fill="#fff" stroke="#141414" strokeWidth={50} />
      {children}
    </svg>
  );
}
