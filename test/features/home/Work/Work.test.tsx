import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { explainerVideo, links } from "@/content/site";
import { Work } from "@/features/home/Work/Work";

describe("Work", () => {
  it("shows the NDA note and both features", () => {
    render(<Work />);

    expect(screen.getByText(/These two features are the parts I'm cleared to share/)).toBeTruthy();
    expect(screen.getByRole("img", { name: "Jelly raising an eyebrow" })).toBeTruthy();
    expect(screen.getByRole("heading", { level: 3, name: "Content Approval" })).toBeTruthy();
    expect(screen.getByRole("heading", { level: 3, name: "DSME VCS" })).toBeTruthy();
  });

  it("links the deck in a new tab", () => {
    render(<Work />);

    const deck = screen.getByRole("link", { name: "Open the deck" });
    expect(deck.getAttribute("href")).toBe(links.deck);
    expect(deck.getAttribute("target")).toBe("_blank");
  });

  it("loads the YouTube player only after the play button is pressed", () => {
    const { container } = render(<Work />);
    expect(container.querySelector("iframe")).toBeNull();

    fireEvent.click(screen.getByRole("button", { name: "Play the portfolio explainer video" }));

    const player = container.querySelector("iframe");
    expect(player?.getAttribute("src")).toBe(explainerVideo.embedUrl);
    expect(player?.getAttribute("title")).toBe(explainerVideo.title);
  });
});
