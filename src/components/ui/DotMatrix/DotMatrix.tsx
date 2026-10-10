import styles from "./styles/DotMatrix.module.css";

const cellSize = 14;
const circleDiameter = 42;

type DotMatrixProps = {
  columns: number;
  rows: number;
  circleLeft: number;
  tone: "ink" | "paper";
  className?: string;
};

export function DotMatrix({ columns, rows, circleLeft, tone, className }: DotMatrixProps) {
  const width = columns * cellSize;
  const height = rows * cellSize;
  const dots = Array.from({ length: columns * rows }, (_, index) => ({
    column: index % columns,
    row: Math.floor(index / columns),
  }));

  return (
    <svg
      aria-hidden="true"
      viewBox={`0 0 ${width} ${height}`}
      className={[styles.matrix, styles[tone], className].filter(Boolean).join(" ")}
      style={{ width: `${width / 16}rem`, height: `${height / 16}rem` }}
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
