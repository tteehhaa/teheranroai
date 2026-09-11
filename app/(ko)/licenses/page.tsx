import type { Metadata } from "next";
import { BRAND, COPY } from "@/lib/copy";
import { licenseEntries } from "@/lib/licenses";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: `오픈소스 | ${BRAND}`,
  alternates: { canonical: "/licenses" },
  robots: { index: false, follow: true },
};

export default function LicensesPage() {
  return (
    <main className="licenses">
      <p className="lic-back"><a href="/">{COPY.ko.start}</a></p>
      <h1>오픈소스</h1>
      <ul className="lic-list">
        {licenseEntries().map((e) => (
          <li key={e.name}>
            <h2>{e.version ? `${e.name} ${e.version}` : e.name}</h2>
            <p>{e.license}</p>
            <pre>{e.text}</pre>
          </li>
        ))}
      </ul>
    </main>
  );
}
