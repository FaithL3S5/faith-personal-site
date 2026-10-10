import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { notFoundCopy } from "@/content/errors";
import { links } from "@/content/site";
import { StatusStrip } from "@/features/error/StatusStrip/StatusStrip";

describe("StatusStrip", () => {
  it("shows the reference, the status code, and the way back", () => {
    render(<StatusStrip copy={notFoundCopy} referenceValue="/missing" />);

    expect(screen.getByText("B1 / Requested")).toBeTruthy();
    expect(screen.getByText("/missing")).toBeTruthy();
    expect(screen.getByText("not found")).toBeTruthy();

    const stillOnline = within(screen.getByRole("navigation", { name: "Still online" }));
    expect(stillOnline.getByRole("link", { name: "Work" }).getAttribute("href")).toBe("/#work");
    const resume = stillOnline.getByRole("link", { name: "Resume" });
    expect(resume.getAttribute("href")).toBe(links.resume);
    expect(resume.getAttribute("target")).toBe("_blank");
    expect(stillOnline.getByRole("link", { name: "Home" }).getAttribute("target")).toBeNull();
  });
});
