"use client";

import { useEffect, useState } from "react";
import { measurePageWeight, pageWeightPlaceholder } from "@/lib/pageWeight";

export function usePageWeight(): string {
  const [pageWeight, setPageWeight] = useState(pageWeightPlaceholder);

  useEffect(() => {
    const measure = () => setPageWeight(measurePageWeight(window.performance));

    if (document.readyState === "complete") {
      measure();
      return;
    }
    window.addEventListener("load", measure, { once: true });
    return () => window.removeEventListener("load", measure);
  }, []);

  return pageWeight;
}
