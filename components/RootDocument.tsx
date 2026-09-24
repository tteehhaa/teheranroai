import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Analytics } from "@/components/Analytics";
import type { Lang } from "@/lib/projects";
import { SITE_URL } from "@/lib/site";
import "@/app/globals.css";

const PRETENDARD_CSS =
  "https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css";

export const rootMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "32x32" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-icon.png",
  },
  // Search engine ownership checks (Naver Search Advisor).
  verification: {
    other: { "naver-site-verification": "4adc7500201d67530645703944e0e88993d8014f" },
  },
};

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
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
