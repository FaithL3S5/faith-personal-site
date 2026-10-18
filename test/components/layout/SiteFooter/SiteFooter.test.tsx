import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { links } from "@/content/site";
import { SiteFooter } from "@/components/layout/SiteFooter/SiteFooter";

describe("SiteFooter", () => {
  it("links back to the top and out to the gaming channel", () => {
    render(<SiteFooter />);

    expect(
      screen.getByRole("link", { name: "Back to top" }).getAttribute("href"),
    ).toBe("#top");
    const channel = screen.getByRole("link", {
      name: "Gaming channel, Faith_L3S5",
    });
    expect(channel.getAttribute("href")).toBe(links.gamingChannel);
    expect(channel.getAttribute("target")).toBe("_blank");
  });

  it("captions Jelly in his own words", () => {
    render(<SiteFooter />);
    expect(screen.getByText("^ is a coral slime").tagName).toBe("FIGCAPTION");
  });

  it("links Jelly to his playground with a click-me bubble", () => {
    render(<SiteFooter />);

    const playground = screen.getByRole("link", { name: "Play with Jelly" });
    expect(playground.getAttribute("href")).toBe("/jelly");
    const bubble = screen.getByText("click me");
    expect(playground.contains(bubble)).toBe(true);
    expect(bubble.getAttribute("aria-hidden")).toBe("true");
  });

  it("keeps the attribution links in the colophon", () => {
    render(<SiteFooter />);

    expect(
      screen.getByRole("link", { name: "Building Vectors by Vecteezy" }),
    ).toBeTruthy();
    expect(
      screen.queryByRole("link", { name: "Bonsai Vectors by Vecteezy" }),
    ).toBeNull();
    expect(
      screen.getByRole("link", {
        name: "Japanese Wave Pattern Vectors by Vecteezy",
      }),
    ).toBeTruthy();
    expect(
      screen.getByRole("link", { name: "CC BY 2.0" }).getAttribute("rel"),
    ).toBe("noopener license");
    expect(screen.getByRole("contentinfo").textContent).toContain(
      "© 2026 Muhammad Fatih Fahroji",
    );
  });
});
