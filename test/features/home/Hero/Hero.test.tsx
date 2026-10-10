import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Hero } from "@/features/home/Hero/Hero";

describe("Hero", () => {
  it("renders the page heading and the two calls to action", () => {
    render(<Hero />);

    expect(screen.getByRole("heading", { level: 1, name: "FULL-STACK DEVELOPER" })).toBeTruthy();
    expect(screen.getByRole("link", { name: "View work" }).getAttribute("href")).toBe("#work");
    expect(screen.getByRole("link", { name: "Get in touch" }).getAttribute("href")).toBe("#contact");
  });

  it("starts the letter index on F with the counter at 01 / 05", () => {
    const { container } = render(<Hero />);

    expect(container.querySelector("[data-hero-letter]")?.textContent).toBe("F");
    expect(container.querySelector("[data-active]")?.textContent).toBe("F");
    expect(container.querySelector("[data-hero-counter]")?.textContent).toBe("01 / 05");
  });

  it("labels the mobile and tablet Jelly", () => {
    render(<Hero />);
    expect(screen.getByRole("img", { name: "Jelly looking down at the page" })).toBeTruthy();
  });
});
