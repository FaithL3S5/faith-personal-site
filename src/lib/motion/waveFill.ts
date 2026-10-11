const viewportShareToFill = 0.75;

export function nextWaveFill(currentFill: number, scrollDelta: number, viewportHeight: number): number {
  const fillChange = scrollDelta / (viewportHeight * viewportShareToFill);
  return Math.min(1, Math.max(0, currentFill + fillChange));
}

export function waveFrontInBand(bandTopInViewport: number, fill: number, viewportHeight: number): number {
  return -bandTopInViewport + fill * viewportHeight;
}
