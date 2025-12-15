import { zip } from 'zip-a-folder';
import fs from 'fs';
import { readFile } from 'fs/promises';
import path from 'path';
const pkg = JSON.parse(await readFile(new URL('./package.json', import.meta.url)));

const themeName = pkg.name || 'mold-plot';
const version = pkg.version || '1.0.0';
const rootDir = process.cwd();
const outputDir = path.join(rootDir, 'dist');
//const outputZip = path.join(outputDir, `${themeName}-${version}.zip`);
const outputZip = path.join(outputDir, `${themeName}.zip`);
const tempDir = path.join(rootDir, '.zip_temp');

// Folders/files to exclude (top-level)
const excludeList = [
  'node_modules',
  'src',
  '.git',
  '.gitignore',
  'package.json',
  'package-lock.json',
  'yarn.lock',
  'gulpfile.js',
  'gulpfile.mjs',
  '.zip_temp',
  'dist',
  'zip.js',
  'webpack.config.js',
  '.idea',
];

// Helper: recursively copy excluding `.map` files
function copyRecursive(src, dest) {
  if (fs.statSync(src).isDirectory()) {
    fs.mkdirSync(dest, { recursive: true });
    for (const item of fs.readdirSync(src)) {
      const srcPath = path.join(src, item);
      const destPath = path.join(dest, item);

      // Skip excluded folders
      if (excludeList.includes(item)) continue;

      // Skip all `.map` files anywhere
      if (item.endsWith('.map')) continue;

      copyRecursive(srcPath, destPath);
    }
  } else {
    // Skip `.map` files
    if (src.endsWith('.map')) return;
    fs.copyFileSync(src, dest);
  }
}

// Clean dist + temp
if (fs.existsSync(outputDir)) fs.rmSync(outputDir, { recursive: true, force: true });
if (fs.existsSync(tempDir)) fs.rmSync(tempDir, { recursive: true, force: true });

fs.mkdirSync(outputDir, { recursive: true });
fs.mkdirSync(tempDir, { recursive: true });

// Copy filtered files
fs.readdirSync(rootDir).forEach(file => {
  if (excludeList.includes(file)) return;
  if (file.endsWith('.map')) return;

  const srcPath = path.join(rootDir, file);
  const destPath = path.join(tempDir, file);
  copyRecursive(srcPath, destPath);
});

// Create zip from .zip_temp
(async () => {
  await zip(tempDir, outputZip);
  console.log(`✅ Zip created at: ${outputZip}`);

  // Cleanup temp folder
  fs.rmSync(tempDir, { recursive: true, force: true });
})();
