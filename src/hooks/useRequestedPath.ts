"use client";

import { useSyncExternalStore } from "react";

const subscribeToNothing = () => () => {};

export function useRequestedPath(): string | null {
  return useSyncExternalStore(
    subscribeToNothing,
    () => window.location.pathname,
    () => null,
  );
}
