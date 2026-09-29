/** Generates Open Graph images (1200×630): default brand card + one per project cover. */
import fs from 'node:fs';
import sharp from 'sharp';
import { PROJECTS_IMAGES } from './og-projects.mjs';

fs.mkdirSync('public/og/projects', { recursive: true });
fs.mkdirSync('public/brand', { recursive: true });
const logo = fs.readFileSync('src/assets/logo.svg', 'utf8');
const logoInner = logo.replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '');

const grid = Array.from({ length: 18 }, (_, i) => `<line x1="${i * 72}" y1="0" x2="${i * 72}" y2="630" stroke="#E8E8E8"/>`).join('') +
  Array.from({ length: 10 }, (_, i) => `<line x1="0" y1="${i * 72}" x2="1200" y2="${i * 72}" stroke="#E8E8E8"/>`).join('');

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#fff"/>
  <g opacity=".7">${grid}</g>
  <rect x="820" y="0" width="380" height="630" fill="#59ADFF"/>
  <path transform="translate(905 175) scale(1.75)" d="M4.8 0V26.5H73.8L0 100.3L18.7 119.1L92.5 45.3V114.2H119.2V0H4.8Z" fill="#fff"/>
  <svg x="80" y="80" width="380" height="90" viewBox="92 270 1093 260">${logoInner}</svg>
  <text x="80" y="330" font-family="DejaVu Sans, Arial, sans-serif" font-weight="700" font-size="58" letter-spacing="-2" fill="#000">Web Development</text>
  <text x="80" y="400" font-family="DejaVu Sans, Arial, sans-serif" font-weight="700" font-size="58" letter-spacing="-2" fill="#000">&amp; Digital Agency</text>
  <text x="80" y="540" font-family="DejaVu Sans, Arial, sans-serif" font-size="24" fill="#404040">click-it.com.ua  •  UA / PL / EN</text>
</svg>`;
await sharp(Buffer.from(svg)).jpeg({ quality: 86, mozjpeg: true }).toFile('public/og/og-default.jpg');
await sharp(Buffer.from(logo), { density: 300 }).resize({ width: 600 }).png().toFile('public/brand/click-it-logo.png');

for (const name of PROJECTS_IMAGES) {
  await sharp(`public/images/projects/${name}-1200.webp`).resize(1200, 630, { fit: 'cover', position: 'top' }).jpeg({ quality: 82, mozjpeg: true }).toFile(`public/og/projects/${name}.jpg`);
}
console.log('OG images generated');
