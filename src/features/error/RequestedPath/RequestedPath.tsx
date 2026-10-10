"use client";

import { notFoundCopy } from "@/content/errors";
import { useRequestedPath } from "@/hooks/useRequestedPath";
import { Typer } from "../Typer/Typer";

export function RequestedPath() {
  const requestedPath = useRequestedPath();
  if (requestedPath === null) return <noscript>{notFoundCopy.referenceFallback}</noscript>;
  return <Typer value={requestedPath} />;
}
