import { describe, expect, it } from "vitest";
import { pillClassName } from "@/components/ui/Pill/pillClassName";

describe("pillClassName", () => {
  it("combines the variant, size, stretch, and extra class names", () => {
    const className = pillClassName({
      variant: "resume",
      size: "compact",
      stretchOnMobile: true,
      className: "extra",
    });

    expect(className.split(" ")).toHaveLength(5);
    expect(className).toContain("extra");
  });

  it("leaves out optional classes by default", () => {
    expect(pillClassName({ variant: "primary" }).split(" ")).toHaveLength(2);
  });
});
