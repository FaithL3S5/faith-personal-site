export const pageWeightPlaceholder = "--- KB";

export function sumEncodedBodySize(entries: readonly PerformanceEntry[]): number {
  return entries.reduce((total, entry) => {
    const size = (entry as PerformanceResourceTiming).encodedBodySize;
    return total + (Number.isFinite(size) ? size : 0);
  }, 0);
}

export function formatKilobytes(bytes: number): string {
  return `${Math.round(bytes / 1024)} KB`;
}

export function measurePageWeight(performanceApi: Performance): string {
  const entries = [
    ...performanceApi.getEntriesByType("navigation"),
    ...performanceApi.getEntriesByType("resource"),
  ];
  return formatKilobytes(sumEncodedBodySize(entries));
}
