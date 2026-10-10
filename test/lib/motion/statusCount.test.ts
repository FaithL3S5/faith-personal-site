import { describe, expect, it } from "vitest";
import { planStatusCount } from "@/lib/motion/statusCount";

describe("planStatusCount", () => {
  it("counts every digit of 404 from 000", () => {
    const plan = planStatusCount("404");
    expect(plan.countTo).toBe(404);
    expect(plan.format(0)).toBe("000");
    expect(plan.format(37.6)).toBe("038");
  });

  it("counts only the first digit of 5xx and keeps xx fixed", () => {
    const plan = planStatusCount("5xx");
    expect(plan.countTo).toBe(5);
    expect(plan.format(0)).toBe("0xx");
    expect(plan.format(5)).toBe("5xx");
  });
});
