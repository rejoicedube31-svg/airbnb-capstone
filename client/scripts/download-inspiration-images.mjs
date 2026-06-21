/**
 * Download real destination photos into public/images/inspiration/
 * Run once: npm run setup:images
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, "..", "public", "images", "inspiration");

const DESTINATIONS = [
  {
    file: "paris.jpg",
    urls: [
      "https://images.pexels.com/photos/338515/pexels-photo-338515.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.unsplash.com/photo-1502602898657-3e91766cbb7?w=800&q=80",
    ],
  },
  {
    file: "new-york.jpg",
    urls: [
      "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&q=80",
      "https://images.pexels.com/photos/2901209/pexels-photo-2901209.jpeg?auto=compress&cs=tinysrgb&w=800",
    ],
  },
  {
    file: "tokyo.jpg",
    urls: [
      "https://images.pexels.com/photos/2506923/pexels-photo-2506923.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.unsplash.com/photo-1540959733332-eab4deab073f?w=800&q=80",
    ],
  },
  {
    file: "cape-town.jpg",
    urls: [
      "https://images.pexels.com/photos/259447/pexels-photo-259447.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.unsplash.com/photo-1580060839134-75a3eade3bf6?w=800&q=80",
    ],
  },
  {
    file: "phuket.jpg",
    urls: [
      "https://images.pexels.com/photos/1450363/pexels-photo-1450363.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/457881/pexels-photo-457881.jpeg?auto=compress&cs=tinysrgb&w=800",
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

  for (const dest of DESTINATIONS) {
    await downloadOne(dest);
  }

  console.log("\nDone — refresh http://localhost:5173");
}

main().catch((err) => {
  console.error("Download failed:", err.message);
  process.exit(1);
});
