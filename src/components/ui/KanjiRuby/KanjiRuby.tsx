type KanjiRubyProps = {
  kanji: string;
  romaji: string;
  className?: string;
};

export function KanjiRuby({ kanji, romaji, className }: KanjiRubyProps) {
  return (
    <span lang="ja" aria-hidden="true" className={className}>
      <ruby>
        {kanji}
        <rt>{romaji}</rt>
      </ruby>
    </span>
  );
}
