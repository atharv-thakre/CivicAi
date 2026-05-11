import fs from 'fs';
import path from 'path';

const publicDir = 'e:/1.Code/CivicAi/frontendv2/public';

if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Just a tiny 1x1 transparent PNG pixel base64
const pixel = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=', 'base64');

const files = [
  'favicon.ico',
  'icon-192x192.png',
  'icon-192x192-maskable.png',
  'icon-384x384.png',
  'icon-384x384-maskable.png',
  'icon-512x512.png',
  'icon-512x512-maskable.png',
  'screenshot-1.png',
  'screenshot-mobile-1.png'
];

files.forEach(file => {
  const filePath = path.join(publicDir, file);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, pixel);
    console.log(`Created placeholder: ${file}`);
  }
});
