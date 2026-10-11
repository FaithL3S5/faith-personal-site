import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { FactorySmoke } from "@/features/home/FactorySmoke/FactorySmoke";

describe("FactorySmoke", () => {
  it("puffs three staggered clouds from each of the four chimney caps", () => {
    const { container } = render(<FactorySmoke />);

    const puffs = [...container.querySelectorAll("circle")];
    expect(container.querySelector("svg")?.getAttribute("aria-hidden")).toBe("true");
    expect(puffs).toHaveLength(12);
    expect(new Set(puffs.map((puff) => puff.style.animationDelay)).size).toBe(12);
  });
});
