import { cleanup } from "@testing-library/react";
import { afterEach, beforeEach } from "vitest";
import { installIntersectionObserver } from "./support/intersectionObserver";
import { installMatchMedia } from "./support/matchMedia";

beforeEach(() => {
  installMatchMedia();
  installIntersectionObserver();
});

afterEach(() => {
  cleanup();
});
