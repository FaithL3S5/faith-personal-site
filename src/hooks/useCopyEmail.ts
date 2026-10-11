"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export const copiedDurationMs = 1800;

export function useCopyEmail(email: string) {
  const [isCopied, setIsCopied] = useState(false);
  const resetTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => clearTimeout(resetTimeoutRef.current), []);

  const copyEmail = useCallback(async (): Promise<boolean> => {
    try {
      await navigator.clipboard.writeText(email);
    } catch {
      return false;
    }
    clearTimeout(resetTimeoutRef.current);
    setIsCopied(true);
    resetTimeoutRef.current = setTimeout(() => setIsCopied(false), copiedDurationMs);
    return true;
  }, [email]);

  return { isCopied, copyEmail };
}
