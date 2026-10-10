import { eyeRadius, squintStrokes, type EyeCenter } from "./jellyShapes";
import styles from "./styles/JellyFigure.module.css";

function RoundEye({ x, y }: EyeCenter) {
  return (
    <g>
      <circle cx={x} cy={y} r={eyeRadius} fill="none" stroke="#fff" strokeWidth={90} />
      <circle cx={x} cy={y} r={eyeRadius} fill="#141414" />
      <circle cx={x} cy={y} r={eyeRadius} fill="none" stroke="#141414" strokeWidth={50} />
    </g>
  );
}

export function RoundEyes({ centers }: { centers: readonly EyeCenter[] }) {
  return (
    <g className={styles.eyes} data-jelly-eyes="">
      {centers.map((center) => (
        <RoundEye key={`${center.x}-${center.y}`} {...center} />
      ))}
    </g>
  );
}

export function SquintEyes() {
  return (
    <g className={styles.eyes} data-jelly-eyes="">
      {squintStrokes.map((points) => (
        <polyline key={points} points={points} fill="none" stroke="#141414" strokeWidth={50} />
      ))}
    </g>
  );
}
