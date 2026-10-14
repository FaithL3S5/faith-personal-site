import type { Metadata } from "next";
import { HeaderWithRuler } from "@/components/layout/HeaderWithRuler/HeaderWithRuler";
import { About } from "@/features/home/About/About";
import { Contact } from "@/features/home/Contact/Contact";
import { Experience } from "@/features/home/Experience/Experience";
import { Hero } from "@/features/home/Hero/Hero";
import { SpecStrip } from "@/features/home/SpecStrip/SpecStrip";
import { Stack } from "@/features/home/Stack/Stack";
import { Work } from "@/features/home/Work/Work";
import { personStructuredData } from "@/lib/personStructuredData";
import styles from "./styles/HomePage.module.css";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personStructuredData()).replace(/</g, "\\u003c") }}
      />
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
