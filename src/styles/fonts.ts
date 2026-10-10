import { Archivo, Chakra_Petch, JetBrains_Mono, Zen_Kaku_Gothic_New } from "next/font/google";

const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-archivo",
});

const chakraPetch = Chakra_Petch({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-chakra-petch",
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

// Japanese glyph files are large, so they load on demand instead of preloading.
const zenKakuGothicNew = Zen_Kaku_Gothic_New({
  weight: ["500", "900"],
  preload: false,
  variable: "--font-zen-kaku",
});

export const fontVariableClassNames = [
  archivo.variable,
  chakraPetch.variable,
  jetBrainsMono.variable,
  zenKakuGothicNew.variable,
].join(" ");
