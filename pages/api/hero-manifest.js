import fs from "fs";
import path from "path";

const IMAGE_PATTERN = /\.(jpg|jpeg|png|webp)$/i;

export default function handler(req, res) {
  const heroDir = path.join(process.cwd(), "public", "images", "hero");
  const images = fs.readdirSync(heroDir).filter((f) => IMAGE_PATTERN.test(f));
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.json({ images });
}
