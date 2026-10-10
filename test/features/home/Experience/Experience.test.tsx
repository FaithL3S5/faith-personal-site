import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { links } from "@/content/site";
import { Experience } from "@/features/home/Experience/Experience";

describe("Experience", () => {
  it("lists the four roles in order with the current one marked", () => {
    render(<Experience />);

    const rows = within(screen.getByRole("list")).getAllByRole("listitem");
    expect(rows.map((row) => within(row).getByRole("heading").textContent)).toEqual([
      "SMBC Indonesia",
      "PLN Icon Plus",
      "Independent development",
      "Bank KB Bukopin",
    ]);
    expect(within(rows[0]).getByText("Now")).toBeTruthy();
    expect(within(rows[1]).queryByText("Now")).toBeNull();
  });

  it("downloads the resume and links LinkedIn", () => {
    render(<Experience />);

    expect(screen.getByRole("link", { name: "Resume, PDF" }).getAttribute("href")).toBe(links.resume);
    expect(screen.getByRole("link", { name: "Full history on LinkedIn" }).getAttribute("href")).toBe(
      links.linkedIn,
    );
  });
});
