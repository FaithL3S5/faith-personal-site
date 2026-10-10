"use client";

import { usePageWeight } from "@/hooks/usePageWeight";

export function PageWeight() {
  return <span>{usePageWeight()}</span>;
}
