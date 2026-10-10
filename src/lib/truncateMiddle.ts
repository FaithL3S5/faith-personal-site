const ellipsis = "…";

export function truncateMiddle(value: string, maxLength: number): string {
  const characters = [...value];
  if (characters.length <= maxLength) return value;

  const keptLength = maxLength - ellipsis.length;
  const headLength = Math.ceil(keptLength / 2);
  const tailLength = keptLength - headLength;
  return `${characters.slice(0, headLength).join("")}${ellipsis}${characters.slice(-tailLength).join("")}`;
}
