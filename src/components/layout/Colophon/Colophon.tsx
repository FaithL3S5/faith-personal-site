import { FactList, type Fact } from "@/components/ui/FactList/FactList";
import { computerAttribution, factoryAttribution, typefaceList } from "@/content/footer";
import { formatBuildStamp } from "@/lib/buildInfo";
import { PageWeight } from "../PageWeight/PageWeight";
import styles from "./styles/Colophon.module.css";

const buildStamp = formatBuildStamp(
  process.env.NEXT_PUBLIC_COMMIT_SHA,
  process.env.NEXT_PUBLIC_BUILT_AT,
);

const colophonFacts: Fact[] = [
  { label: "Type", value: typefaceList },
  {
    label: "Accent",
    value: (
      <span className={styles.accent}>
        <span aria-hidden="true" className={styles.swatch} />
        Crimson #990000
      </span>
    ),
  },
  { label: "Build", value: buildStamp },
  { label: "Page weight", value: <PageWeight /> },
  {
    label: "Factory art",
    value: (
      <>
        <a href={factoryAttribution.href} target="_blank" rel="noopener">
          {factoryAttribution.linkText}
        </a>
        {factoryAttribution.suffix}
      </>
    ),
  },
  {
    label: "Computer photo",
    value: (
      <span className={styles.longValue}>
        <a href={computerAttribution.work.href} target="_blank" rel="noopener">
          {computerAttribution.work.linkText}
        </a>{" "}
        by{" "}
        <a href={computerAttribution.author.href} target="_blank" rel="noopener">
          {computerAttribution.author.linkText}
        </a>
        ,{" "}
        <a href={computerAttribution.license.href} target="_blank" rel="noopener license">
          {computerAttribution.license.linkText}
        </a>
        . {computerAttribution.note}
      </span>
    ),
  },
];

export function Colophon({ className }: { className?: string }) {
  return (
    <div className={className ? `${styles.colophon} ${className}` : styles.colophon}>
      <h2 className={styles.heading}>Colophon</h2>
      <FactList facts={colophonFacts} variant="colophon" />
    </div>
  );
}
