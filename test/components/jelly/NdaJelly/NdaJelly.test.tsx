import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { NdaJelly } from "@/components/jelly/NdaJelly/NdaJelly";

describe("NdaJelly", () => {
  it("draws Jelly with blinkable eyes and the raised eyebrow", () => {
    render(<NdaJelly className="jelly" />);

    const figure = screen.getByRole("img", { name: "Jelly raising an eyebrow" });
    expect(figure.querySelector("[data-jelly-eyes]")).not.toBeNull();
    expect(figure.querySelector("line")).not.toBeNull();
  });
});
