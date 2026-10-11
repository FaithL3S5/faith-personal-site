import { HeaderWithRuler } from "@/components/layout/HeaderWithRuler/HeaderWithRuler";
import { About } from "@/features/home/About/About";
import { Contact } from "@/features/home/Contact/Contact";
import { Experience } from "@/features/home/Experience/Experience";
import { Hero } from "@/features/home/Hero/Hero";
import { SpecStrip } from "@/features/home/SpecStrip/SpecStrip";
import { Stack } from "@/features/home/Stack/Stack";
import { Work } from "@/features/home/Work/Work";
import styles from "./styles/HomePage.module.css";

export default function HomePage() {
  return (
    <>
      <HeaderWithRuler variant="home" />
      <main id="main" tabIndex={-1} className={styles.main} data-wave-motion="">
        <Hero />
        <SpecStrip />
        <About />
        <Work />
        <Experience />
        <Stack />
        <Contact />
      </main>
    </>
  );
}
