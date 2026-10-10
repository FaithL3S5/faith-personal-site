import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { PillButton } from "@/components/ui/Pill/PillButton";

describe("PillButton", () => {
  it("calls onClick when pressed", () => {
    const handleClick = vi.fn();
    render(
      <PillButton variant="primary" arrow="retry" onClick={handleClick}>
        Try again
      </PillButton>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Try again" }));

    expect(handleClick).toHaveBeenCalledOnce();
  });
});
