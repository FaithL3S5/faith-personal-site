import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { links } from "@/content/site";
import { SpecStrip } from "@/features/home/SpecStrip/SpecStrip";

describe("SpecStrip", () => {
  it("lists the five values with their labels", () => {
    render(<SpecStrip />);

    expect(screen.getAllByRole("term").map((term) => term.textContent?.split(" / ")[1])).toEqual([
      "Location",
      "Coordinates",
      "Local time",
      "Experience",
      "Daily drivers",
    ]);
  });

  it("links the coordinates to the map in a new tab", () => {
    render(<SpecStrip />);

    const mapLink = screen.getByRole("link", { name: "6.2088° S, 106.8456° E" });
    expect(mapLink.getAttribute("href")).toBe(links.coordinates);
    expect(mapLink.getAttribute("rel")).toBe("noopener");
  });

  it("renders the live clock in the local time cell", () => {
    render(<SpecStrip />);
    expect(screen.getByText(/UTC\+07:00$/)).toBeTruthy();
  });
});
