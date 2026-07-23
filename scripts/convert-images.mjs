// One-off asset generator (npm run images:webp), not part of the Vercel
// build. Writes a .webp sibling next to every .jpg under public/images —
// ImagePlate serves the .webp via <picture><source>, falling back to the
// original .jpg for browsers/crawlers that don't support it.
import { readdir, stat } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import sharp from "sharp";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const imagesDir = path.join(root, "public/images");

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(full)));
    else if (/\.jpe?g$/i.test(entry.name)) files.push(full);
  }
  return files;
}

async function main() {
  const jpgs = await walk(imagesDir);
  let totalBefore = 0;
  let totalAfter = 0;

  for (const jpgPath of jpgs) {
    const webpPath = jpgPath.replace(/\.jpe?g$/i, ".webp");
    const isHero = path.basename(jpgPath) === "hero.jpg";
    // Hero ships above the fold at full viewport width — push quality down
    // a little further to hit the <200KB budget; everything else stays
    // visually lossless-ish at 80.
    const quality = isHero ? 74 : 80;

    await sharp(jpgPath).webp({ quality }).toFile(webpPath);

    const [before, after] = await Promise.all([stat(jpgPath), stat(webpPath)]);
    totalBefore += before.size;
    totalAfter += after.size;
    console.log(
      `${path.relative(imagesDir, jpgPath)}: ${(before.size / 1024).toFixed(0)}KB -> ${(after.size / 1024).toFixed(0)}KB`
    );
  }

  console.log(
    `\n${jpgs.length} images converted. Total ${(totalBefore / 1024 / 1024).toFixed(2)}MB -> ${(totalAfter / 1024 / 1024).toFixed(2)}MB`
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
