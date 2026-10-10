import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PillLink } from "@/components/ui/Pill/PillLink";

describe("PillLink", () => {
  it("opens external links in a new tab with noopener", () => {
    render(
      <PillLink href="https://example.com" variant="outline" arrow="out" isExternal>
        Open the deck
      </PillLink>,
    );

    const link = screen.getByRole("link", { name: "Open the deck" });
    expect(link.getAttribute("target")).toBe("_blank");
    expect(link.getAttribute("rel")).toBe("noopener");
    expect(link.querySelector("[data-arrow='out']")?.getAttribute("aria-hidden")).toBe("true");
  });

  it("keeps in-page links in the same tab", () => {
    render(
      <PillLink href="#work" variant="primary">
        View work
      </PillLink>,
    );

    const link = screen.getByRole("link", { name: "View work" });
    expect(link.getAttribute("target")).toBeNull();
    expect(link.getAttribute("href")).toBe("#work");
  });
});
