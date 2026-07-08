import type { Metadata } from "next";
import { articulat } from "@/lib/fonts";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "MIDHUB",
  description: "MIDHUB — web-first платформа.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" className={articulat.variable}>
      <body>{children}</body>
    </html>
  );
}
