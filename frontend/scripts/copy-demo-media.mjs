// Copies the subset of backend/media that demo mode needs into public/media,
// so a static build (e.g. on Vercel) can show plants, bugs, items and posts
// without the Django server. Runs automatically before `npm run dev/build`.
import { cpSync, existsSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const src = join(here, "..", "..", "backend", "media");
const dest = join(here, "..", "public", "media");

if (!existsSync(src)) {
  console.warn(`[demo-media] ${src} not found; demo images will be missing.`);
  process.exit(0);
}

const files = [
  ...Array.from({ length: 16 }, (_, i) => `plants/plant${i + 1}.svg`),
  ...Array.from({ length: 12 }, (_, i) => `insects/insect${i + 1}.svg`),
  "items/water_nNK5ICg.png", "items/soil_7Ew1uHl.png", "items/glove_RvSlwKO.png",
  "items/pesticide.png", "items/pesticide-2.png", "items/fertiliser.png",
  "posts/recycling-coffee.jpeg", "posts/bike-lock.jpg", "posts/waiting-bus.jpg",
  "posts/turning-lights.jpg", "posts/Water-Refill.jpg",
];

for (const f of files) {
  const to = join(dest, f);
  if (existsSync(to)) continue;
  mkdirSync(dirname(to), { recursive: true });
  cpSync(join(src, f), to);
}
console.log(`[demo-media] ${files.length} files ready in public/media`);
