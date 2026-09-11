import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import type { Lang } from "@/lib/projects";
import { SITE_URL } from "@/lib/site";
import "@/app/globals.css";

const PRETENDARD_CSS =
  "https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css";

export const rootMetadata: Metadata = { metadataBase: new URL(SITE_URL) };

export const rootViewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#F5F6F4",
};

export function RootDocument({ lang, children }: { lang: Lang; children: ReactNode }) {
  return (
    <html lang={lang}>
      <head>
        <link rel="preconnect" href="https://cdn.jsdelivr.net" crossOrigin="anonymous" />
        <link rel="stylesheet" href={PRETENDARD_CSS} />
      </head>
      <body>{children}</body>
    </html>
  );
}
