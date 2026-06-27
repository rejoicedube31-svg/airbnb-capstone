/**
 * Download real listing photos into public/images/listings/
 * Run: npm run setup:images  (or node scripts/download-listing-images.mjs)
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, "..", "public", "images", "listings");

const LISTING_IMAGES = [
  {
    file: "apartment-1.jpg",
    urls: [
      "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1200",
      "https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=1200",
    ],
  },
  {
    file: "apartment-2.jpg",
    urls: [
      "https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=800",
    ],
  },
  {
    file: "apartment-3.jpg",
    urls: [
      "https://images.pexels.com/photos/276724/pexels-photo-276724.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/2062431/pexels-photo-2062431.jpeg?auto=compress&cs=tinysrgb&w=800",
    ],
  },
  {
    file: "apartment-4.jpg",
    urls: [
      "https://images.pexels.com/photos/1454806/pexels-photo-1454806.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/1080721/pexels-photo-1080721.jpeg?auto=compress&cs=tinysrgb&w=800",
    ],
  },
  {
    file: "apartment-5.jpg",
    urls: [
      "https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/259588/pexels-photo-259588.jpeg?auto=compress&cs=tinysrgb&w=800",
    ],
  },
  {
    file: "house-1.jpg",
    urls: [
      "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=1200",
      "https://images.pexels.com/photos/280222/pexels-photo-280222.jpeg?auto=compress&cs=tinysrgb&w=1200",
    ],
  },
  {
    file: "house-2.jpg",
    urls: [
      "https://images.pexels.com/photos/3288102/pexels-photo-3288102.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/259950/pexels-photo-259950.jpeg?auto=compress&cs=tinysrgb&w=800",
    ],
  },
  {
    file: "house-3.jpg",
    urls: [
      "https://images.pexels.com/photos/3288104/pexels-photo-3288104.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/584399/living-room-couch-interior-room-584399.jpeg?auto=compress&cs=tinysrgb&w=800",
    ],
  },
  {
    file: "house-4.jpg",
    urls: [
      "https://images.pexels.com/photos/3288105/pexels-photo-3288105.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/271743/pexels-photo-271743.jpeg?auto=compress&cs=tinysrgb&w=800",
    ],
  },
  {
    file: "house-5.jpg",
    urls: [
      "https://images.pexels.com/photos/3288103/pexels-photo-3288103.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/259537/pexels-photo-259537.jpeg?auto=compress&cs=tinysrgb&w=800",
    ],
  },
  {
    file: "bedroom.jpg",
    urls: [
      "https://images.pexels.com/photos/271743/pexels-photo-271743.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=800",
    ],
  },
  {
    file: "new-york.jpg",
    urls: [
      "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=1200&q=80",
      "https://images.pexels.com/photos/2901209/pexels-photo-2901209.jpeg?auto=compress&cs=tinysrgb&w=1200",
    ],
  },
  {
    file: "paris.jpg",
    urls: [
      "https://images.pexels.com/photos/338515/pexels-photo-338515.jpeg?auto=compress&cs=tinysrgb&w=1200",
      "https://images.unsplash.com/photo-1502602898657-3e91766cbb7?w=1200&q=80",
    ],
  },
  {
    file: "tokyo.jpg",
    urls: [
      "https://images.pexels.com/photos/2506923/pexels-photo-2506923.jpeg?auto=compress&cs=tinysrgb&w=1200",
      "https://images.unsplash.com/photo-1540959733332-eab4deab073f?w=1200&q=80",
    ],
  },
  {
    file: "phuket.jpg",
    urls: [
      "https://images.pexels.com/photos/1450363/pexels-photo-1450363.jpeg?auto=compress&cs=tinysrgb&w=1200",
      "https://images.pexels.com/photos/457881/pexels-photo-457881.jpeg?auto=compress&cs=tinysrgb&w=1200",
    ],
  },
];

async function downloadOne({ file, urls }) {
  const target = path.join(outDir, file);
  if (fs.existsSync(target) && fs.statSync(target).size > 5000) {
    console.log(`  SKIP ${file} (already exists)`);
    return;
  }

  let lastError = "";
  for (const url of urls) {
    try {
      const res = await fetch(url, {
        headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) airbnb-capstone/1.0" },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const buf = Buffer.from(await res.arrayBuffer());
      if (buf.length < 5000) throw new Error(`too small (${buf.length} bytes)`);
      fs.writeFileSync(target, buf);
      console.log(`  OK  ${file} (${buf.length} bytes)`);
      return;
    } catch (err) {
      lastError = err.message;
    }
  }

  throw new Error(`${file}: ${lastError}`);
}

async function main() {
  fs.mkdirSync(outDir, { recursive: true });
  console.log(`Saving to ${outDir}\n`);

  for (const item of LISTING_IMAGES) {
    await downloadOne(item);
  }

  console.log("\nDone — run npm run seed in backend to refresh DB paths");
}

main().catch((err) => {
  console.error("Download failed:", err.message);
  process.exit(1);
});
