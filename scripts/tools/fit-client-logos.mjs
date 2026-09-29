/** One-off: strip white backgrounds and crop client SVG viewBoxes to their visible content. */
import fs from 'node:fs';
import sharp from 'sharp';
const dir = 'public/images/clients';
for (const f of fs.readdirSync(dir).filter((x) => x.endsWith('.svg'))) {
  let svg = fs.readFileSync(`${dir}/${f}`, 'utf8').replace(/<\?xml[^>]*\?>\s*/, '');
  svg = svg.replace(/<rect width="(\d+)" height="(\d+)" fill="white"><\/rect>/, '');
  const m = svg.match(/viewBox="([\d.\s-]+)"/);
  const [vx, vy, vw, vh] = m[1].trim().split(/\s+/).map(Number);
  const scale = 4;
  const { info } = await sharp(Buffer.from(svg), { density: 72 * scale }).png().trim({ threshold: 1 }).toBuffer({ resolveWithObject: true });
  const px = (vw * scale) / (info.trimOffsetLeft !== undefined ? vw * scale : 1);
  const left = -info.trimOffsetLeft / scale, top = -info.trimOffsetTop / scale;
  const w = info.width / scale, h = info.height / scale;
  const pad = Math.max(w, h) * 0.02;
  const vb = [vx + left - pad, vy + top - pad, w + pad * 2, h + pad * 2].map((n) => +n.toFixed(2));
  svg = svg.replace(/width="[\d.]+" height="[\d.]+" viewBox="[^"]+"/, `width="${vb[2]}" height="${vb[3]}" viewBox="${vb.join(' ')}"`);
  fs.writeFileSync(`${dir}/${f}`, svg);
  console.log(f, vb.join(' '), px ? '' : '');
}
