import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import HomePage from "@/app/page";

describe("HomePage", () => {
  it("renders one h1 and every section inside main", () => {
    render(<HomePage />);

    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    const main = screen.getByRole("main");
    expect(main.id).toBe("main");
    for (const sectionId of ["about", "work", "experience", "stack", "contact"]) {
      expect(main.querySelector(`#${sectionId}`)).not.toBeNull();
    }
  });
});
