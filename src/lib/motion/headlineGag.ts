export const headlineGagAttribute = "data-headline-gag";

const playedStorageKey = "headline-gag-played";

export const headlineGagScript = `try{if(location.pathname==="/"&&!sessionStorage.getItem("${playedStorageKey}")&&!matchMedia("(prefers-reduced-motion: reduce)").matches){document.documentElement.setAttribute("${headlineGagAttribute}","");sessionStorage.setItem("${playedStorageKey}","1")}}catch(e){}`;

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
