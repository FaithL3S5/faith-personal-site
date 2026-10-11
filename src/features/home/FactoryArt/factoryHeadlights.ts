type Point = readonly [number, number];

export type ParkedTruck = {
  truckId: string;
  lights: readonly [Point, Point];
  facing: Point;
};

export type HeadlightClassNames = {
  headlights: string;
  beam: string;
  glow: string;
  core: string;
};

const svgNamespace = "http://www.w3.org/2000/svg";
const beamLength = 110;
const beamSpread = 16;
const glowRadius = 10;
const coreRadius = 3.5;

export const parkedTrucks: readonly ParkedTruck[] = [
  {
    truckId: "red-truck-1",
    lights: [
      [854.31, 803.99],
      [888.71, 823.97],
    ],
    facing: [-0.866, 0.5],
  },
  {
    truckId: "red-truck-2",
    lights: [
      [834.94, 714.68],
      [869.35, 694.69],
    ],
    facing: [0.866, 0.5],
  },
];

function shift([x, y]: Point, [dx, dy]: Point, distance: number): Point {
  return [x + dx * distance, y + dy * distance];
}

export function beamPoints({ lights: [firstLight, secondLight], facing }: ParkedTruck): string {
  const gap = Math.hypot(secondLight[0] - firstLight[0], secondLight[1] - firstLight[1]);
  const across: Point = [(secondLight[0] - firstLight[0]) / gap, (secondLight[1] - firstLight[1]) / gap];
  const firstFar = shift(shift(firstLight, facing, beamLength), across, -beamSpread);
  const secondFar = shift(shift(secondLight, facing, beamLength), across, beamSpread);
  return [firstLight, secondLight, secondFar, firstFar].map((point) => point.join(",")).join(" ");
}

function svgElement(document: Document, tagName: string, attributes: Record<string, string>): Element {
  const element = document.createElementNS(svgNamespace, tagName);
  for (const [name, value] of Object.entries(attributes)) element.setAttribute(name, value);
  return element;
}

export function createHeadlights(document: Document, truck: ParkedTruck, classNames: HeadlightClassNames): Element {
  const group = svgElement(document, "g", { class: classNames.headlights, "data-truck": truck.truckId });
  group.append(svgElement(document, "polygon", { points: beamPoints(truck), class: classNames.beam }));
  for (const [x, y] of truck.lights) {
    const center = { cx: String(x), cy: String(y) };
    group.append(svgElement(document, "circle", { ...center, r: String(glowRadius), class: classNames.glow }));
    group.append(svgElement(document, "circle", { ...center, r: String(coreRadius), class: classNames.core }));
  }
  return group;
}
