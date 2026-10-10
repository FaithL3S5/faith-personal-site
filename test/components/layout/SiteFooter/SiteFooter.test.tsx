import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { links } from "@/content/site";
import { SiteFooter } from "@/components/layout/SiteFooter/SiteFooter";

describe("SiteFooter", () => {
  it("links back to the top and out to the gaming channel", () => {
    render(<SiteFooter />);

    expect(screen.getByRole("link", { name: "Back to top" }).getAttribute("href")).toBe("#top");
    const channel = screen.getByRole("link", { name: "Gaming channel, Faith_L3S5" });
    expect(channel.getAttribute("href")).toBe(links.gamingChannel);
    expect(channel.getAttribute("target")).toBe("_blank");
  });

  it("keeps the attribution links in the colophon", () => {
    render(<SiteFooter />);

    expect(screen.getByRole("link", { name: "Building Vectors by Vecteezy" })).toBeTruthy();
    expect(screen.getByRole("link", { name: "CC BY 2.0" }).getAttribute("rel")).toBe(
      "noopener license",
    );
    expect(screen.getByRole("contentinfo").textContent).toContain("© 2026 Muhammad Fatih Fahroji");
  });
});
