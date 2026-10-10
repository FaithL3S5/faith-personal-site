import { Arrow } from "@/components/ui/Arrow/Arrow";
import { specCells, type SpecCell } from "@/content/home";
import { LiveClock } from "../LiveClock/LiveClock";
import styles from "./styles/SpecStrip.module.css";

function SpecValue({ cell }: { cell: SpecCell }) {
  if (cell.isLiveClock) return <LiveClock />;
  if (!cell.href) return cell.value;
  return (
    <a href={cell.href} target="_blank" rel="noopener" className={styles.link}>
      {cell.value}
      <Arrow direction="out" size="small" />
    </a>
  );
}

export function SpecStrip() {
  return (
    <dl className={styles.strip}>
      {specCells.map((cell) => (
        <div key={cell.label} className={styles.cell} data-spec={cell.label}>
          <dt className={styles.label}>
            <span aria-hidden="true">
              <span className={styles.mobileCode}>{cell.mobileCode}</span>
              <span className={styles.code}>{cell.code}</span> /{" "}
            </span>
            {cell.label}
          </dt>
          <dd className={styles.value}>
            <SpecValue cell={cell} />
          </dd>
        </div>
      ))}
    </dl>
  );
}
