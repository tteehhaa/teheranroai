import { RootDocument, rootMetadata, rootViewport } from "@/components/RootDocument";

export const metadata = rootMetadata;
export const viewport = rootViewport;

export default function KoreanRootLayout({ children }: { children: React.ReactNode }) {
  return <RootDocument lang="ko">{children}</RootDocument>;
}
