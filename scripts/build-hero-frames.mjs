// Converts the generated pool-construction video into the frame sequences,
// poster, and idle loop the scroll-scrub Hero component reads at runtime.
// Run manually after dropping the source clip at scripts/hero-source.mp4 —
// this isn't wired into `npm run build` because it depends on a large local
// source file that never gets committed.
//
// Frames are extracted as JPEG first, then re-encoded to WebP with sharp:
// ffmpeg's libwebp encoder packs multiple frames into a single animated
// WebP by default instead of splitting them into a numbered sequence, so
// asking it for hero-%03d.webp directly silently produces one giant file.
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import sharp from "sharp";

const root = fileURLToPath(new URL("..", import.meta.url));
const src = path.join(root, "scripts", "hero-source.mp4");
const framesDir = path.join(root, "public", "frames");
const framesMobileDir = path.join(root, "public", "frames-mobile");
const posterPath = path.join(root, "public", "hero-poster.jpg");
const loopPath = path.join(root, "public", "hero-loop.mp4");
const tmpDir = path.join(root, "scripts", ".hero-frames-tmp");

if (!existsSync(src)) {
  console.error(`Missing source video at ${src}`);
  process.exit(1);
}

for (const dir of [framesDir, framesMobileDir]) {
  rmSync(dir, { recursive: true, force: true });
  mkdirSync(dir, { recursive: true });
}
rmSync(tmpDir, { recursive: true, force: true });
mkdirSync(tmpDir, { recursive: true });

function run(args) {
  console.log("ffmpeg", args.join(" "));
  execFileSync("ffmpeg", args, { stdio: "inherit" });
}

function probe(args) {
  return execFileSync("ffprobe", args).toString().trim();
}

async function extractWebpSequence(scale, outDir) {
  rmSync(tmpDir, { recursive: true, force: true });
  mkdirSync(tmpDir, { recursive: true });
  run(["-y", "-i", src, "-vf", `fps=15,scale=${scale}:-2`, "-q:v", "3", path.join(tmpDir, "raw-%03d.jpg")]);

  const jpgs = readdirSync(tmpDir).filter((f) => /^raw-\d+\.jpg$/.test(f)).sort();
  let width = 0;
  let height = 0;
  for (const [i, file] of jpgs.entries()) {
    const outName = `hero-${String(i + 1).padStart(3, "0")}.webp`;
    const info = await sharp(path.join(tmpDir, file)).webp({ quality: 80 }).toFile(path.join(outDir, outName));
    if (i === 0) {
      width = info.width;
      height = info.height;
    }
  }
  writeFileSync(path.join(outDir, "manifest.json"), JSON.stringify({ count: jpgs.length, width, height }));
  console.log(`${outDir}: ${jpgs.length} frames, ${width}x${height}`);
}

await extractWebpSequence(1920, framesDir);
await extractWebpSequence(960, framesMobileDir);
rmSync(tmpDir, { recursive: true, force: true });

// Poster: last frame, full res.
run(["-y", "-sseof", "-0.1", "-i", src, "-vframes", "1", "-q:v", "3", posterPath]);

// Idle loop: last 2 seconds, muted, small, faststart.
const duration = Number(
  probe(["-v", "error", "-show_entries", "format=duration", "-of", "default=noprint_wrappers=1:nokey=1", src])
);
const loopStart = Math.max(0, duration - 2);
run([
  "-y", "-ss", String(loopStart), "-i", src,
  "-an", "-c:v", "libx264", "-crf", "26", "-preset", "slow",
  "-movflags", "+faststart", "-pix_fmt", "yuv420p",
  loopPath,
]);

console.log(`Done. Poster at ${posterPath}, loop at ${loopPath}.`);
