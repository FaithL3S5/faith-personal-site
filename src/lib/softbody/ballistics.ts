export type Physics = { gravity: number; damping: number; stepSeconds: number };

export type Flight = { peakHeight: number; seconds: number };

const maxFlightSteps = 10000;

export function flightOf(upwardSpeed: number, { gravity, damping, stepSeconds }: Physics): Flight {
  const gravityPerStep = gravity * stepSeconds * stepSeconds;
  let velocity = -upwardSpeed * stepSeconds;
  let height = 0;
  let peak = 0;
  let steps = 0;
  do {
    velocity = velocity * damping + gravityPerStep;
    height += velocity;
    peak = Math.min(peak, height);
    steps++;
  } while (height < 0 && steps < maxFlightSteps);
  return { peakHeight: -peak, seconds: steps * stepSeconds };
}

export function launchSpeedFor(peakHeight: number, physics: Physics): number {
  let low = 0;
  let high = 20000;
  for (let iteration = 0; iteration < 40; iteration++) {
    const middle = (low + high) / 2;
    if (flightOf(middle, physics).peakHeight < peakHeight) low = middle;
    else high = middle;
  }
  return (low + high) / 2;
}

function dampedSteps(steps: number, damping: number): number {
  return damping === 1 ? steps : (damping * (1 - damping ** steps)) / (1 - damping);
}

export function spinSpeedFor(turn: number, seconds: number, { damping, stepSeconds }: Physics): number {
  return turn / (dampedSteps(Math.round(seconds / stepSeconds), damping) * stepSeconds);
}

export function spunShare(elapsed: number, seconds: number, { damping, stepSeconds }: Physics): number {
  const totalSteps = Math.round(seconds / stepSeconds);
  const stepsSoFar = Math.min(Math.round(elapsed / stepSeconds), totalSteps);
  return dampedSteps(stepsSoFar, damping) / dampedSteps(totalSteps, damping);
}
