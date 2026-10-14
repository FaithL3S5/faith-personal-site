import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import HomePage, { metadata } from "@/app/page";
import { fullName, links, siteUrl } from "@/content/site";

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

  it("describes Faith to search engines as a Person", () => {
    const { container } = render(<HomePage />);

    const script = container.querySelector("script[type='application/ld+json']");
    const person = JSON.parse(script?.innerHTML ?? "{}");
    expect(person["@type"]).toBe("Person");
    expect(person.name).toBe(fullName);
    expect(person.url).toBe(siteUrl);
    expect(person.sameAs).toContain(links.gitHub);
  });

  it("names the home page as the canonical address", () => {
    expect(metadata.alternates?.canonical).toBe("/");
  });
});
