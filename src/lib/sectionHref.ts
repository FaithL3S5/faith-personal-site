export type PageVariant = "home" | "error";

export function sectionHref(sectionId: string, variant: PageVariant): string {
  return variant === "home" ? `#${sectionId}` : `/#${sectionId}`;
}
