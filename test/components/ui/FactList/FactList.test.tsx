import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { FactList } from "@/components/ui/FactList/FactList";

describe("FactList", () => {
  it("renders each fact as a term and description", () => {
    render(
      <FactList
        variant="paper"
        facts={[
          { label: "Role", value: "Sole owner, backend to frontend" },
          { label: "Built", value: "2025", stacksOnMobile: true },
        ]}
      />,
    );

    expect(screen.getAllByRole("term").map((term) => term.textContent)).toEqual(["Role", "Built"]);
    expect(screen.getByText("Sole owner, backend to frontend").tagName).toBe("DD");
  });
});
