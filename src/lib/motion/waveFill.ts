const viewportShareToFill = 0.75;

export function waveFillForScroll(scrollTop: number, maxScrollTop: number, viewportHeight: number): number {
  const fillDistance = Math.min(viewportHeight * viewportShareToFill, maxScrollTop);
  if (fillDistance <= 0) return 1;
  return Math.min(1, Math.max(0, scrollTop / fillDistance));
}

export function waveFrontInBand(bandTopInViewport: number, fill: number, viewportHeight: number): number {
  return -bandTopInViewport + fill * viewportHeight;
}
