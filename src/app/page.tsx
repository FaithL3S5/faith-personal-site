import { HeaderWithRuler } from "@/components/layout/HeaderWithRuler/HeaderWithRuler";

export default function HomePage() {
  return (
    <>
      <HeaderWithRuler variant="home" />
      <main id="main" tabIndex={-1} />
    </>
  );
}
