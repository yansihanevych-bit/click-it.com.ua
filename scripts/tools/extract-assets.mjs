// One-off: unpack assets exported from click-it.com.ua into /public/images
import fs from 'node:fs'; import sharp from 'sharp';
const src = process.argv[2];
const data = JSON.parse(fs.readFileSync(src, 'utf8'));
for (const [k, b64] of Object.entries(data.cases)) {
  const buf = Buffer.from(b64, 'base64');
  const img = sharp(buf); const meta = await img.metadata();
  for (const w of [640, 1200]) {
    const width = Math.min(w, meta.width);
    await sharp(buf).resize({ width }).webp({ quality: 74 }).toFile(`public/images/projects/${k}-${w}.webp`);
    await sharp(buf).resize({ width }).avif({ quality: 52 }).toFile(`public/images/projects/${k}-${w}.avif`);
  }
  console.log(k, meta.width, meta.height);
}
for (const [k, v] of Object.entries(data.clients)) {
  const ext = v.type.includes('svg') ? 'svg' : v.type.includes('png') ? 'png' : 'jpg';
  const buf = Buffer.from(v.b64, 'base64');
  fs.writeFileSync(`public/images/clients/${k}.${ext}`, buf);
  if (ext !== 'svg') { const m = await sharp(buf).metadata(); console.log('client', k, ext, m.width, m.height); }
}
