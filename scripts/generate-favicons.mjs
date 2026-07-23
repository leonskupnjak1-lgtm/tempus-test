// One-off asset generator, run manually (npm run favicons:generate) — not
// part of the Vercel build. Rasterizes the existing public/favicon.svg logo
// mark into the PNG/ICO sizes browsers and OSes actually need, since SVG
// favicons alone aren't supported everywhere (old crawlers, Apple touch
// icons, Android home-screen icons).
import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import sharp from "sharp";
import pngToIco from "png-to-ico";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const publicDir = path.join(root, "public");
const svgPath = path.join(publicDir, "favicon.svg");

async function main() {
  const svg = await readFile(svgPath);

  const sizes = [16, 32, 48, 180, 192, 512];
  const pngBuffers = {};
  for (const size of sizes) {
    const buf = await sharp(svg, { density: 384 }).resize(size, size).png().toBuffer();
    pngBuffers[size] = buf;
  }

  await writeFile(path.join(publicDir, "apple-touch-icon.png"), pngBuffers[180]);
  await writeFile(path.join(publicDir, "icon-192.png"), pngBuffers[192]);
  await writeFile(path.join(publicDir, "icon-512.png"), pngBuffers[512]);
  await writeFile(path.join(publicDir, "favicon-32x32.png"), pngBuffers[32]);
  await writeFile(path.join(publicDir, "favicon-16x16.png"), pngBuffers[16]);

  const ico = await pngToIco([pngBuffers[16], pngBuffers[32], pngBuffers[48]]);
  await writeFile(path.join(publicDir, "favicon.ico"), ico);

  console.log("Favicons written to /public: favicon.ico, apple-touch-icon.png, icon-192.png, icon-512.png, favicon-32x32.png, favicon-16x16.png");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
