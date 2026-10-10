import { sections } from "@/content/sections";
import { sectionHref, type PageVariant } from "@/lib/sectionHref";

type SectionNavLinksProps = {
  variant: PageVariant;
  linkClassName: string;
  numberClassName: string;
  labelClassName: string;
  onNavigate?: () => void;
};

export function SectionNavLinks({
  variant,
  linkClassName,
  numberClassName,
  labelClassName,
  onNavigate,
}: SectionNavLinksProps) {
  return sections.map((section) => (
    <a
      key={section.id}
      href={sectionHref(section.id, variant)}
      className={linkClassName}
      onClick={onNavigate}
    >
      <span aria-hidden="true" className={numberClassName}>
        {section.number}
      </span>
      <span className={labelClassName}>{section.label}</span>
    </a>
  ));
}
