import { render } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { notFoundCopy } from "@/content/errors";
import { RequestedPath } from "@/features/error/RequestedPath/RequestedPath";

describe("RequestedPath", () => {
  it("shows the requested path as plain text", () => {
    window.history.pushState({}, "", "/<script>alert(1)</script>");
    const { container } = render(<RequestedPath />);

    expect(container.textContent).toBe("/%3Cscript%3Ealert(1)%3C/script%3E");
    expect(container.querySelector("script")).toBeNull();
    window.history.pushState({}, "", "/");
  });

  it("renders the no-JavaScript fallback on the server", () => {
    expect(renderToString(<RequestedPath />)).toBe(
      `<noscript>${notFoundCopy.referenceFallback.replace("'", "&#x27;")}</noscript>`,
    );
  });
});
