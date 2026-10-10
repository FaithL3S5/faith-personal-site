import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import NotFound from "@/app/not-found";

describe("NotFound", () => {
  it("renders the lost page with the error layout", () => {
    window.history.pushState({}, "", "/nowhere");
    render(<NotFound />);

    expect(screen.getByRole("heading", { level: 1, name: "Lost" })).toBeTruthy();
    expect(screen.getByText("This page isn't here")).toBeTruthy();
    expect(screen.getByText("/nowhere", { ignore: "[aria-hidden='true']" })).toBeTruthy();
    expect(screen.getByRole("img", { name: "Jelly, startled" })).toBeTruthy();
    expect(screen.getByRole("link", { name: "Back to home" }).getAttribute("href")).toBe("/");
    expect(screen.queryByRole("img", { name: /looking around/ })).toBeNull();
    window.history.pushState({}, "", "/");
  });
});
