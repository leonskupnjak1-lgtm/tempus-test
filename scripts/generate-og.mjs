// One-off asset generator (npm run og:generate) — composites the hero photo
// with a bottom gradient and the wordmark into a single 1200x630 share image.
// Not part of the Vercel build; output is committed to /public.
import { writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import sharp from "sharp";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const heroPath = path.join(root, "public/images/hero.jpg");
const outPath = path.join(root, "public/og.jpg");

const WIDTH = 1200;
const HEIGHT = 630;

const overlaySvg = `
<svg width="${WIDTH}" height="${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="fade" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#0a1815" stop-opacity="0" />
      <stop offset="55%" stop-color="#0a1815" stop-opacity="0.15" />
      <stop offset="100%" stop-color="#0a1815" stop-opacity="0.88" />
    </linearGradient>
  </defs>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#fade)" />
  <g transform="translate(72, 486)">
    <path d="M0 34c8-8 16-8 24 0s16 8 24 0 16-8 24-0 16 8 24 0" stroke="#3FE0C0" stroke-width="3.4" stroke-linecap="round" fill="none" />
    <path d="M0 16c8-8 16-8 24 0s16 8 24 0 16-8 24-0 16 8 24 0" stroke="#F2EEE3" stroke-width="2.4" stroke-linecap="round" fill="none" opacity="0.45" />
  </g>
  <text x="72" y="580" font-family="Georgia, 'Times New Roman', serif" font-style="italic" font-size="54" fill="#F2EEE3">Tempus Pool</text>
  <text x="72" y="612" font-family="Arial, sans-serif" font-size="16" letter-spacing="3" fill="#BFE9DF">BAZENI KAO ARHITEKTURA &#183; UMAG, ISTRA</text>
</svg>
`;

async function main() {
  await sharp(heroPath)
    .resize(WIDTH, HEIGHT, { fit: "cover", position: "attention" })
    .composite([{ input: Buffer.from(overlaySvg) }])
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(outPath);

  const { size } = await sharp(outPath).metadata();
  const stat = await (await import("node:fs/promises")).stat(outPath);
  console.log(`og.jpg written: ${WIDTH}x${HEIGHT}, ${(stat.size / 1024).toFixed(0)}KB`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
