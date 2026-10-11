import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { links } from "@/content/site";
import { SiteHeader } from "@/components/layout/SiteHeader/SiteHeader";

function getMenuButton() {
  return screen.getByRole("button", { name: /menu/i });
}

describe("SiteHeader", () => {
  it("links the sections with in-page anchors and shows Jelly on the home page", () => {
    render(<SiteHeader variant="home" />);

    const [desktopNav] = screen.getAllByRole("navigation", { name: "Sections" });
    const aboutLink = within(desktopNav).getByRole("link", { name: "About" });
    expect(aboutLink.getAttribute("href")).toBe("#about");
    expect(screen.getByRole("img", { name: "Jelly, the mascot, looking around" })).toBeTruthy();
    expect(screen.getByRole("link", { name: /^Faith logo/ }).getAttribute("href")).toBe("#top");
  });

  it("points back home and keeps Jelly on error pages", () => {
    render(<SiteHeader variant="error" />);

    const [desktopNav] = screen.getAllByRole("navigation", { name: "Sections" });
    expect(within(desktopNav).getByRole("link", { name: "Contact" }).getAttribute("href")).toBe(
      "/#contact",
    );
    expect(screen.getByRole("img", { name: "Jelly, the mascot, looking around" })).toBeTruthy();
  });

  it("downloads the resume in a new tab", () => {
    render(<SiteHeader variant="home" />);

    const resumeLinks = screen.getAllByRole("link", { name: "Resume", hidden: true });
    for (const resumeLink of resumeLinks) {
      expect(resumeLink.getAttribute("href")).toBe(links.resume);
      expect(resumeLink.getAttribute("rel")).toBe("noopener");
    }
  });

  it("opens the menu, then closes it on a link tap or Escape", () => {
    const { container } = render(<SiteHeader variant="home" />);
    const menuPanel = container.querySelector("#site-menu") as HTMLElement;

    expect(getMenuButton().getAttribute("aria-expanded")).toBe("false");
    expect(getMenuButton().getAttribute("aria-controls")).toBe("site-menu");
    expect(menuPanel.hidden).toBe(true);

    fireEvent.click(getMenuButton());
    expect(getMenuButton().getAttribute("aria-label")).toBe("Close menu");
    expect(menuPanel.hidden).toBe(false);

    fireEvent.click(within(menuPanel).getByRole("link", { name: "Work" }));
    expect(menuPanel.hidden).toBe(true);

    fireEvent.click(getMenuButton());
    fireEvent.keyDown(document, { key: "Escape" });
    expect(getMenuButton().getAttribute("aria-label")).toBe("Open menu");
  });
});
