export const notFoundCopy = {
  tag: "Error / 404",
  numerals: "404",
  title: "Lost",
  kanji: "迷子",
  romaji: "maigo",
  headline: "This page isn't here",
  message: "The link may be old, or the address may have a typo",
  referenceLabel: "Requested",
  referenceNote: "where are you going? 👁",
  referenceFallback: "can't show that, you disabled javascript",
  statusCode: "404",
  statusCaption: "not found",
  jellyAlt: "Jelly, startled",
} as const;

export const serverErrorCopy = {
  tag: "Error / 5xx",
  numerals: "5XX",
  title: "Broken",
  kanji: "故障",
  romaji: "koshō",
  headline: "Something broke",
  message: "The fault is on my side. A reload usually fixes it.",
  referenceLabel: "Reference",
  referenceNote: "what did you do? 👁",
  referenceFallback: "unavailable",
  statusCode: "5xx",
  statusCaption: "something broke",
  jellyAlt: "Jelly with his eyes shut, hiding",
} as const;

export type ErrorCopy = typeof notFoundCopy | typeof serverErrorCopy;
