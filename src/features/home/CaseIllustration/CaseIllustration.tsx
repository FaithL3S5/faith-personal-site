import styles from "./styles/CaseIllustration.module.css";

const outline = { strokeWidth: 1.5, strokeLinejoin: "round" } as const;

function StackedLayers() {
  return (
    <>
      <path d="M90 58 170 98 90 138 10 98Z" fill="#141414" stroke="#E2E3E5" {...outline} />
      <path d="M10 98 90 138V152L10 112Z" fill="#141414" stroke="#E2E3E5" {...outline} />
      <path d="M90 138 170 98V112L90 152Z" fill="#141414" stroke="#E2E3E5" {...outline} />
      <path d="M90 30 170 70 90 110 10 70Z" fill="currentColor" stroke="#E2E3E5" {...outline} />
      <path d="M10 70 90 110V124L10 84Z" fill="currentColor" fillOpacity="0.72" stroke="#E2E3E5" {...outline} />
      <path d="M90 110 170 70V84L90 124Z" fill="currentColor" fillOpacity="0.5" stroke="#E2E3E5" {...outline} />
      <path d="M90 2 170 42 90 82 10 42Z" fill="#E2E3E5" stroke="#141414" {...outline} />
      <path d="M10 42 90 82V96L10 56Z" fill="#B4B8BE" stroke="#141414" {...outline} />
      <path d="M90 82 170 42V56L90 96Z" fill="#8A8E94" stroke="#141414" {...outline} />
    </>
  );
}

function FloatingBlock() {
  return (
    <>
      <path d="M90 56 170 96 90 136 10 96Z" fill="#E2E3E5" stroke="#141414" {...outline} />
      <path d="M10 96 90 136V152L10 112Z" fill="#B4B8BE" stroke="#141414" {...outline} />
      <path d="M90 136 170 96V112L90 152Z" fill="#8A8E94" stroke="#141414" {...outline} />
      <path d="M50 76 90 96M130 76 90 96M90 96V116" fill="none" stroke="#141414" strokeWidth="1" strokeDasharray="3 3" />
      <path d="M90 44 130 64 90 84 50 64Z" fill="currentColor" stroke="#141414" {...outline} />
      <path d="M50 64 90 84V96L50 76Z" fill="currentColor" fillOpacity="0.72" stroke="#141414" {...outline} />
      <path d="M90 84 130 64V76L90 96Z" fill="currentColor" fillOpacity="0.5" stroke="#141414" {...outline} />
      <path d="M90 8 130 28 90 48 50 28Z" fill="none" stroke="#141414" strokeWidth="1.2" strokeDasharray="4 4" strokeLinejoin="round" />
      <path d="M90 48V44" fill="none" stroke="#141414" strokeWidth="1.2" strokeDasharray="2 2" />
    </>
  );
}

export function CaseIllustration({ variant }: { variant: "stack" | "frame" }) {
  return (
    <svg viewBox="0 0 180 154" aria-hidden="true" className={styles.illustration}>
      {variant === "stack" ? <StackedLayers /> : <FloatingBlock />}
    </svg>
  );
}
