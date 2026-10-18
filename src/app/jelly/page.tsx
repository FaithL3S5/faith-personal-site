import type { Metadata } from "next";
import { JellyPlayground } from "@/features/jelly/JellyPlayground/JellyPlayground";

export const metadata: Metadata = {
  title: "Jelly playground",
};

export default function JellyPage() {
  return <JellyPlayground />;
}
