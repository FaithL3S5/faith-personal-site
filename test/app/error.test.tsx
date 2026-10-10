import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import ErrorPage from "@/app/error";

describe("ErrorPage", () => {
  it("shows the digest and retries on Try again", () => {
    const retry = vi.fn();
    const error = Object.assign(new Error("boom"), { digest: "3141592653" });
    render(<ErrorPage error={error} retry={retry} />);

    expect(screen.getByRole("heading", { level: 1, name: "Broken" })).toBeTruthy();
    expect(screen.getByText("3141592653", { ignore: "[aria-hidden='true']" })).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "Try again" }));
    expect(retry).toHaveBeenCalledOnce();
  });

  it("falls back to unavailable without a digest", () => {
    render(<ErrorPage error={new Error("boom")} retry={() => {}} />);
    expect(screen.getByText("unavailable", { ignore: "[aria-hidden='true']" })).toBeTruthy();
  });
});
