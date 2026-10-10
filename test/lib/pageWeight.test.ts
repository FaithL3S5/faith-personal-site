import { describe, expect, it } from "vitest";
import { formatKilobytes, measurePageWeight, sumEncodedBodySize } from "@/lib/pageWeight";

const entry = (encodedBodySize: number) => ({ encodedBodySize }) as unknown as PerformanceEntry;

describe("pageWeight", () => {
  it("sums the compressed body sizes and ignores entries without one", () => {
    expect(sumEncodedBodySize([entry(1000), entry(2048), {} as PerformanceEntry])).toBe(3048);
  });

  it("returns zero for no entries", () => {
    expect(sumEncodedBodySize([])).toBe(0);
  });

  it("rounds to whole kilobytes", () => {
    expect(formatKilobytes(421_888)).toBe("412 KB");
  });

  it("measures the navigation and resource entries together", () => {
    const performanceApi = {
      getEntriesByType: (type: string) =>
        type === "navigation" ? [entry(10_240)] : [entry(20_480), entry(512)],
    } as unknown as Performance;

    expect(measurePageWeight(performanceApi)).toBe("31 KB");
  });
});
