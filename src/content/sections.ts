export type SectionId = "about" | "work" | "experience" | "stack" | "contact";

export type Section = {
  id: SectionId;
  number: string;
  label: string;
  kanji: string;
  romaji: string;
};

export const sections: readonly Section[] = [
  { id: "about", number: "01", label: "About", kanji: "自己紹介", romaji: "jikoshōkai" },
  { id: "work", number: "02", label: "Work", kanji: "実績", romaji: "jisseki" },
  { id: "experience", number: "03", label: "Experience", kanji: "経歴", romaji: "keireki" },
  { id: "stack", number: "04", label: "Stack", kanji: "技術", romaji: "gijutsu" },
  { id: "contact", number: "05", label: "Contact", kanji: "連絡先", romaji: "renrakusaki" },
];

export function getSection(id: SectionId): Section {
  const section = sections.find((candidate) => candidate.id === id);
  if (!section) throw new Error(`Unknown section: ${id}`);
  return section;
}
