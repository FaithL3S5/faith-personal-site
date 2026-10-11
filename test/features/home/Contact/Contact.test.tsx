import { act, fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { setMediaQueryMatches } from "@test/support/matchMedia";
import { email, links } from "@/content/site";
import { Contact } from "@/features/home/Contact/Contact";
import { reducedMotionQuery } from "@/lib/motion/reducedMotion";

describe("Contact", () => {
  it("lists the email and the profile links", () => {
    render(<Contact />);

    expect(screen.getByText(email)).toBeTruthy();
    expect(screen.getByRole("link", { name: "github.com/FaithL3S5" }).getAttribute("href")).toBe(
      links.gitHub,
    );
    expect(screen.getByRole("img", { name: "Jelly waiting" })).toBeTruthy();
  });

  it("copies the email, then squints and announces it", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", { value: { writeText }, configurable: true });
    render(<Contact />);

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Copy" }));
    });

    expect(writeText).toHaveBeenCalledWith(email);
    expect(screen.getByRole("button", { name: "Copied" })).toBeTruthy();
    expect(screen.getByRole("img", { name: "Jelly squinting" })).toBeTruthy();
    expect(screen.getByRole("status").textContent).toBe("Email copied");
    expect(screen.getByRole("img", { name: "Jelly squinting" }).hasAttribute("data-jumping")).toBe(true);
  });

  it("swaps the pose without jumping under reduced motion", async () => {
    setMediaQueryMatches(reducedMotionQuery, true);
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText: vi.fn().mockResolvedValue(undefined) },
      configurable: true,
    });
    render(<Contact />);

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Copy" }));
    });

    expect(screen.getByRole("img", { name: "Jelly squinting" }).hasAttribute("data-jumping")).toBe(false);
  });
});
