const matchingQueries = new Set<string>();

export function setMediaQueryMatches(query: string, isMatching: boolean) {
  if (isMatching) matchingQueries.add(query);
  else matchingQueries.delete(query);
}

export function installMatchMedia() {
  matchingQueries.clear();
  window.matchMedia = (query: string) =>
    ({
      matches: matchingQueries.has(query),
      media: query,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    }) as MediaQueryList;
}
