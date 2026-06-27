/**
 * Download host questions banner photo into public/images/hosting/
 * Run: npm run setup:images
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, "..", "public", "images", "hosting");

const FETCH_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  Accept: "image/avif,image/webp,image/apng,image/*,*/*;q=0.8",
};

const IMAGES = [
  {
    file: "superhost-banner.jpg",
    urls: [
      "https://images.pexels.com/photos/3762800/pexels-photo-3762800.jpeg?auto=compress&cs=tinysrgb&w=1600",
      "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=1600",
      "https://images.pexels.com/photos/935743/pexels-photo-935743.jpeg?auto=compress&cs=tinysrgb&w=1600",
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
  for (const url of urls) {
    try {
      const res = await fetch(url, { headers: FETCH_HEADERS });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const buf = Buffer.from(await res.arrayBuffer());
      if (buf.length < 5000) throw new Error(`too small (${buf.length} bytes)`);
      fs.writeFileSync(target, buf);
      console.log(`  OK  ${file} (${buf.length} bytes)`);
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
    console.warn(`\n${failed} hosting banner image(s) missing.`);
    process.exit(1);
  }

  console.log("\nHosting banner image ready.");
}

main().catch((err) => {
  console.error("Download failed:", err.message);
  process.exit(1);
});
