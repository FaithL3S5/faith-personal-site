"use client";

import { animate, createScope, stagger, utils } from "animejs";
import { useEffect, type RefObject } from "react";
import { revealItemSelector } from "@/hooks/useRevealGroup";
import { durations, easeLine, easeOut, riseDistance, siblingStagger } from "@/lib/motion/motionTokens";
import { hasPlayed, markPlayed } from "@/lib/motion/playOnce";
import { prefersReducedMotion } from "@/lib/motion/reducedMotion";

export type SectionRevealSelectors = {
  horizontalLines: string;
  verticalLines: string;
  railItems: readonly string[];
  countUpNumber: string;
  progressSegments: string;
};

const railDelayMs = 100;
const contentDelayMs = 200;
const segmentStaggerMs = 80;

const twoDigits = (value: number) => String(Math.round(value)).padStart(2, "0");

export function useSectionReveal(
  sectionRef: RefObject<HTMLElement | null>,
  sectionNumber: string,
  selectors: SectionRevealSelectors,
) {
  useEffect(() => {
    const section = sectionRef.current;
    const playKey = `section-${sectionNumber}`;
    if (!section || hasPlayed(playKey) || prefersReducedMotion()) return;

    const railSelector = selectors.railItems.join(", ");
    const countUpElement = section.querySelector<HTMLElement>(selectors.countUpNumber);
    const finalNumber = Number(sectionNumber);

    const scope = createScope({ root: section }).add((self) => {
      utils.set(selectors.horizontalLines, { scaleX: 0 });
      utils.set(selectors.verticalLines, { scaleY: 0 });
      utils.set([railSelector, revealItemSelector].join(", "), { opacity: 0, translateY: riseDistance });
      utils.set(selectors.progressSegments, { opacity: 0 });

      self?.add("reveal", () => {
        markPlayed(playKey);
        const lineMotion = { duration: durations.line, ease: easeLine };
        animate(selectors.horizontalLines, { scaleX: 1, ...lineMotion });
        animate(selectors.verticalLines, { scaleY: 1, ...lineMotion });

        const riseMotion = { opacity: 1, translateY: "0rem", duration: durations.base, ease: easeOut };
        animate(railSelector, { ...riseMotion, delay: stagger(siblingStagger, { start: railDelayMs }) });
        animate(revealItemSelector, {
          ...riseMotion,
          delay: stagger(siblingStagger, { start: contentDelayMs }),
        });
        animate(selectors.progressSegments, {
          opacity: 1,
          duration: durations.fast,
          delay: stagger(segmentStaggerMs, { start: railDelayMs }),
        });

        if (!countUpElement) return;
        const counter = { value: 0 };
        countUpElement.style.width = `${countUpElement.getBoundingClientRect().width}px`;
        countUpElement.textContent = twoDigits(0);
        animate(counter, {
          value: finalNumber,
          duration: durations.line,
          delay: railDelayMs,
          modifier: Math.round,
          onUpdate: () => {
            countUpElement.textContent = twoDigits(counter.value);
          },
          onComplete: () => {
            countUpElement.style.width = "";
          },
        });
      });
    });

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        observer.disconnect();
        scope.methods.reveal();
      },
      { threshold: 0.2 },
    );
    observer.observe(section);

    return () => {
      observer.disconnect();
      scope.revert();
      if (!countUpElement) return;
      countUpElement.textContent = sectionNumber;
      countUpElement.style.width = "";
    };
  }, [sectionRef, sectionNumber, selectors]);
}
