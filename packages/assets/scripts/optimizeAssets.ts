import * as fs from "fs";
import * as path from "path";
import sharp from "sharp";

const SRC_DIR = path.join(__dirname, "../../../assets");
const DIST_DIR = path.join(__dirname, "../dist/optimized");

async function optimizeVisualAssets() {
  console.log("🎨 Initializing cross-platform visual asset processing core...");

  const targets = [
    { subDir: "logos", format: "webp", quality: 85 },
    { subDir: "images", format: "webp", quality: 80 },
  ];

  for (const target of targets) {
    const inputPath = path.join(SRC_DIR, target.subDir);
    const outputPath = path.join(DIST_DIR, target.subDir);

    if (!fs.existsSync(inputPath)) {
      console.warn(
        `⚠️ Source path directory not found: ${inputPath}. Skipping.`,
      );
      continue;
    }

    fs.mkdirSync(outputPath, { recursive: true });
    const files = fs.readdirSync(inputPath);

    for (const file of files) {
      const ext = path.extname(file).toLowerCase();
      if ([".png", ".jpg", ".jpeg", ".tiff"].includes(ext)) {
        const inputFilePath = path.join(inputPath, file);
        const outputFileName = `${path.parse(file).name}.${target.format}`;
        const outputFilePath = path.join(outputPath, outputFileName);

        console.log(
          `⚡ Processing image transformation matrix: ${file} -> ${outputFileName}`,
        );

        await sharp(inputFilePath)
          .webp({ quality: target.quality, lossless: false })
          .resize({ width: 1200, withoutEnlargement: true }) // Clamp bounds for standard web display
          .toFile(outputFilePath);
      }
    }
  }

  // Handle system icons (SVGs must pass un-rasterized to maintain infinite scalability)
  const iconSrcPath = path.join(SRC_DIR, "icons");
  const iconDistPath = path.join(DIST_DIR, "icons");

  if (fs.existsSync(iconSrcPath)) {
    fs.mkdirSync(iconDistPath, { recursive: true });
    fs.readdirSync(iconSrcPath)
      .filter((file) => path.extname(file).toLowerCase() === ".svg")
      .forEach((file) => {
        fs.copyFileSync(
          path.join(iconSrcPath, file),
          path.join(iconDistPath, file),
        );
        console.log(
          `📂 Vector payload mirrored to distribution bundle: ${file}`,
        );
      });
  }

  console.log(
    "✅ Visual asset packaging and conversion tasks successfully finalized.",
  );
}

optimizeVisualAssets().catch((err) => {
  console.error("❌ Asset compilation aborted due to processing failure:", err);
  process.exit(1);
});
