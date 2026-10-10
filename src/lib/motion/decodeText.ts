export const scrambleCharacters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/.°+";

const scrambledCharacterPattern = /[A-Za-z0-9]/;

export function pickScrambleCharacter(random: () => number = Math.random): string {
  return scrambleCharacters[Math.floor(random() * scrambleCharacters.length)];
}

export function decodeFrame(
  target: string,
  lockedCount: number,
  scrambledCharacters: readonly string[],
): string {
  return [...target]
    .map((character, position) =>
      position < lockedCount || !scrambledCharacterPattern.test(character)
        ? character
        : scrambledCharacters[position],
    )
    .join("");
}
