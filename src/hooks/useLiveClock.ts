"use client";

import { useEffect, useState } from "react";
import { clockPlaceholder, formatJakartaClock } from "@/lib/jakartaTime";

export function useLiveClock(): string {
  const [clock, setClock] = useState(clockPlaceholder);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    const tick = () => {
      setClock(formatJakartaClock(new Date()));
      timeoutId = setTimeout(tick, 1000 - (Date.now() % 1000));
    };

    const stop = () => clearTimeout(timeoutId);

    const syncWithVisibility = () => {
      stop();
      if (document.visibilityState === "visible") tick();
    };

    syncWithVisibility();
    document.addEventListener("visibilitychange", syncWithVisibility);
    return () => {
      stop();
      document.removeEventListener("visibilitychange", syncWithVisibility);
    };
  }, []);

  return clock;
}
