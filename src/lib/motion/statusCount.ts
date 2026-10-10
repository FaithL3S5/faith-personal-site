export type StatusCountPlan = {
  countTo: number;
  format: (value: number) => string;
};

export function planStatusCount(statusCode: string): StatusCountPlan {
  const countedDigits = statusCode.match(/^\d+/)?.[0] ?? "";
  const fixedSuffix = statusCode.slice(countedDigits.length);
  return {
    countTo: Number(countedDigits),
    format: (value) => `${String(Math.round(value)).padStart(countedDigits.length, "0")}${fixedSuffix}`,
  };
}
