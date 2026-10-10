const playedKeys = new Set<string>();

export function hasPlayed(key: string): boolean {
  return playedKeys.has(key);
}

export function markPlayed(key: string) {
  playedKeys.add(key);
}

export function resetPlayedKeys() {
  playedKeys.clear();
}
