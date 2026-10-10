import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Faith, full-stack developer",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
