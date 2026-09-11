import fs from "node:fs";
import path from "node:path";

// Read at build time only: /licenses is statically rendered.

export type LicenseEntry = { name: string; version: string; license: string; text: string };

const root = process.cwd();

function packageDir(name: string, via?: string): string {
  if (!via) return fs.realpathSync(path.join(root, "node_modules", name));
  // pnpm keeps a package's dependencies next to it: .pnpm/<via>@x/node_modules/<name>
  return path.join(packageDir(via), via.startsWith("@") ? "../.." : "..", name);
}

function fromPackage(name: string, opts: { via?: string; label?: string } = {}): LicenseEntry {
  const dir = packageDir(name, opts.via);
  const pkg = JSON.parse(fs.readFileSync(path.join(dir, "package.json"), "utf8"));
  const file = fs.readdirSync(dir).find((f) => /^licen[cs]e/i.test(f));
  return {
    name: opts.label ?? name,
    version: pkg.version,
    license: pkg.license,
    text: file ? fs.readFileSync(path.join(dir, file), "utf8").trim() : "",
  };
}

// The browser bundle uses the React copy compiled into Next, not node_modules/react.
function fromNextCompiled(name: string, version: string): LicenseEntry {
  const dir = path.join(packageDir("next"), "dist/compiled", name);
  return { name, version, license: "MIT", text: fs.readFileSync(path.join(dir, "LICENSE"), "utf8").trim() };
}

function nextReactVersion() {
  const file = path.join(packageDir("next"), "dist/compiled/react/cjs/react.production.js");
  return fs.readFileSync(file, "utf8").match(/exports\.version\s*=\s*"([^"]+)"/)?.[1] ?? "";
}

export function licenseEntries(): LicenseEntry[] {
  const reactVersion = nextReactVersion();
  return [
    fromPackage("curtainsjs", { label: "curtains.js" }),
    {
      name: "Pretendard",
      version: "1.3.9",
      license: "OFL-1.1",
      text: fs.readFileSync(path.join(root, "lib/licenses/pretendard-1.3.9.txt"), "utf8").trim(),
    },
    fromPackage("next"),
    fromNextCompiled("react", reactVersion),
    fromNextCompiled("react-dom", reactVersion),
    fromNextCompiled("scheduler", ""),
    fromPackage("@swc/helpers", { via: "next" }),
  ];
}
