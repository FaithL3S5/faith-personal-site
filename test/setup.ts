import { cleanup } from "@testing-library/react";
import { afterEach, beforeEach } from "vitest";
import { installIntersectionObserver } from "@test/support/intersectionObserver";
import { installMatchMedia } from "@test/support/matchMedia";

beforeEach(() => {
  installMatchMedia();
  installIntersectionObserver();
});

afterEach(() => {
  cleanup();
});
