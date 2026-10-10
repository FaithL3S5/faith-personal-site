export function scrollProgress(scrollTop: number, scrollHeight: number, viewportHeight: number): number {
  const scrollableDistance = scrollHeight - viewportHeight;
  if (scrollableDistance <= 0) return 0;
  return Math.min(1, Math.max(0, scrollTop / scrollableDistance));
}

export type SectionOffset = { number: string; top: number };

export function currentSectionNumber(sectionOffsets: readonly SectionOffset[], probeTop: number): string {
  let currentNumber = "00";
  for (const section of sectionOffsets) {
    if (section.top <= probeTop) currentNumber = section.number;
  }
  return currentNumber;
}

export function shouldFlipLabel(markerOffset: number, trackWidth: number, labelWidth: number): boolean {
  return markerOffset + labelWidth > trackWidth;
}
