export const headlineGagAttribute = "data-headline-gag";

export const headlineGagScript = `if(location.pathname==="/"&&!matchMedia("(prefers-reduced-motion: reduce)").matches){document.documentElement.setAttribute("${headlineGagAttribute}","")}`;

export type HeadlineGagStage = "typo" | "cursor" | "deleted" | "corrected" | "done";

export const headlineGagTimeline: readonly { stage: HeadlineGagStage; atMs: number }[] = [
  { stage: "cursor", atMs: 1200 },
  { stage: "deleted", atMs: 1500 },
  { stage: "corrected", atMs: 1800 },
  { stage: "done", atMs: 2800 },
];

export function gagFirstLine(stage: HeadlineGagStage): { beforeCursor: string; afterCursor: string } {
  if (stage === "deleted") return { beforeCursor: "FULL-ST", afterCursor: "CK" };
  if (stage === "corrected" || stage === "done") return { beforeCursor: "FULL-STA", afterCursor: "CK" };
  return { beforeCursor: "FULL-STU", afterCursor: "CK" };
}
