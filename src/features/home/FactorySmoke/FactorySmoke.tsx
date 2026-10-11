import styles from "./styles/FactorySmoke.module.css";

const chimneyCaps = [
  { x: 622.5, y: 23, radius: 16 },
  { x: 557.5, y: 60, radius: 16 },
  { x: 1145.5, y: 249.5, radius: 13 },
  { x: 1206.5, y: 280.5, radius: 13 },
] as const;

const puffsPerChimney = 3;
const puffCycleSeconds = 4.2;
const chimneyOffsetSeconds = 0.6;

function puffDelaySeconds(chimneyIndex: number, puffIndex: number): number {
  return -((puffIndex / puffsPerChimney) * puffCycleSeconds + chimneyIndex * chimneyOffsetSeconds);
}

export function FactorySmoke() {
  return (
    <svg aria-hidden="true" viewBox="0 0 1790 1407" className={styles.smoke}>
      {chimneyCaps.flatMap((cap, chimneyIndex) =>
        Array.from({ length: puffsPerChimney }, (_, puffIndex) => (
          <circle
            key={`${chimneyIndex}-${puffIndex}`}
            cx={cap.x}
            cy={cap.y}
            r={cap.radius}
            className={styles.puff}
            style={{
              animationDuration: `${puffCycleSeconds}s`,
              animationDelay: `${puffDelaySeconds(chimneyIndex, puffIndex)}s`,
            }}
          />
        )),
      )}
    </svg>
  );
}
