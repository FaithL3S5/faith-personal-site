import type { ReactNode } from "react";
import { Arrow, type ArrowDirection } from "../Arrow/Arrow";
import { pillClassName, type PillStyleProps } from "./pillClassName";

type PillButtonProps = PillStyleProps & {
  onClick: () => void;
  children: ReactNode;
  arrow?: ArrowDirection;
};

export function PillButton({ onClick, children, arrow, ...styleProps }: PillButtonProps) {
  return (
    <button type="button" onClick={onClick} className={pillClassName(styleProps)}>
      {children}
      {arrow && <Arrow direction={arrow} />}
    </button>
  );
}
