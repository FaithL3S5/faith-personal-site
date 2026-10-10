"use client";

import { notFoundCopy } from "@/content/errors";
import { useRequestedPath } from "@/hooks/useRequestedPath";

export function RequestedPath() {
  const requestedPath = useRequestedPath();
  if (requestedPath === null) return <noscript>{notFoundCopy.referenceFallback}</noscript>;
  return requestedPath;
}
