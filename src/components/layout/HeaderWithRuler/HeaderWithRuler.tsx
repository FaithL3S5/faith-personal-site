import type { PageVariant } from "@/lib/sectionHref";
import { Ruler } from "../Ruler/Ruler";
import { SiteHeader } from "../SiteHeader/SiteHeader";

export function HeaderWithRuler({ variant }: { variant: PageVariant }) {
  return (
    <>
      <SiteHeader variant={variant} />
      <Ruler />
    </>
  );
}
