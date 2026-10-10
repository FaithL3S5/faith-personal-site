export type GridCell = { column: number; row: number };

export function nearestCell(
  offsetX: number,
  offsetY: number,
  cellSize: number,
  columns: number,
  rows: number,
): GridCell {
  const clamp = (value: number, max: number) => Math.min(max - 1, Math.max(0, value));
  return {
    column: clamp(Math.floor(offsetX / cellSize), columns),
    row: clamp(Math.floor(offsetY / cellSize), rows),
  };
}

export function gridStepsBetween(from: GridCell, to: GridCell): number {
  return Math.round(Math.hypot(from.column - to.column, from.row - to.row));
}
