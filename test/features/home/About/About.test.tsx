import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { About } from "@/features/home/About/About";

describe("About", () => {
  it("renders the paragraph, the plate, and a decorative computer photo", () => {
    const { container } = render(<About />);

    expect(screen.getByRole("region", { name: "About" })).toBeTruthy();
    expect(screen.getByText(/in my third year in this field/)).toBeTruthy();
    expect(screen.getByText("Muhammad Fatih Fahroji")).toBeTruthy();
    expect(screen.getByText("C2, EF SET 88/100")).toBeTruthy();
    expect(container.querySelector("img[alt='']")?.getAttribute("aria-hidden")).toBe("true");
  });
});
