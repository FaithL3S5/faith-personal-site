import type { ReactNode } from "react";
import { Arrow, type ArrowDirection } from "../Arrow/Arrow";
import { pillClassName, type PillStyleProps } from "./pillClassName";

type PillLinkProps = PillStyleProps & {
  href: string;
  children: ReactNode;
  arrow?: ArrowDirection;
  isExternal?: boolean;
};

export function PillLink({ href, children, arrow, isExternal, ...styleProps }: PillLinkProps) {
  return (
    <a
      href={href}
      className={pillClassName(styleProps)}
      {...(isExternal && { target: "_blank", rel: "noopener" })}
    >
      {children}
      {arrow && <Arrow direction={arrow} />}
    </a>
  );
}
