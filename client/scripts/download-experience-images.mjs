/**
 * Download experience section photos into public/images/experiences/
 * Run: npm run setup:images
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, "..", "public", "images", "experiences");

const FETCH_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  Accept: "image/avif,image/webp,image/apng,image/*,*/*;q=0.8",
};

const IMAGES = [
  {
    file: "trip.jpg",
    urls: [
      {
        url: "https://a0.muscache.com/im/pictures/airbnb-platform-assets/A0AssetPortal/sharable/original/25z06d1d-dc6b-4523-9e1c-8f2d24ebdd74.jpeg?im_w=1200",
        referer: "https://www.airbnb.com/",
      },
      "https://images.pexels.com/photos/1365425/pexels-photo-1365425.jpeg?auto=compress&cs=tinysrgb&w=1200",
      "https://cdn.pixabay.com/photo/2016/08/19/19/42/underground-1606160_1280.jpg",
    ],
  },
  {
    file: "online.jpg",
    urls: [
      {
        url: "https://a0.muscache.com/im/pictures/airbnb-platform-assets/A0AssetPortal/sharable/original/3a532cb2-8ccd-4031-9b75-0fcc782d00cb.jpeg?im_w=1200",
        referer: "https://www.airbnb.com/",
      },
      "https://images.pexels.com/photos/6605962/pexels-photo-6605962.jpeg?auto=compress&cs=tinysrgb&w=1200",
      "https://images.pexels.com/photos/4253719/pexels-photo-4253719.jpeg?auto=compress&cs=tinysrgb&w=1200",
    ],
  },
];

async function downloadOne({ file, urls }) {
  const target = path.join(outDir, file);
  if (fs.existsSync(target) && fs.statSync(target).size > 5000) {
    console.log(`  SKIP ${file} (already exists)`);
    return true;
  }

  let lastError = "";
  for (const entry of urls) {
    const url = typeof entry === "string" ? entry : entry.url;
    const headers = {
      ...FETCH_HEADERS,
      ...(typeof entry === "object" && entry.referer
        ? { Referer: entry.referer }
        : {}),
    };

    try {
      const res = await fetch(url, { headers });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const buf = Buffer.from(await res.arrayBuffer());
      if (buf.length < 5000) throw new Error(`too small (${buf.length} bytes)`);
      fs.writeFileSync(target, buf);
      console.log(`  OK  ${file} (${buf.length} bytes) <- ${url}`);
      return true;
    } catch (err) {
      lastError = `${url}: ${err.message}`;
    }
  }

  console.warn(`  FAIL ${file} — ${lastError}`);
  return false;
}

async function main() {
  fs.mkdirSync(outDir, { recursive: true });
  console.log(`Saving to ${outDir}\n`);

  let failed = 0;
  for (const image of IMAGES) {
    const ok = await downloadOne(image);
    if (!ok) failed += 1;
  }

  if (failed) {
    console.warn(`\n${failed} experience image(s) missing — remote URLs will be used in the app.`);
    process.exit(1);
  }

  console.log("\nExperience images ready.");
}

main().catch((err) => {
  console.error("Download failed:", err.message);
  process.exit(1);
});
